const bankMapper = {
    findPotentialAccounts: (text) => {
        const pattern = /\b\d[\d-]{6,18}\d\b/g;
        return text.match(pattern) || [];
    },

    extractUniversalTransactions: (lines) => {
        const transactions = [];
        let currentMonthYear = "08/2019"; 

        lines.forEach(line => {
            const cleanLine = line.trim();
            if (!cleanLine || cleanLine.includes("Saldo Anterior")) return;

            // Buscamos líneas que tengan al menos dos montos de dinero al final (Monto y Saldo)
            // Ejemplo: "... 100.00 1,378.06"
            const moneyPattern = /([\d,]+\.\d{2})\s+([\d,]+\.\d{2})$/;
            const moneyMatch = cleanLine.match(moneyPattern);

            if (moneyMatch) {
                // El primer pedazo suele ser el día (02, 04, etc)
                const tokens = cleanLine.split(/\s+/);
                const day = tokens[0];

                if (/^\d{1,2}$/.test(day)) {
                    const montoStr = moneyMatch[1].replace(/,/g, '');
                    const saldoStr = moneyMatch[2].replace(/,/g, '');
                    
                    // La descripción es todo lo que está entre el día y los montos
                    const description = cleanLine
                        .replace(day, '')
                        .replace(moneyMatch[0], '')
                        .trim();

                    const isCredit = cleanLine.toUpperCase().includes('PAGO PLANILLA') || 
                                     cleanLine.toUpperCase().includes('REINTEGRO');

                    const amount = parseFloat(montoStr);

                    transactions.push({
                        date: `${day.padStart(2, '0')}/${currentMonthYear}`,
                        description: description || "Transacción G&T",
                        debit: !isCredit ? amount : 0,
                        credit: isCredit ? amount : 0,
                        amount: isCredit ? amount : -amount,
                        balance: parseFloat(saldoStr)
                    });
                }
            }
        });

        return transactions;
    }
};

module.exports = bankMapper;