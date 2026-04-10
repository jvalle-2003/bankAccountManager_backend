const jwt = require('jsonwebtoken');
const { User, Role, Permission } = require('../models');

const verifyToken = async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ 
            success: false,
            message: 'Acceso denegado. No se proporcionó token.' 
        });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'gesbanca_secret_key_2026');
        req.userId = decoded.user_id;
        req.userRole = decoded.role_id;
        req.username = decoded.username;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                success: false,
                message: 'Token expirado. Inicie sesión nuevamente.' 
            });
        }
        return res.status(403).json({ 
            success: false,
            message: 'Token inválido.' 
        });
    }
};

const checkPermission = (requiredPermission) => {
    return async (req, res, next) => {
        try {
            const userId = req.userId;
            
            const user = await User.findByPk(userId, {
                include: [{
                    model: Role,
                    as: 'role',
                    include: [{
                        model: Permission,
                        as: 'permissions',
                        through: { attributes: [] }
                    }]
                }]
            });
            
            if (!user) {
                return res.status(404).json({ 
                    success: false,
                    message: 'Usuario no encontrado.' 
                });
            }
            
            const isAdmin = user.role_id === 2;
            
            if (!isAdmin) {
                const hasPermission = user.role?.permissions?.some(
                    p => p.permission_name === requiredPermission
                );
                
                if (!hasPermission) {
                    return res.status(403).json({ 
                        success: false,
                        message: `Acceso denegado. Se requiere permiso: ${requiredPermission}` 
                    });
                }
            }
            
            next();
        } catch (error) {
            console.error('Error en checkPermission:', error);
            return res.status(500).json({ 
                success: false,
                message: 'Error al verificar permisos.' 
            });
        }
    };
};

module.exports = { verifyToken, checkPermission };