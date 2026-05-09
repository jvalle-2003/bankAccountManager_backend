const Audit = require("../models/audit.model");
const User = require("../models/user.model");

const { generateReport } = require("../utils/report.generator");

/* =========================
   OBTENER TODAS (Lectura)
========================= */
exports.findAll = async (req, res) => {
  try {
    const audits = await Audit.findAll({
      include: [{ 
        model: User, 
        attributes: ['user_id', 'username', 'email'] // Traemos datos del autor
      }],
      order: [['last_activity', 'DESC']] // Lo más reciente primero
    });
    res.json(audits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   OBTENER POR ID
========================= */
exports.findOne = async (req, res) => {
  try {
    const audit = await Audit.findByPk(req.params.id, {
      include: [{ model: User, attributes: ['username', 'email'] }]
    });

    if (!audit) return res.status(404).json({ message: "Registro no encontrado" });

    res.json(audit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Asegúrate de tener importados tus modelos al inicio de tu controlador:
// const Audit = require('../models/audit.model');
// const User = require('../models/user.model');

exports.exportReport = async (req, res) => {
  try {
    const format = req.query.format || "excel";
    
    // Obtenemos las auditorías e incluimos el modelo User para saber quién hizo la acción
    const audits = await Audit.findAll({
      include: [{
        model: User,
        attributes: ['username'] // Ajusta esto si en tu modelo User usas 'email' o 'name'
      }],
      order: [['last_activity', 'DESC']] // Ordenamos de más reciente a más antiguo
    });

    // 1. Configuramos cómo se verá en Excel
    const excelConfig = {
      columns: [
        { header: "ID", key: "audit_id", width: 10 },
        { header: "Usuario", key: "user", width: 20 },
        { header: "Descripción", key: "description", width: 40 },
        { header: "Tabla", key: "table_name", width: 20 },
        { header: "IP", key: "last_ip", width: 15 },
        { header: "Fecha de Actividad", key: "last_activity", width: 25 },
      ],
      data: audits.map(a => ({
        audit_id: a.audit_id,
        // Si el usuario existe mostramos el nombre, si no, el ID
        user: a.User ? a.User.username : `ID: ${a.user_id}`, 
        description: a.description,
        table_name: a.table_name || "N/A",
        last_ip: a.last_ip || "N/A",
        // Formateamos la fecha para que sea legible
        last_activity: a.last_activity ? new Date(a.last_activity).toLocaleString() : "N/A"
      }))
    };

    // 2. Configuramos cómo se verá en PDF
    const pdfConfig = {
      title: "Historial de Auditoría",
      headers: ["ID", "Usuario", "Descripción", "Tabla", "IP", "Fecha"],
      rows: audits.map(a => [
        a.audit_id,
        a.User ? a.User.username : `ID: ${a.user_id}`,
        a.description,
        a.table_name || "N/A",
        a.last_ip || "N/A",
        a.last_activity ? new Date(a.last_activity).toLocaleString() : "N/A"
      ])
    };

    // 3. Llamamos a la función genérica
    await generateReport(res, format, "Auditoria", excelConfig, pdfConfig);

  } catch (error) {
    console.error("Error al exportar auditoría:", error);
    res.status(500).json({ message: "Error al generar el reporte", error: error.message });
  }
};