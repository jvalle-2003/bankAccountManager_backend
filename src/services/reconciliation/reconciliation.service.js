const fs = require('fs');

const pdfReader =
require('../pdf/pdfReader.service');

const ocrService =
require('../pdf/ocr.service');

const imageProcessor =
require('../pdf/imageProcessor.service');

const normalizer =
require('../parser/textNormalizer.service');

const bankDetector =
require('../parser/bankDetector.service');

const accountDetector =
require('../parser/accountTypeDetector.service');

const parserFactory =
require('../parser/parserFactory.service');

const matchingService =
require('./matching.service');

const Transaction =
require('../../models').Transaction;

exports.processStatement = async ({
    file,
    accountId
}) => {

    let text = '';

    if(file.mimetype === 'application/pdf') {

        text =
            await pdfReader.extractTextFromPDF(
                file.path
            );
    }

    if(!text || text.length < 50) {

        const processed =
            file.path + '_processed.png';

        await imageProcessor.preprocessImage(
            file.path,
            processed
        );

        text =
            await ocrService.extractTextOCR(
                processed
            );

        fs.unlinkSync(processed);
    }

    text = normalizer.normalizeText(text);

    const bank =
        bankDetector.detectBank(text);

    const type =
        accountDetector.detectAccountType(text);

    const parser =
        parserFactory.getParser(bank, type);

    const transactions =
        parser.parse(text);

    const dbTransactions =
        await Transaction.findAll({
            where: {
                account_id: accountId
            }
        });

    const result =
        transactions.map(t => {

            const match =
                matchingService.findMatch(
                    t,
                    dbTransactions
                );

            return {
                ...t,
                status:
                    match
                    ? 'CONCILIADO'
                    : 'PENDIENTE'
            };
        });

    return {
        success:true,
        bank,
        accountType:type,
        transactions:result
    };
};