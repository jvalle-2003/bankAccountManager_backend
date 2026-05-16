const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sendEmail = require('../utils/emailService').sendEmail;
const { User, Role, Permission  } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'gesbanca_secret_key_2026';

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ 
        success: false,
        message: "Usuario y contraseña son requeridos" 
      });
    }

    const user = await User.findOne({ 
      where: { username },
      include: [{ model: Role, as: 'role' }]
    });

    // Si el usuario no existe, cortamos de una vez
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: "Usuario o contraseña incorrectos" 
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ 
        success: false,
        message: "Usuario o contraseña incorrectos" 
      });
    }

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

    const userData = {
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      first_name: user.first_name,
      first_surname: user.first_surname,
      role_id: user.role_id,
      role_name: user.role?.role_name || 'Sin rol'
    };

    // ==========================================
    // CONFIGURACIÓN DE LA COOKIE HTTP-ONLY
    // ==========================================
    res.cookie('token', token, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'lax', 
      maxAge: 8 * 60 * 60 * 1000 
    });

    res.json({
      success: true,
      message: "Login exitoso",
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

// ==========================================
// CONTROLADOR PARA CERRAR SESIÓN (LOGOUT)
// ==========================================
exports.logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  });
  
  res.json({
    success: true,
    message: "Sesión cerrada correctamente"
  });

};