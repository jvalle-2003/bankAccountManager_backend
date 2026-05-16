exports.parse = (text) => {
    const lines = text.split('\n');
    const transactions = [];

    let currentMonth = '01';
    let currentYear = new Date().getFullYear();

    const monthMap = {
        'ENERO': '01', 'FEBRERO': '02', 'MARZO': '03', 'ABRIL': '04',
        'MAYO': '05', 'JUNIO': '06', 'JULIO': '07', 'AGOSTO': '08',
        'SEPTIEMBRE': '09', 'OCTUBRE': '10', 'NOVIEMBRE': '11', 'DICIEMBRE': '12'
    };

    const monthYearMatch = text.match(/Mes:\s*([A-ZÁÉÍÓÚ]+)\s+(\d{4})/i);

    if (monthYearMatch) {
        const monthName = monthYearMatch[1]
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");

        currentMonth = monthMap[monthName] || '01';
        currentYear = monthYearMatch[2];
    }

    for (const line of lines) {

        const cleanLine = line
            .replace(/\u0000/g, '')
            .replace(/\s+/g, ' ')
            .trim();

        if (!cleanLine) continue;

        // ignorar headers
        if (
            cleanLine.includes('Saldo anterior') ||
            cleanLine.includes('DÍA') ||
            cleanLine.includes('RESUMEN') ||
            cleanLine.includes('Página') ||
            cleanLine.includes('MOVIMIENTOS') ||
            cleanLine.includes('DETALLE')
        ) continue;

        const fullFormatMatch = cleanLine.match(
            /^(\d{2})\s+(\d+)\s+(.+?)\s+([\d,]+\.\d{2})\s+([\d,]+\.\d{2})\s+([\d,]+\.\d{2})$/
        );

        if (fullFormatMatch) {

            const [, day, docto, description, debitStr, creditStr, balanceStr] = fullFormatMatch;

            let cleanDescription = description;

            cleanDescription = cleanDescription
                .replace(/DEPARTAMENTO\s*\d*/gi, '') // 🔥 eliminado
                .replace(/^\d+\s*/, '')
                .replace(/\s*-3DS-I-\s*/g, ' ')
                .replace(/\s+-[A-Z0-9]+$/g, '')
                .replace(/\s{2,}/g, ' ')
                .trim();

            const debit = parseFloat(debitStr.replace(/,/g, ''));
            const credit = parseFloat(creditStr.replace(/,/g, ''));

            let finalDebit = 0;
            let finalCredit = 0;
            let type = 'DEBITO';

            if (credit > 0 && debit === 0) {
                finalCredit = credit;
                type = 'CREDITO';
            } else {
                finalDebit = debit;
            }

            if (cleanDescription.toUpperCase().includes('PAGO PLANILLA')) {
                type = 'CREDITO';
                finalCredit = debit;
                finalDebit = 0;
            }

            transactions.push({
                date: `${day}/${currentMonth}/${currentYear}`,
                reference: docto,
                description: cleanDescription,
                debit: finalDebit,
                credit: finalCredit,
                balance: parseFloat(balanceStr.replace(/,/g, '')),
                type,
                status: 'PENDIENTE'
            });

            continue;
        }

        // fallback simple
        const amounts = cleanLine.match(/[\d,]+\.\d{2}/g);
        if (!amounts || amounts.length < 2) continue;

        const dateMatch = cleanLine.match(/^(\d{2})/);
        const day = dateMatch ? dateMatch[1] : '';

        const balance = parseFloat(amounts[amounts.length - 1].replace(/,/g, ''));
        const movement = parseFloat(amounts[0].replace(/,/g, ''));

        let reference = '';
        const refMatch = cleanLine.match(/(\d{4,8})/);
        if (refMatch) reference = refMatch[1];

        let description = cleanLine
            .replace(/[\d,]+\.\d{2}/g, '')
            .replace(/DEPARTAMENTO\s*\d*/gi, '')
            .replace(/^\d{2}/, '')
            .replace(/\s+/g, ' ')
            .trim();

        transactions.push({
            date: day ? `${day}/${currentMonth}/${currentYear}` : '',
            reference,
            description,
            debit: movement,
            credit: 0,
            balance,
            type: 'DEBITO',
            status: 'PENDIENTE'
        });
    }

    return transactions;
};