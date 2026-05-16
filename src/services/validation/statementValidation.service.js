exports.validateStatement = (transactions = []) => {

    const errors = [];

    if (!Array.isArray(transactions)) {
        return {
            valid: false,
            errors: ['Formato inválido']
        };
    }

    if (transactions.length === 0) {
        return {
            valid: false,
            errors: ['No se detectaron transacciones']
        };
    }

    transactions.forEach((t, index) => {

        if (!t.date) {
            errors.push(
                `Fila ${index + 1}: fecha inválida`
            );
        }

        if (!t.description) {
            errors.push(
                `Fila ${index + 1}: descripción vacía`
            );
        }

        if (
            isNaN(parseFloat(t.amount || 0))
        ) {
            errors.push(
                `Fila ${index + 1}: monto inválido`
            );
        }
    });

    return {
        valid: errors.length === 0,
        errors
    };
};