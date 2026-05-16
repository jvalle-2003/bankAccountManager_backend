const Reconciliation =
require('../models/reconciliations.model');

const reconciliationService =
require('../services/reconciliation/reconciliation.service');

const sequelize =
require('../config/db');

exports.analizarEstadoCuenta =
async (req, res) => {

    try {

        // ==============================
        // VALIDAR ARCHIVO
        // ==============================
        if (!req.file) {

            return res.status(400).json({
                success: false,
                error: 'Archivo requerido'
            });
        }

        // ==============================
        // VALIDAR CUENTA
        // ==============================
        if (!req.body.accountId) {

            return res.status(400).json({
                success: false,
                error: 'Cuenta bancaria requerida'
            });
        }

        // ==============================
        // PROCESAR ESTADO DE CUENTA
        // ==============================
        const result =
            await reconciliationService
                .processStatement({

                    file: req.file,

                    accountId:
                        req.body.accountId
                });

        // ==============================
        // RESPONSE
        // ==============================
        return res.status(200).json({

            success: true,

            message:
                'Estado de cuenta procesado correctamente',

            transactions:
                result.transactions || [],

            summary:
                result.summary || {}
        });

    } catch (error) {

        console.error(
            'ERROR ANALIZANDO ESTADO:',
            error
        );

        return res.status(500).json({

            success: false,

            error:
                error.message ||
                'Error interno del servidor'
        });
    }
};

exports.create = async (req, res) => {

    const t = await sequelize.transaction();

    try {

        if (!req.file) {

            await t.rollback();

            return res.status(400).json({
                message: "Archivo requerido"
            });
        }

        const { accountId } = req.body;

        if (!accountId) {

            await t.rollback();

            return res.status(400).json({
                message: "Cuenta requerida"
            });
        }

        const result =
            await reconciliationService
                .processStatement({

                    file: req.file,

                    accountId
                });

        const reconciliation =
            await Reconciliation.create({

                account_id: accountId,

                total_transactions:
                    result.transactions.length,

                reconciled:
                    result.transactions.filter(
                        t => t.status === 'CONCILIADO'
                    ).length,

                pending:
                    result.transactions.filter(
                        t => t.status === 'PENDIENTE'
                    ).length,

                bank:
                    result.bank,

                account_type:
                    result.accountType
            }, {
                transaction: t
            });

        await t.commit();

        res.status(201).json({
            reconciliation,
            transactions:
                result.transactions
        });

    } catch (error) {

        await t.rollback();

        console.error(error);

        res.status(500).json({
            message: error.message
        });
    }
};

exports.findAll = async (req, res) => {

    try {

        const data =
            await Reconciliation.findAll({

                order: [
                    ['reconciliation_id', 'DESC']
                ]
            });

        res.json(data);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};

exports.findOne = async (req, res) => {

    try {

        const reconciliation =
            await Reconciliation.findByPk(
                req.params.id
            );

        if (!reconciliation) {

            return res.status(404).json({
                message:
                    "Conciliación no encontrada"
            });
        }

        res.json(reconciliation);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};

exports.update = async (req, res) => {

    const t = await sequelize.transaction();

    try {

        const { id } = req.params;

        const reconciliation =
            await Reconciliation.findByPk(
                id,
                { transaction: t }
            );

        if (!reconciliation) {

            await t.rollback();

            return res.status(404).json({
                message:
                    "Conciliación no encontrada"
            });
        }

        await reconciliation.update(
            req.body,
            { transaction: t }
        );

        await t.commit();

        res.json(reconciliation);

    } catch (error) {

        await t.rollback();

        console.error(error);

        res.status(500).json({
            message: error.message
        });
    }
};

exports.delete = async (req, res) => {

    const t = await sequelize.transaction();

    try {

        const reconciliation =
            await Reconciliation.findByPk(
                req.params.id,
                { transaction: t }
            );

        if (!reconciliation) {

            await t.rollback();

            return res.status(404).json({
                message:
                    "Conciliación no encontrada"
            });
        }

        await reconciliation.destroy({
            transaction: t
        });

        await t.commit();

        res.json({
            message:
                "Conciliación eliminada"
        });

    } catch (error) {

        await t.rollback();

        console.error(error);

        res.status(500).json({
            message: error.message
        });
    }
};