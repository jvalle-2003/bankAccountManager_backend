const User = require("../models/user.model");
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../utils/emailService');
const sequelize = require("../config/db");
const { runWithAudit } = require("../utils/audit.helper");


/* =========================
   CREAR USUARIO (CRUD normal)
========================= */
exports.create = async (req, res) => {
  try {
    await runWithAudit(req, async (t) => {
      // IMPORTANTE: Se añade { transaction: t } a la consulta
      const user = await User.create(req.body, { transaction: t });
      res.status(201).json(user);
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   OBTENER TODOS LOS USUARIOS
========================= */
exports.findAll = async (req, res) => {
  try {
    // Las consultas SELECT no activan triggers de auditoría (por lo general), no necesitan el helper
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

    if (!user) return res.status(404).json({ message: "User not found" });

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
    await runWithAudit(req, async (t) => {
      // Agregamos la transacción incluso al buscar, para mantener la coherencia
      const user = await User.findByPk(req.params.id, { transaction: t });

      if (!user) return res.status(404).json({ message: "User not found" });

      await user.update(req.body, { transaction: t });
      res.json(user);
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   ELIMINAR USUARIO (lógico)
========================= */
exports.delete = async (req, res) => {
  try {
    await runWithAudit(req, async (t) => {
      const user = await User.findByPk(req.params.id, { transaction: t });

      if (!user) return res.status(404).json({ message: "User not found" });

      await user.update({ active: false }, { transaction: t });
      res.json({ message: "User deleted successfully" });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   REGISTRO DE NUEVO USUARIO (con token)
========================= */
exports.register = async (req, res) => {
  try {
    await runWithAudit(req, async (t) => {
      const userData = {
        ...req.body,
        active: false  
      };
      
      const user = await User.create(userData, { transaction: t });
      
      const token = jwt.sign(
        { user_id: user.user_id, email: user.email },
        'secreto_temporal',
        { expiresIn: '1h' }
      );
      
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
    const decoded = jwt.verify(token, 'secreto_temporal');
    
    // Inyectamos temporalmente el usuario en req para que el helper sepa quién confirmó la cuenta
    req.user = { user_id: decoded.user_id };

    await runWithAudit(req, async (t) => {
      await User.update(
        { active: true },
        { 
          where: { user_id: decoded.user_id },
          transaction: t 
        }
      );
      
      res.json({ message: 'Cuenta confirmada exitosamente. Ya puedes iniciar sesión.' });
    });
    
  } catch (error) {
    res.status(400).json({ message: 'Token inválido o expirado' });
  }
};