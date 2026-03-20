const User = require("../models/user.model");
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../utils/emailService');

/* =========================
   CREAR USUARIO (CRUD normal)
========================= */
exports.create = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   OBTENER TODOS LOS USUARIOS
========================= */
exports.findAll = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   OBTENER USUARIO POR ID
========================= */
exports.findOne = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user)
      return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   ACTUALIZAR USUARIO
========================= */
exports.update = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user)
      return res.status(404).json({ message: "User not found" });

    await user.update(req.body);

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   ELIMINAR USUARIO (lógico)
========================= */
exports.delete = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user)
      return res.status(404).json({ message: "User not found" });

   await user.update({ active: false });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   REGISTRO DE NUEVO USUARIO (con token)
========================= */
exports.register = async (req, res) => {
  try {
    // Crear usuario (pero inactivo hasta confirmar)
    const userData = {
      ...req.body,
      active: false  // Usuario inactivo hasta confirmar
    };
    
    const user = await User.create(userData);
    
    // Generar token de confirmación (vence en 1 hora)
    const token = jwt.sign(
      { user_id: user.user_id, email: user.email },
      'secreto_temporal',
      { expiresIn: '1h' }
    );
    
    // Enviar correo con token
    const confirmLink = `http://localhost:3002/confirmar?token=${token}`;
    
    await sendEmail(
      user.email,
      'Confirma tu cuenta en GESBANCA',
      `<h1>Bienvenido a GESBANCA</h1>
       <p>Haz clic en el siguiente enlace para confirmar tu cuenta:</p>
       <a href="${confirmLink}">Confirmar cuenta</a>
       <p>O ingresa este token manualmente: <strong>${token}</strong></p>
       <p>El token expira en 1 hora.</p>`
    );
    
    res.status(201).json({ 
      message: 'Usuario creado. Revisa tu correo para confirmar.',
      user_id: user.user_id 
    });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   CONFIRMAR TOKEN (activar usuario)
========================= */
exports.confirm = async (req, res) => {
  try {
    const { token } = req.body;
    
    // Verificar token
    const decoded = jwt.verify(token, 'secreto_temporal');
    
    // Activar usuario
    await User.update(
      { active: true },
      { where: { user_id: decoded.user_id } }
    );
    
    res.json({ message: 'Cuenta confirmada exitosamente. Ya puedes iniciar sesión.' });
    
  } catch (error) {
    res.status(400).json({ message: 'Token inválido o expirado' });
  }
};