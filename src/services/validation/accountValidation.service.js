exports.validateAccount = (account) => {

    const errors = [];

    if (!account)
        errors.push("Cuenta requerida");

    if (!account.account_id)
        errors.push("ID de cuenta requerido");

    if (!account.account_number)
        errors.push("Número de cuenta requerido");

    if (
        account.initial_balance !== undefined &&
        isNaN(parseFloat(account.initial_balance))
    ) {
        errors.push("Saldo inválido");
    }

    return {
        valid: errors.length === 0,
        errors
    };
};