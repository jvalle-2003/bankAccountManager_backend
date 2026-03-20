const User = require("../models/user.model");

const trackActivityAndIp = async (req, res, next) => {
    // 1. Obtenemos el ID del usuario (de los headers por ahora para pruebas)
    const userId = req.headers['user-id']; 
    
    // 2. Capturamos la IP real
    // Si estás en localhost verás "::1", es normal
    const clientIp = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    if (userId) {
        try {
            await User.update(
                { 
                    last_activity: new Date(),
                    last_ip: clientIp 
                },
                { where: { id: userId } }
            );
        } catch (error) {
            console.error("Error en el tracker:", error);
        }
    }
    next();
};

module.exports = trackActivityAndIp;