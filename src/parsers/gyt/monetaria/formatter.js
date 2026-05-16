exports.formatTransaction = (
    transaction
) => {

    return {

        date:
            transaction.date || '',

        reference:
            transaction.reference || '',

        description:
            transaction.description
                ?.replace(/\s+/g, ' ')
                .trim(),

        debit:
            parseFloat(
                transaction.debit || 0
            ),

        credit:
            parseFloat(
                transaction.credit || 0
            ),

        balance:
            parseFloat(
                transaction.balance || 0
            ),

        type:
            transaction.type || 'DEBITO',

        status:
            transaction.status || 'PENDIENTE'
    };
};