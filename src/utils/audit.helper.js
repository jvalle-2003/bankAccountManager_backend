const sequelize = require("../config/db");

const runWithAudit = async (req, callback) => {
  // 1. OBTENER EL USUARIO DINÁMICO
  // Leemos 'req.userId' que es exactamente lo que inyecta tu middleware 'verifyToken'
  if (!req.userId) {
    throw new Error("Falta la autenticación: No se pudo identificar al usuario para la auditoría.");
  }
  const userId = req.userId; 

  // 2. OBTENER LA IP DINÁMICA
  // Capturamos la IP real desde las cabeceras por si estás detrás de un proxy
  let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip;
  if (typeof ip === 'string' && ip.includes(',')) {
    ip = ip.split(',')[0].trim();
  }
  ip = ip || 'IP Desconocida';

  return await sequelize.transaction(async (t) => {
    // 3. INYECCIÓN SEGURA A SQL SERVER
    // Usamos :userId y :ip junto con 'replacements' para evitar inyecciones SQL
    await sequelize.query(`EXEC sp_set_session_context 'user_id', :userId`, { 
      replacements: { userId: userId },
      transaction: t 
    });
    
    await sequelize.query(`EXEC sp_set_session_context 'user_ip', :ip`, { 
      replacements: { ip: ip },
      transaction: t 
    });

    // Ejecutamos la acción real del controlador
    return await callback(t);
  });
};

module.exports = { runWithAudit };