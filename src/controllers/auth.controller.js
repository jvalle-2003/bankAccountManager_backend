const jwt = require('jsonwebtoken');
const User = require("../models/user.model");
const Role = require("../models/role.model");

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

    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: "Usuario o contraseña incorrectos" 
      });
    }

    if (user.password !== password) {
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