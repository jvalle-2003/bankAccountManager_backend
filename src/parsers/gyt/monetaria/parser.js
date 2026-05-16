exports.parse = (text) => {

    const lines = text.split('\n');

    const transactions = [];

    lines.forEach(line => {

        line = line.replace(/\s+/g, ' ').trim();

        if (!line) return;

        // ignorar encabezados
        if (
            line.includes('SALDO INICIAL') ||
            line.includes('SALDO FINAL') ||
            line.includes('NO. DE CREDITOS') ||
            line.includes('VALOR CREDITOS')
        ) {
            return;
        }

        // fecha
        const dateMatch =
            line.match(/^(\d{2})/);

        if (!dateMatch) return;

        // montos
        const amounts =
            line.match(/[0-9,]+\.[0-9]{2}/g);

        if (!amounts || amounts.length < 2)
            return;

        const amount =
            parseFloat(
                amounts[0].replace(/,/g, '')
            );

        const balance =
            parseFloat(
                amounts[1].replace(/,/g, '')
            );

        // referencia
        const referenceMatch =
            line.match(/\d{4,}/);

        const reference =
            referenceMatch
                ? referenceMatch[0]
                : '';

        // descripción
        let description = line;

        description =
            description.replace(/^(\d{2})/, '');

        if (reference) {
            description =
                description.replace(reference, '');
        }

        description =
            description.replace(/[0-9,]+\.[0-9]{2}/g, '');

        description =
            description.trim();

        // tipo
        const type =
            line.includes('PAGO PLANILLA') ||
            line.includes('REINTEGRO')
                ? 'CREDITO'
                : 'DEBITO';

        transactions.push({

            date: dateMatch[1],

            reference,

            description,

            debit:
                type === 'DEBITO'
                    ? amount
                    : 0,

            credit:
                type === 'CREDITO'
                    ? amount
                    : 0,

            balance,

            type,

            status: 'PENDIENTE'
        });
    });

    return transactions;
};