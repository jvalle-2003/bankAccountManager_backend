require('dotenv').config();
const nodemailer = require('nodemailer');

// Configuración para Gmail REAL
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,      // Tu correo desde el .env
        pass: process.env.GMAIL_APP_PASS    // Tu contraseña de aplicación
    }
});

// Función para enviar correos
exports.sendEmail = async (to, subject, html) => {
    try {
        const info = await transporter.sendMail({
            from: `"GESBANCA" <${process.env.GMAIL_USER}>`,
            to,
            subject,
            html
        });
        
        console.log('Correo enviado a:', to);
        return info;
        
    } catch (error) {
        console.error('Error enviando correo:', error);
        throw error;
    }
};