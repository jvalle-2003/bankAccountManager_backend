const User = require("../models/user.model");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../utils/emailService');
const { runWithAudit } = require("../utils/audit.helper");
const { generateReport } = require("../utils/report.generator");

const JWT_SECRET = process.env.JWT_SECRET || 'gesbanca_secret_key_2026';

/* =========================
   1. CREAR USUARIO (Solo Admin)
========================= */
exports.create = async (req, res) => {
  try {
    await runWithAudit(req, async (t) => {
      const tempPassword = Math.random().toString(36).slice(-10); 
      const hasedTempPassword = await bcrypt.hash(tempPassword, 10);
      const userData = { 
          ...req.body, 
          password: hasedTempPassword, 
          active: false 
      };
      
      const user = await User.create(userData, { transaction: t });
      
      // 2. Generamos un token especial para la configuración de la clave (válido por 24h)
      const token = jwt.sign(
        { user_id: user.user_id, email: user.email },
        JWT_SECRET,
        { expiresIn: '24h' } 
      );
      
      // 3. Preparamos el enlace (Asegúrate de que el puerto 3002 coincida con tu frontend)
      const setupLink = `http://localhost:3000/passwordConfig?token=${token}`;
      
      // 4. Enviamos el correo de bienvenida
      await sendEmail(
        user.email,
        'Bienvenido a GESBANCA - Configura tu acceso',
        `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h1>¡Hola, bienvenido a GESBANCA!</h1>
            <p>Un administrador ha creado una cuenta para ti. Para activar tu cuenta y configurar tu contraseña, haz clic en el siguiente botón:</p>
            <br>
            <a href="${setupLink}" style="padding: 12px 25px; background-color: #2196F3; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Configurar mi contraseña</a>
            <br><br>
            <p>Si el botón no funciona, copia y pega este enlace en tu navegador:</p>
            <p>${setupLink}</p>
            <br>
            <p><em>Este enlace expirará en 24 horas por motivos de seguridad.</em></p>
        </div>
        `
      );
      
      // 5. Devolvemos la respuesta limpia sin contraseña
      const userResponse = user.toJSON();
      delete userResponse.password;
      
      res.status(201).json({
        success: true,
        message: "Usuario creado exitosamente. Se ha enviado un correo para configurar la contraseña.",
        user: userResponse
      });
    });
  } catch (error) {
    console.error("Error creando usuario:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =========================
   2. CONFIGURAR CONTRASEÑA (Ruta Pública para el Empleado)
========================= */
exports.setupPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
        return res.status(400).json({ success: false, message: "El token y la nueva contraseña son obligatorios." });
    }

    // 1. Verificamos el token del correo
    const decoded = jwt.verify(token, JWT_SECRET);

    // 2. Engañamos al sistema inyectando el ID en 'req' para que la auditoría funcione
    req.userId = decoded.user_id;

    await runWithAudit(req, async (t) => {
      // 3. Encriptamos la nueva contraseña
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // 4. Guardamos la clave y activamos la cuenta
      await User.update(
        { password: hashedPassword, active: true },
        { 
          where: { user_id: decoded.user_id },
          transaction: t 
        }
      );

      res.json({ 
          success: true, 
          message: "¡Contraseña configurada exitosamente! Ya puedes iniciar sesión." 
      });
    });

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
        return res.status(400).json({ success: false, message: "El enlace ha expirado. Pide al administrador que te reenvíe el acceso." });
    }
    res.status(500).json({ success: false, message: "Token inválido o error en el servidor." });
  }
};

//MODIFICACION DE CONTRASEÑA OLVIDADA POR EL USUARIO (Ruta Pública)
exports.forgotPassword = async (req, res) => {
    const { email, username, nombre, apellido } = req.body;

    try {
        const user = await User.findOne({
          where:{
            email: email,
            username: username,
            first_name: nombre,
            first_surname: apellido
          }
        });
        
        if (!user) {
            return res.status(404).json({ 
            success: false, 
            message: "Los datos ingresados no corresponden a ningún usuario registrado." });
        }

        // 2. Generamos un token (válido por 1 hora)
        const token = jwt.sign(
            { user_id: user.user_id, email: user.email },
            process.env.JWT_SECRET || 'tu_secreto', // Usa tu variable de entorno
            { expiresIn: '1h' } 
        );

        // 3. Preparamos el enlace que dirige a la página que me acabas de compartir
        const resetLink = `http://localhost:3000/passwordConfig?token=${token}`;

        // 4. Enviamos el correo
        await sendEmail(
            user.email,
            'Recuperación de Contraseña - GESBANCA',
            `
            <div style="font-family: Arial, sans-serif;">
                <h2>Recuperación de Contraseña</h2>
                <p>Hola,</p>
                <p>Hemos recibido una solicitud para restablecer tu contraseña. Haz clic en el siguiente enlace para crear una nueva:</p>
                <a href="${resetLink}" style="padding: 10px 20px; background-color: #2196F3; color: white; text-decoration: none; border-radius: 5px;">Restablecer Contraseña</a>
                <p><br><em>Este enlace expirará en 1 hora. Si no solicitaste este cambio, ignora este correo.</em></p>
            </div>
            `
        );

        res.status(200).json({ 
        success: true, 
        message: "Datos verficados, en momentos se enviará el enlace de recuperación." });

    } catch (error) {
        console.error("Error en forgotPassword:", error);
        res.status(500).json({ success: false, message: "Error al procesar la solicitud." });
    }
};

/* =========================
   3. OBTENER TODOS LOS USUARIOS
========================= */
exports.findAll = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] } // SEGURIDAD
    });
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =========================
   4. OBTENER USUARIO POR ID
========================= */
exports.findOne = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] } // SEGURIDAD
    });

    if (!user) return res.status(404).json({ success: false, message: "Usuario no encontrado" });

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =========================
   5. ACTUALIZAR USUARIO
========================= */
exports.update = async (req, res) => {
  try {
    await runWithAudit(req, async (t) => {
      const user = await User.findByPk(req.params.id, { transaction: t });

      if (!user) return res.status(404).json({ success: false, message: "Usuario no encontrado" });

      // Si por alguna razón el Admin fuerza un cambio de clave, la encriptamos
      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      }

      await user.update(req.body, { transaction: t });
      
      const userResponse = user.toJSON();
      delete userResponse.password;
      
      res.json({ 
          success: true, 
          message: "Usuario actualizado correctamente",
          user: userResponse 
      });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =========================
   6. ELIMINAR USUARIO (Lógico)
========================= */
exports.delete = async (req, res) => {
  try {
    await runWithAudit(req, async (t) => {
      const user = await User.findByPk(req.params.id, { transaction: t });

      if (!user) return res.status(404).json({ success: false, message: "Usuario no encontrado" });

      await user.update({ active: false }, { transaction: t });
      
      res.json({ success: true, message: "Usuario desactivado correctamente" });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =========================
   7. EXPORTAR REPORTE
========================= */
exports.exportReport = async (req, res) => {
  try {
    const format = req.query.format || "excel";
    const users = await User.findAll();

    const excelConfig = {
      columns: [
        { header: "Usuario", key: "username", width: 20 },
        { header: "Email", key: "email", width: 35 },
        { header: "Estado", key: "status", width: 15 },
      ],
      data: users.map(u => ({
        username: u.username,
        email: u.email,
        status: u.active ? "ACTIVO" : "INACTIVO"
      }))
    };

    const pdfConfig = {
      title: "Reporte de Usuarios",
      headers: ["Usuario", "Email", "Estado"],
      rows: users.map(u => [u.username, u.email, u.active ? "Activo" : "Inactivo"])
    };

    await generateReport(res, format, "Usuarios", excelConfig, pdfConfig);

  } catch (error) {
    res.status(500).json({ success: false, message: "Error al generar el reporte", error: error.message });
  }
};