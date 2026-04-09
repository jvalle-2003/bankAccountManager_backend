const sequelize = require("../config/db");
const { Sequelize } = require("sequelize");

// Importar los modelos ya definidos
const Bank = require("./bank.model");
const AccountType = require("./accountType.model");
const BankAccount = require("./bankAccount.model");

// ==========================================
// MODELOS DE PERMISOS Y USUARIOS (agregar)
// ==========================================
const User = require("./user.model");
const Role = require("./role.model");
const Permission = require("./permissions.model");
const RolePermission = require("./role_permissions.model");

// ==========================================
// DEFINICIÓN DE ASOCIACIONES (Relaciones)
// ==========================================

// Relaciones existentes de BankAccount
BankAccount.belongsTo(Bank, { foreignKey: "bank_id" });
Bank.hasMany(BankAccount, { foreignKey: "bank_id" });

BankAccount.belongsTo(AccountType, { foreignKey: "account_type_id" });
AccountType.hasMany(BankAccount, { foreignKey: "account_type_id" });

// ==========================================
// RELACIONES DE USUARIOS Y PERMISOS (agregar)
// ==========================================

// User - Role (muchos a uno)
User.belongsTo(Role, { foreignKey: "role_id", as: "role" });
Role.hasMany(User, { foreignKey: "role_id", as: "users" });

// Role - Permission (muchos a muchos)
Role.belongsToMany(Permission, {
    through: RolePermission,
    foreignKey: "role_id",
    otherKey: "permission_id",
    as: "permissions"
});

Permission.belongsToMany(Role, {
    through: RolePermission,
    foreignKey: "permission_id",
    otherKey: "role_id",
    as: "roles"
});

// ==========================================
// EXPORTAR MODELOS (agregar los nuevos)
// ==========================================
module.exports = {
    sequelize,
    Sequelize,
    Bank,
    AccountType,
    BankAccount,
    User,
    Role,
    Permission,
    RolePermission
};