const monetariaParser =
require('../../parsers/gyt/monetaria/parser.js');

const ahorroParser =
require('../../parsers/gyt/monetaria/parser.js');

const genericParser =
require('../../parsers/generic/generic.parser.js');

exports.getParser = (bank, type) => {

    if (bank === 'GYT' && type === 'MONETARIA')
        return monetariaParser;

    if (bank === 'GYT' && type === 'AHORRO')
        return ahorroParser;

    return genericParser;
};