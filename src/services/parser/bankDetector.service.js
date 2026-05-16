exports.detectBank = (text) => {

    if(text.includes('BANRURAL'))
        return 'BANRURAL';

    if(text.includes('GYT'))
        return 'GYT';

    if(text.includes('BAC'))
        return 'BAC';

    return 'GENERIC';
};