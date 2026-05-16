const sequelize = require("../config/db");

const runWithAudit = async (req, callback) => {
  const userId = req.userId; 

  if (!userId) {
    throw new Error("Falta la autenticación: No se pudo identificar al usuario para la auditoría.");
  }

  let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip || 'IP Desconocida';
  if (typeof ip === 'string' && ip.includes(',')) {
    ip = ip.split(',')[0].trim();
  }

  return await sequelize.transaction(async (t) => {
    try {

      await sequelize.query(`EXEC sp_set_session_context 'user_id', :userId`, { 
        replacements: { userId: userId }, 
        transaction: t 
      });
      
      await sequelize.query(`EXEC sp_set_session_context 'user_ip', :ip`, { 
        replacements: { ip: ip }, 
        transaction: t 
      });

      return await callback(t);

    } catch (error) {
      console.error("Error en la transacción SQL:", error.message);
      throw error;
    }
  });
};

module.exports = { runWithAudit };