const bcrypt = require('bcryptjs');
const { User, Role } = require('../models'); 

const createDefaultAdmin = async () => {
    try {
        // 1. Buscar o crear el rol "Administrador"
        // findOrCreate busca por el 'where', si no lo encuentra, lo crea usando los 'defaults'
        const [adminRole, roleCreated] = await Role.findOrCreate({
            where: { role_name: 'Administrador' },
            defaults: {
                description: 'Administrador total del sistema',
                active: true
            }
        });

        // 2. Buscar si el usuario 'admin' ya existe
        const adminFound = await User.findOne({ 
            where: { username: 'admin' } 
        });

        if (adminFound) {
            console.log(' El usuario administrador por defecto ya está configurado.');
            return;
        }

        // 3. Si no existe, encriptamos la contraseña 'admin'
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin', salt);

        // 4. Crear el usuario en la tabla Users
        // Usamos los nombres exactos de tus columnas según tu diagrama
        await User.create({
            first_name: 'Super',
            second_name: 'Root', 
            third_name: '', 
            first_surname: 'Administrador',
            second_surname: '',
            email: 'gesbanca@gmail.com',
            username: 'admin',
            password: hashedPassword,
            role_id: adminRole.role_id, 
            active: true
        });

        console.log(' Rol y Usuario administrador creados exitosamente.');

    } catch (error) {
        console.error(' Error al inicializar el administrador por defecto:', error);
    }
};

module.exports = {
    createDefaultAdmin
};