const Audit = require("../models/audit.model");

const updateLastActivity = async (req, res, next) => {
    // Supongamos que envías el ID del usuario en el header o ya está autenticado
    // Para probarlo rápido, usaremos un ID que venga en los params o headers
    const userId = req.params.id || req.headers['user-id'];

    if (auditId) {
        try {
            await Audit.update(
                { last_activity: new Date() }, // Sincroniza con la hora actual
                { where: { id: auditId } }
            );
        } catch (error) {
            console.error("Error actualizando actividad:", error);
        }
    }
    next(); // Importante: permite que la petición continúe al controlador
};

module.exports = updateLastActivity;