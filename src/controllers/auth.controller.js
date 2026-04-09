const jwt = require('jsonwebtoken');
const User = require("../models/user.model");
const Role = require("../models/role.model");

// Clave secreta para JWT
const JWT_SECRET = process.env.JWT_SECRET || 'gesbanca_secret_key_2026';

/* =========================
   LOGIN
========================= */
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validar campos
    if (!username || !password) {
      return res.status(400).json({ 
        success: false,
        message: "Usuario y contraseña son requeridos" 
      });
    }

    // Buscar usuario con su rol
    const user = await User.findOne({ 
      where: { username },
      include: [{ model: Role, as: 'role' }]
    });

    // Validar usuario
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: "Usuario o contraseña incorrectos" 
      });
    }

    // Validar contraseña (texto plano por ahora)
    if (user.password !== password) {
      return res.status(401).json({ 
        success: false,
        message: "Usuario o contraseña incorrectos" 
      });
    }

    // Generar token JWT
    const token = jwt.sign(
      { 
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        role_id: user.role_id,
        role_name: user.role?.role_name || 'Sin rol'
      },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    // Datos del usuario (sin password)
    const userData = {
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      first_name: user.first_name,
      first_surname: user.first_surname,
      role_id: user.role_id,
      role_name: user.role?.role_name || 'Sin rol'
    };

    res.json({
      success: true,
      message: "Login exitoso",
      token: token,
      user: userData
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

/* =========================
   VERIFICAR TOKEN
========================= */
exports.verifyToken = async (req, res) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: "No se proporcionó token" 
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    res.json({
      success: true,
      valid: true,
      user: decoded
    });
  } catch (error) {
    res.status(401).json({ 
      success: false,
      valid: false,
      message: "Token inválido o expirado" 
    });
  }
};

/* =========================
   OBTENER USUARIO ACTUAL
========================= */
exports.getCurrentUser = async (req, res) => {
  try {
    const token = req.headers['authorization']?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: "No se proporcionó token" 
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    const user = await User.findByPk(decoded.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Role, as: 'role' }]
    });
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "Usuario no encontrado" 
      });
    }
    
    res.json({
      success: true,
      user: user
    });
  } catch (error) {
    res.status(401).json({ 
      success: false,
      message: "Token inválido" 
    });
  }
};