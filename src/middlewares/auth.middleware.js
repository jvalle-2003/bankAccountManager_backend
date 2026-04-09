const jwt = require('jsonwebtoken');
const { User, Role, Permission } = require('../models');

// ============================================
// Verificar que el usuario está autenticado
// ============================================
const verifyToken = async (req, res, next) => {
    // Obtener token del header Authorization
    const token = req.headers['authorization']?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ 
            success: false,
            message: 'Acceso denegado. No se proporcionó token.' 
        });
    }
    
    try {
        // Verificar token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'gesbanca_secret_key_2026');
        
        // Guardar información del usuario en la request
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

// ============================================
// Verificar que el usuario tiene un permiso específico
// ============================================
const checkPermission = (requiredPermission) => {
    return async (req, res, next) => {
        try {
            const userId = req.userId;
            
            // Buscar usuario con su rol y permisos
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
            
            // Verificar si el usuario tiene el permiso requerido
            const hasPermission = user.role?.permissions?.some(
                p => p.permission_name === requiredPermission
            );
            
            // ✅ CAMBIO AQUÍ: role_id === 2 es ADMIN en tu BD
            const isAdmin = user.role_id === 2;
            
            if (!hasPermission && !isAdmin) {
                return res.status(403).json({ 
                    success: false,
                    message: `Acceso denegado. Se requiere permiso: ${requiredPermission}` 
                });
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

// ============================================
// Verificar rol específico
// ============================================
const checkRole = (allowedRoles) => {
    return async (req, res, next) => {
        try {
            const userId = req.userId;
            
            const user = await User.findByPk(userId, {
                include: [{ model: Role, as: 'role' }]
            });
            
            if (!user) {
                return res.status(404).json({ 
                    success: false,
                    message: 'Usuario no encontrado.' 
                });
            }
            
            // allowedRoles puede ser un array o un número
            const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
            
            if (!rolesArray.includes(user.role_id)) {
                return res.status(403).json({ 
                    success: false,
                    message: 'Acceso denegado. Rol no autorizado.' 
                });
            }
            
            next();
        } catch (error) {
            console.error('Error en checkRole:', error);
            return res.status(500).json({ 
                success: false,
                message: 'Error al verificar rol.' 
            });
        }
    };
};

module.exports = { 
    verifyToken, 
    checkPermission, 
    checkRole 
};