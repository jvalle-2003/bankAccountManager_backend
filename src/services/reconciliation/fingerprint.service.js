const crypto = require('crypto');

exports.generateFingerprint = (
    transaction
) => {

    const raw = `
        ${transaction.date}
        ${transaction.amount}
        ${transaction.description}
    `;

    return crypto
        .createHash('sha256')
        .update(raw)
        .digest('hex');
};