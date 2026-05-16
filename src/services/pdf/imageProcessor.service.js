const sharp = require('sharp');

exports.preprocessImage = async (input, output) => {

    await sharp(input)
        .grayscale()
        .normalize()
        .sharpen()
        .toFile(output);

    return output;
};