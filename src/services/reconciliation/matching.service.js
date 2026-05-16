exports.findMatch = (
    transaction,
    dbTransactions
) => {

    return dbTransactions.find(db => {

        const montoOCR =
            Math.abs(transaction.amount);

        const montoDB =
            Math.abs(db.amount);

        return (
            Math.abs(montoOCR - montoDB) < 0.01
        );
    });
};