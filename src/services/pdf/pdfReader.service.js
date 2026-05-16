const fs = require('fs');
const pdf = require('pdf-parse');

exports.extractTextFromPDF = async (filePath) => {

    const dataBuffer = fs.readFileSync(filePath);

    const pdfData = await pdf(dataBuffer);

    return pdfData.text || '';
};