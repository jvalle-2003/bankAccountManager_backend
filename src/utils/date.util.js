exports.formatDate = (date) => {

    if (!date) return '';

    const d = new Date(date);

    return d.toISOString().split('T')[0];
};

exports.parseOCRDate = (dateStr) => {

    if (!dateStr) return null;

    const parts = dateStr.split('/');

    if (parts.length !== 3)
        return null;

    const [day, month, year] = parts;

    return new Date(
        `${year}-${month}-${day}`
    );
};