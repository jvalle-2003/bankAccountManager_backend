exports.normalizeText = (text = '') => {

    return text
        .toUpperCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, ' ')
        .trim();
};

exports.cleanDescription = (text = '') => {

    return text
        .replace(/[^A-Z0-9\s]/gi, '')
        .replace(/\s+/g, ' ')
        .trim();
};