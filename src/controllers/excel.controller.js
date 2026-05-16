const excelService =
require('../services/excel/excelExport.service');

exports.descargarExcelComparativo =
async (req, res) => {

    try {

        await excelService
            .descargarExcelComparativo(
                req,
                res
            );

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success:false,
            error:error.message
        });
    }
};