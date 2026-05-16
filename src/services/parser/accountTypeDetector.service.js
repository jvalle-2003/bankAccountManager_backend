exports.detectAccountType = (text) => {

    if(text.includes('MONETARIA'))
        return 'MONETARIA';

    if(text.includes('AHORRO'))
        return 'AHORRO';

    if(text.includes('TARJETA'))
        return 'TARJETA';

    return 'GENERIC';
};