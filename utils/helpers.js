const sequelize = require("../config/db");

const runWithAudit = async (req, callback) => {
  return await sequelize.transaction(async (t) => {
    // Tomamos el user_id del token (si existe) o dejamos 1 por defecto
    const userId = req.user?.user_id || 1; 
    const ip = req.ip || '127.0.0.1';

    // Inyectamos las variables en SQL Server para esta transacción
    await sequelize.query(`EXEC sp_set_session_context 'user_id', ${userId}`, { transaction: t });
    await sequelize.query(`EXEC sp_set_session_context 'user_ip', '${ip}'`, { transaction: t });

    // Ejecutamos la acción real del controlador
    return await callback(t);
  });
};

module.exports = { runWithAudit };