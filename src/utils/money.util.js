exports.parseMoney = (value) => {

    if (!value) return 0;

    return parseFloat(
        String(value)
            .replace(/,/g, '')
            .replace(/[Q$]/g, '')
            .trim()
    );
};

exports.formatMoney = (value) => {

    return Number(value || 0)
        .toLocaleString('es-GT', {
            minimumFractionDigits: 2
        });
};