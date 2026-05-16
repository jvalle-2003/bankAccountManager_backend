const supportedBanks = [
    'GYT',
    'BANRURAL',
    'BAC',
    'BI',
    'GENERIC'
];

exports.validateBank = (bank) => {

    if (!bank) {
        return {
            valid: false,
            error: 'Banco no detectado'
        };
    }

    if (!supportedBanks.includes(bank)) {
        return {
            valid: false,
            error: `Banco no soportado: ${bank}`
        };
    }

    return {
        valid: true
    };
};
