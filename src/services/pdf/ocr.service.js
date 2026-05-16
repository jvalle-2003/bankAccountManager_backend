const Tesseract = require('tesseract.js');

exports.extractTextOCR = async (imagePath) => {

    const { data: { text } } =
        await Tesseract.recognize(imagePath, 'spa');

    return text;
};