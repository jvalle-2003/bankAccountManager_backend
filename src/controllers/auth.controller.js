const User = require("../models/user.model");

/* =========================
   LOGIN
========================= */
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Buscar usuario por username
    const user = await User.findOne({ where: { username } });

    // Si no existe el usuario
    if (!user) {
      return res.status(401).json({ message: "Usuario o contraseña incorrectos" });
    }

    // Comparar contraseñas (texto plano por ahora)
    if (user.password !== password) {
      return res.status(401).json({ message: "Usuario o contraseña incorrectos" });
    }

    // Login exitoso - devolver datos del usuario (sin password)
    const userData = {
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      first_name: user.first_name,
      first_surname: user.first_surname,
      role_id: user.role_id
    };

    res.json({
      message: "Login exitoso",
      user: userData
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};