exports.parse = (text) => {

    const lines = text.split('\n');

    const transactions = [];

    // ==============================
    // DETECTAR MES Y AÑO
    // ==============================
    let month = '01';
    let year = new Date().getFullYear();

    const monthMap = {
        ENERO: '01',
        FEBRERO: '02',
        MARZO: '03',
        ABRIL: '04',
        MAYO: '05',
        JUNIO: '06',
        JULIO: '07',
        AGOSTO: '08',
        SEPTIEMBRE: '09',
        OCTUBRE: '10',
        NOVIEMBRE: '11',
        DICIEMBRE: '12'
    };

    const monthYearMatch =
        text.match(
            /MES:\s*([A-ZÁÉÍÓÚ]+)\s+(\d{4})/
        );

    if (monthYearMatch) {

        const detectedMonth =
            monthYearMatch[1]
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "");

        month =
            monthMap[detectedMonth] || '01';

        year = monthYearMatch[2];
    }

    // ==============================
    // RECORRER LINEAS
    // ==============================
    lines.forEach(line => {

        const cleanLine = line.trim();

        if (!cleanLine)
            return;

        const amounts =
            cleanLine.match(/[0-9,]+\.[0-9]{2}/g);

        if (!amounts || amounts.length < 2)
            return;

        // ==============================
        // DIA
        // ==============================
        const dateMatch =
            cleanLine.match(/^(\d{2})/);

        const day =
            dateMatch
                ? dateMatch[1]
                : '';

        const fullDate =
            day
                ? `${day}/${month}/${year}`
                : '';

        // ==============================
        // REFERENCIA
        // ==============================
        const referenceMatch =
            cleanLine.match(/\s(\d{4,})/);

        // ==============================
        // SALDO
        // ==============================
        const balance =
            parseFloat(
                amounts[amounts.length - 1]
                    .replace(/,/g, '')
            );

        // ==============================
        // MOVIMIENTO
        // ==============================
        const movement =
            parseFloat(
                amounts[amounts.length - 2]
                    .replace(/,/g, '')
            );

        // ==============================
        // TIPO
        // ==============================
        const isCredit =
            cleanLine.includes('PAGO PLANILLA') ||
            cleanLine.includes('REINTEGRO');

        // ==============================
        // LIMPIAR DESCRIPCION
        // ==============================
        let description = cleanLine;

        description =
            description.replace(/^\d{2}\s*/, '');

        description =
            description.replace(
                /DEPARTAMENTO\s+\d+/gi,
                ''
            );

        description =
            description.replace(
                /BCA\.\s*EMPRESA/gi,
                ''
            );

        description =
            description.replace(
                /COB\.CTA\.AJENA/gi,
                ''
            );

        description =
            description.replace(
                /OPER\.\s*AUTOM\./gi,
                ''
            );

        if (referenceMatch) {

            description =
                description.replace(
                    referenceMatch[1],
                    ''
                );
        }

        description =
            description.replace(
                /[0-9,]+\.[0-9]{2}/g,
                ''
            );

        description =
            description
                .replace(/\s+/g, ' ')
                .trim();

        transactions.push({

            date: fullDate,

            reference:
                referenceMatch
                    ? referenceMatch[1]
                    : '',

            description,

            debit:
                isCredit ? 0 : movement,

            credit:
                isCredit ? movement : 0,

            balance,

            type:
                isCredit
                    ? 'CREDITO'
                    : 'DEBITO',

            status: 'PENDIENTE'
        });
    });

    return transactions;
};