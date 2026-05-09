
--ACCOUNT_TYPES AUDITORIA
DROP TRIGGER IF EXISTS TR_Account_Types_Audit;
GO

CREATE TRIGGER TR_Account_Types_Audit
ON Account_Types
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;

    -- Extraemos el usuario y la IP de la conexión temporal (inyectada por Node)
    DECLARE @usuario_responsable INT = CAST(SESSION_CONTEXT(N'user_id') AS INT);
    DECLARE @ip_responsable VARCHAR(45) = CAST(SESSION_CONTEXT(N'user_ip') AS VARCHAR(45));
    
    IF @usuario_responsable IS NULL SET @usuario_responsable = 1;

    DECLARE @accion VARCHAR(250);
    DECLARE @record_id INT;
    DECLARE @json_anterior NVARCHAR(MAX) = NULL;
    DECLARE @json_nuevo NVARCHAR(MAX) = NULL;

    IF EXISTS (SELECT * FROM inserted) AND EXISTS (SELECT * FROM deleted)
    BEGIN
        SET @accion = 'UPDATE en Account_Types';
        SET @record_id = (SELECT TOP 1 account_type_id FROM inserted); 
        SET @json_anterior = (SELECT * FROM deleted FOR JSON AUTO, WITHOUT_ARRAY_WRAPPER);
        SET @json_nuevo = (SELECT * FROM inserted FOR JSON AUTO, WITHOUT_ARRAY_WRAPPER);
    END
    ELSE IF EXISTS (SELECT * FROM inserted)
    BEGIN
        SET @accion = 'INSERT en Account_Types';
        SET @record_id = (SELECT TOP 1 account_type_id FROM inserted);
        SET @json_nuevo = (SELECT * FROM inserted FOR JSON AUTO, WITHOUT_ARRAY_WRAPPER);
    END
    ELSE IF EXISTS (SELECT * FROM deleted)
    BEGIN
        SET @accion = 'DELETE en Account_Types';
        SET @record_id = (SELECT TOP 1 account_type_id FROM deleted);
        SET @json_anterior = (SELECT * FROM deleted FOR JSON AUTO, WITHOUT_ARRAY_WRAPPER);
    END

    IF @accion IS NOT NULL
    BEGIN
        INSERT INTO Audits (
            description, previous_values, new_values, user_id, 
            last_ip, table_name, record_id, last_activity
        )
        VALUES (
            @accion, @json_anterior, @json_nuevo, @usuario_responsable, 
            @ip_responsable, 'Account_Types', @record_id, GETDATE()
        );
    END
END;
GO

--BALANCE_HISTORY AUDITORIA
DROP TRIGGER IF EXISTS TR_Balance_History_Audit;
GO

CREATE TRIGGER TR_Balance_History_Audit
ON Balance_History
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;

    -- Extraemos el usuario y la IP de la conexión temporal (inyectada por Node)
    DECLARE @usuario_responsable INT = CAST(SESSION_CONTEXT(N'user_id') AS INT);
    DECLARE @ip_responsable VARCHAR(45) = CAST(SESSION_CONTEXT(N'user_ip') AS VARCHAR(45));
    
    IF @usuario_responsable IS NULL SET @usuario_responsable = 1;

    DECLARE @accion VARCHAR(250);
    -- Se usa BIGINT porque tu llave primaria 'history_id' es DataTypes.BIGINT
    DECLARE @record_id BIGINT; 
    DECLARE @json_anterior NVARCHAR(MAX) = NULL;
    DECLARE @json_nuevo NVARCHAR(MAX) = NULL;

    IF EXISTS (SELECT * FROM inserted) AND EXISTS (SELECT * FROM deleted)
    BEGIN
        SET @accion = 'UPDATE en Balance_History';
        SET @record_id = (SELECT TOP 1 history_id FROM inserted); 
        SET @json_anterior = (SELECT * FROM deleted FOR JSON AUTO, WITHOUT_ARRAY_WRAPPER);
        SET @json_nuevo = (SELECT * FROM inserted FOR JSON AUTO, WITHOUT_ARRAY_WRAPPER);
    END
    ELSE IF EXISTS (SELECT * FROM inserted)
    BEGIN
        SET @accion = 'INSERT en Balance_History';
        SET @record_id = (SELECT TOP 1 history_id FROM inserted);
        SET @json_nuevo = (SELECT * FROM inserted FOR JSON AUTO, WITHOUT_ARRAY_WRAPPER);
    END
    ELSE IF EXISTS (SELECT * FROM deleted)
    BEGIN
        SET @accion = 'DELETE en Balance_History';
        SET @record_id = (SELECT TOP 1 history_id FROM deleted);
        SET @json_anterior = (SELECT * FROM deleted FOR JSON AUTO, WITHOUT_ARRAY_WRAPPER);
    END

    IF @accion IS NOT NULL
    BEGIN
        INSERT INTO Audits (
            description, previous_values, new_values, user_id, 
            last_ip, table_name, record_id, last_activity
        )
        VALUES (
            @accion, @json_anterior, @json_nuevo, @usuario_responsable, 
            @ip_responsable, 'Balance_History', @record_id, GETDATE()
        );
    END
END;
GO


--BANKS_ACCOUNTS AUDITORIA
DROP TRIGGER IF EXISTS TR_Bank_Accounts_Audit;
GO

CREATE TRIGGER TR_Bank_Accounts_Audit
ON Bank_Accounts
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;

    -- Extraemos el usuario y la IP de la conexión temporal (inyectada por Node)
    DECLARE @usuario_responsable INT = CAST(SESSION_CONTEXT(N'user_id') AS INT);
    DECLARE @ip_responsable VARCHAR(45) = CAST(SESSION_CONTEXT(N'user_ip') AS VARCHAR(45));
    
    IF @usuario_responsable IS NULL SET @usuario_responsable = 1;

    DECLARE @accion VARCHAR(250);
    DECLARE @record_id INT;
    DECLARE @json_anterior NVARCHAR(MAX) = NULL;
    DECLARE @json_nuevo NVARCHAR(MAX) = NULL;

    IF EXISTS (SELECT * FROM inserted) AND EXISTS (SELECT * FROM deleted)
    BEGIN
        SET @accion = 'UPDATE en Bank_Accounts';
        SET @record_id = (SELECT TOP 1 account_id FROM inserted); 
        SET @json_anterior = (SELECT * FROM deleted FOR JSON AUTO, WITHOUT_ARRAY_WRAPPER);
        SET @json_nuevo = (SELECT * FROM inserted FOR JSON AUTO, WITHOUT_ARRAY_WRAPPER);
    END
    ELSE IF EXISTS (SELECT * FROM inserted)
    BEGIN
        SET @accion = 'INSERT en Bank_Accounts';
        SET @record_id = (SELECT TOP 1 account_id FROM inserted);
        SET @json_nuevo = (SELECT * FROM inserted FOR JSON AUTO, WITHOUT_ARRAY_WRAPPER);
    END
    ELSE IF EXISTS (SELECT * FROM deleted)
    BEGIN
        SET @accion = 'DELETE en Bank_Accounts';
        SET @record_id = (SELECT TOP 1 account_id FROM deleted);
        SET @json_anterior = (SELECT * FROM deleted FOR JSON AUTO, WITHOUT_ARRAY_WRAPPER);
    END

    IF @accion IS NOT NULL
    BEGIN
        INSERT INTO Audits (
            description, previous_values, new_values, user_id, 
            last_ip, table_name, record_id, last_activity
        )
        VALUES (
            @accion, @json_anterior, @json_nuevo, @usuario_responsable, 
            @ip_responsable, 'Bank_Accounts', @record_id, GETDATE()
        );
    END
END;
GO

--BANKS AUDITORIA
DROP TRIGGER IF EXISTS TR_Banks_Audit;
GO

CREATE TRIGGER TR_Banks_Audit
ON Banks
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;

    -- Extraemos el usuario y la IP de la conexión temporal (inyectada por Node)
    DECLARE @usuario_responsable INT = CAST(SESSION_CONTEXT(N'user_id') AS INT);
    DECLARE @ip_responsable VARCHAR(45) = CAST(SESSION_CONTEXT(N'user_ip') AS VARCHAR(45));
    
    IF @usuario_responsable IS NULL SET @usuario_responsable = 1;

    DECLARE @accion VARCHAR(250);
    DECLARE @record_id INT;
    DECLARE @json_anterior NVARCHAR(MAX) = NULL;
    DECLARE @json_nuevo NVARCHAR(MAX) = NULL;

    IF EXISTS (SELECT * FROM inserted) AND EXISTS (SELECT * FROM deleted)
    BEGIN
        SET @accion = 'UPDATE en Banks';
        SET @record_id = (SELECT TOP 1 bank_id FROM inserted); 
        SET @json_anterior = (SELECT * FROM deleted FOR JSON AUTO, WITHOUT_ARRAY_WRAPPER);
        SET @json_nuevo = (SELECT * FROM inserted FOR JSON AUTO, WITHOUT_ARRAY_WRAPPER);
    END
    ELSE IF EXISTS (SELECT * FROM inserted)
    BEGIN
        SET @accion = 'INSERT en Banks';
        SET @record_id = (SELECT TOP 1 bank_id FROM inserted);
        SET @json_nuevo = (SELECT * FROM inserted FOR JSON AUTO, WITHOUT_ARRAY_WRAPPER);
    END
    ELSE IF EXISTS (SELECT * FROM deleted)
    BEGIN
        SET @accion = 'DELETE en Banks';
        SET @record_id = (SELECT TOP 1 bank_id FROM deleted);
        SET @json_anterior = (SELECT * FROM deleted FOR JSON AUTO, WITHOUT_ARRAY_WRAPPER);
    END

    IF @accion IS NOT NULL
    BEGIN
        INSERT INTO Audits (
            description, previous_values, new_values, user_id, 
            last_ip, table_name, record_id, last_activity
        )
        VALUES (
            @accion, @json_anterior, @json_nuevo, @usuario_responsable, 
            @ip_responsable, 'Banks', @record_id, GETDATE()
        );
    END
END;
GO

--CATEGORIES AUDITORIA
DROP TRIGGER IF EXISTS TR_Categories_Audit;
GO

CREATE TRIGGER TR_Categories_Audit
ON Categories
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;

    -- Extraemos el usuario y la IP de la conexión temporal (inyectada por Node)
    DECLARE @usuario_responsable INT = CAST(SESSION_CONTEXT(N'user_id') AS INT);
    DECLARE @ip_responsable VARCHAR(45) = CAST(SESSION_CONTEXT(N'user_ip') AS VARCHAR(45));
    
    IF @usuario_responsable IS NULL SET @usuario_responsable = 1;

    DECLARE @accion VARCHAR(250);
    DECLARE @record_id INT;
    DECLARE @json_anterior NVARCHAR(MAX) = NULL;
    DECLARE @json_nuevo NVARCHAR(MAX) = NULL;

    IF EXISTS (SELECT * FROM inserted) AND EXISTS (SELECT * FROM deleted)
    BEGIN
        SET @accion = 'UPDATE en Categories';
        SET @record_id = (SELECT TOP 1 category_id FROM inserted); 
        SET @json_anterior = (SELECT * FROM deleted FOR JSON AUTO, WITHOUT_ARRAY_WRAPPER);
        SET @json_nuevo = (SELECT * FROM inserted FOR JSON AUTO, WITHOUT_ARRAY_WRAPPER);
    END
    ELSE IF EXISTS (SELECT * FROM inserted)
    BEGIN
        SET @accion = 'INSERT en Categories';
        SET @record_id = (SELECT TOP 1 category_id FROM inserted);
        SET @json_nuevo = (SELECT * FROM inserted FOR JSON AUTO, WITHOUT_ARRAY_WRAPPER);
    END
    ELSE IF EXISTS (SELECT * FROM deleted)
    BEGIN
        SET @accion = 'DELETE en Categories';
        SET @record_id = (SELECT TOP 1 category_id FROM deleted);
        SET @json_anterior = (SELECT * FROM deleted FOR JSON AUTO, WITHOUT_ARRAY_WRAPPER);
    END

    IF @accion IS NOT NULL
    BEGIN
        INSERT INTO Audits (
            description, previous_values, new_values, user_id, 
            last_ip, table_name, record_id, last_activity
        )
        VALUES (
            @accion, @json_anterior, @json_nuevo, @usuario_responsable, 
            @ip_responsable, 'Categories', @record_id, GETDATE()
        );
    END
END;
GO


--CURRENCIES AUDITORIA
DROP TRIGGER IF EXISTS TR_Banks_Audit;
GO

CREATE TRIGGER TR_Banks_Audit
ON Banks
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;

    -- Extraemos el usuario y la IP de la conexión temporal (inyectada por Node)
    DECLARE @usuario_responsable INT = CAST(SESSION_CONTEXT(N'user_id') AS INT);
    DECLARE @ip_responsable VARCHAR(45) = CAST(SESSION_CONTEXT(N'user_ip') AS VARCHAR(45));
    
    IF @usuario_responsable IS NULL SET @usuario_responsable = 1;

    DECLARE @accion VARCHAR(250);
    DECLARE @record_id INT;
    DECLARE @json_anterior NVARCHAR(MAX) = NULL;
    DECLARE @json_nuevo NVARCHAR(MAX) = NULL;

    IF EXISTS (SELECT * FROM inserted) AND EXISTS (SELECT * FROM deleted)
    BEGIN
        SET @accion = 'UPDATE en Banks';
        SET @record_id = (SELECT TOP 1 bank_id FROM inserted); 
        SET @json_anterior = (SELECT * FROM deleted FOR JSON AUTO, WITHOUT_ARRAY_WRAPPER);
        SET @json_nuevo = (SELECT * FROM inserted FOR JSON AUTO, WITHOUT_ARRAY_WRAPPER);
    END
    ELSE IF EXISTS (SELECT * FROM inserted)
    BEGIN
        SET @accion = 'INSERT en Banks';
        SET @record_id = (SELECT TOP 1 bank_id FROM inserted);
        SET @json_nuevo = (SELECT * FROM inserted FOR JSON AUTO, WITHOUT_ARRAY_WRAPPER);
    END
    ELSE IF EXISTS (SELECT * FROM deleted)
    BEGIN
        SET @accion = 'DELETE en Banks';
        SET @record_id = (SELECT TOP 1 bank_id FROM deleted);
        SET @json_anterior = (SELECT * FROM deleted FOR JSON AUTO, WITHOUT_ARRAY_WRAPPER);
    END

    IF @accion IS NOT NULL
    BEGIN
        INSERT INTO Audits (
            description, previous_values, new_values, user_id, 
            last_ip, table_name, record_id, last_activity
        )
        VALUES (
            @accion, @json_anterior, @json_nuevo, @usuario_responsable, 
            @ip_responsable, 'Banks', @record_id, GETDATE()
        );
    END
END;
GO


--PERIODS AUDITORIA
DROP TRIGGER IF EXISTS TR_Periods_Audit;
GO

CREATE TRIGGER TR_Periods_Audit
ON Periods
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;

    -- Extraemos el usuario y la IP de la conexión temporal (inyectada por Node)
    DECLARE @usuario_responsable INT = CAST(SESSION_CONTEXT(N'user_id') AS INT);
    DECLARE @ip_responsable VARCHAR(45) = CAST(SESSION_CONTEXT(N'user_ip') AS VARCHAR(45));
    
    IF @usuario_responsable IS NULL SET @usuario_responsable = 1;

    DECLARE @accion VARCHAR(250);
    DECLARE @record_id INT;
    DECLARE @json_anterior NVARCHAR(MAX) = NULL;
    DECLARE @json_nuevo NVARCHAR(MAX) = NULL;

    IF EXISTS (SELECT * FROM inserted) AND EXISTS (SELECT * FROM deleted)
    BEGIN
        SET @accion = 'UPDATE en Periods';
        SET @record_id = (SELECT TOP 1 period_id FROM inserted); 
        SET @json_anterior = (SELECT * FROM deleted FOR JSON AUTO, WITHOUT_ARRAY_WRAPPER);
        SET @json_nuevo = (SELECT * FROM inserted FOR JSON AUTO, WITHOUT_ARRAY_WRAPPER);
    END
    ELSE IF EXISTS (SELECT * FROM inserted)
    BEGIN
        SET @accion = 'INSERT en Periods';
        SET @record_id = (SELECT TOP 1 period_id FROM inserted);
        SET @json_nuevo = (SELECT * FROM inserted FOR JSON AUTO, WITHOUT_ARRAY_WRAPPER);
    END
    ELSE IF EXISTS (SELECT * FROM deleted)
    BEGIN
        SET @accion = 'DELETE en Periods';
        SET @record_id = (SELECT TOP 1 period_id FROM deleted);
        SET @json_anterior = (SELECT * FROM deleted FOR JSON AUTO, WITHOUT_ARRAY_WRAPPER);
    END

    IF @accion IS NOT NULL
    BEGIN
        INSERT INTO Audits (
            description, previous_values, new_values, user_id, 
            last_ip, table_name, record_id, last_activity
        )
        VALUES (
            @accion, @json_anterior, @json_nuevo, @usuario_responsable, 
            @ip_responsable, 'Periods', @record_id, GETDATE()
        );
    END
END;
GO

--PERMISSION AUDITORIA
DROP TRIGGER IF EXISTS TR_Permissions_Audit;
GO

CREATE TRIGGER TR_Permissions_Audit
ON Permissions
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;

    -- Extraemos el usuario y la IP de la conexión temporal (inyectada por Node)
    DECLARE @usuario_responsable INT = CAST(SESSION_CONTEXT(N'user_id') AS INT);
    DECLARE @ip_responsable VARCHAR(45) = CAST(SESSION_CONTEXT(N'user_ip') AS VARCHAR(45));
    
    IF @usuario_responsable IS NULL SET @usuario_responsable = 1;

    DECLARE @accion VARCHAR(250);
    DECLARE @record_id INT;
    DECLARE @json_anterior NVARCHAR(MAX) = NULL;
    DECLARE @json_nuevo NVARCHAR(MAX) = NULL;

    IF EXISTS (SELECT * FROM inserted) AND EXISTS (SELECT * FROM deleted)
    BEGIN
        SET @accion = 'UPDATE en Permissions';
        SET @record_id = (SELECT TOP 1 id_permission FROM inserted); 
        SET @json_anterior = (SELECT * FROM deleted FOR JSON AUTO, WITHOUT_ARRAY_WRAPPER);
        SET @json_nuevo = (SELECT * FROM inserted FOR JSON AUTO, WITHOUT_ARRAY_WRAPPER);
    END
    ELSE IF EXISTS (SELECT * FROM inserted)
    BEGIN
        SET @accion = 'INSERT en Permissions';
        SET @record_id = (SELECT TOP 1 id_permission FROM inserted);
        SET @json_nuevo = (SELECT * FROM inserted FOR JSON AUTO, WITHOUT_ARRAY_WRAPPER);
    END
    ELSE IF EXISTS (SELECT * FROM deleted)
    BEGIN
        SET @accion = 'DELETE en Permissions';
        SET @record_id = (SELECT TOP 1 id_permission FROM deleted);
        SET @json_anterior = (SELECT * FROM deleted FOR JSON AUTO, WITHOUT_ARRAY_WRAPPER);
    END

    IF @accion IS NOT NULL
    BEGIN
        INSERT INTO Audits (
            description, previous_values, new_values, user_id, 
            last_ip, table_name, record_id, last_activity
        )
        VALUES (
            @accion, @json_anterior, @json_nuevo, @usuario_responsable, 
            @ip_responsable, 'Permissions', @record_id, GETDATE()
        );
    END
END;
GO

--RECONCILIATIONS AUDITORIA
DROP TRIGGER IF EXISTS TR_Reconciliations_Audit;
GO

CREATE TRIGGER TR_Reconciliations_Audit
ON Reconciliations
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;

    -- Extraemos el usuario y la IP de la conexión temporal (inyectada por Node)
    DECLARE @usuario_responsable INT = CAST(SESSION_CONTEXT(N'user_id') AS INT);
    DECLARE @ip_responsable VARCHAR(45) = CAST(SESSION_CONTEXT(N'user_ip') AS VARCHAR(45));
    
    IF @usuario_responsable IS NULL SET @usuario_responsable = 1;

    DECLARE @accion VARCHAR(250);
    DECLARE @record_id INT;
    DECLARE @json_anterior NVARCHAR(MAX) = NULL;
    DECLARE @json_nuevo NVARCHAR(MAX) = NULL;

    IF EXISTS (SELECT * FROM inserted) AND EXISTS (SELECT * FROM deleted)
    BEGIN
        SET @accion = 'UPDATE en Reconciliations';
        SET @record_id = (SELECT TOP 1 reconciliation_id FROM inserted); 
        SET @json_anterior = (SELECT * FROM deleted FOR JSON AUTO, WITHOUT_ARRAY_WRAPPER);
        SET @json_nuevo = (SELECT * FROM inserted FOR JSON AUTO, WITHOUT_ARRAY_WRAPPER);
    END
    ELSE IF EXISTS (SELECT * FROM inserted)
    BEGIN
        SET @accion = 'INSERT en Reconciliations';
        SET @record_id = (SELECT TOP 1 reconciliation_id FROM inserted);
        SET @json_nuevo = (SELECT * FROM inserted FOR JSON AUTO, WITHOUT_ARRAY_WRAPPER);
    END
    ELSE IF EXISTS (SELECT * FROM deleted)
    BEGIN
        SET @accion = 'DELETE en Reconciliations';
        SET @record_id = (SELECT TOP 1 reconciliation_id FROM deleted);
        SET @json_anterior = (SELECT * FROM deleted FOR JSON AUTO, WITHOUT_ARRAY_WRAPPER);
    END

    IF @accion IS NOT NULL
    BEGIN
        INSERT INTO Audits (
            description, previous_values, new_values, user_id, 
            last_ip, table_name, record_id, last_activity
        )
        VALUES (
            @accion, @json_anterior, @json_nuevo, @usuario_responsable, 
            @ip_responsable, 'Reconciliations', @record_id, GETDATE()
        );
    END
END;
GO

--ROLES AUDITORIA
DROP TRIGGER IF EXISTS TR_Roles_Audit;
GO

CREATE TRIGGER TR_Roles_Audit
ON Roles
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;

    -- Extraemos el usuario y la IP de la conexión temporal (inyectada por Node)
    DECLARE @usuario_responsable INT = CAST(SESSION_CONTEXT(N'user_id') AS INT);
    DECLARE @ip_responsable VARCHAR(45) = CAST(SESSION_CONTEXT(N'user_ip') AS VARCHAR(45));
    
    IF @usuario_responsable IS NULL SET @usuario_responsable = 1;

    DECLARE @accion VARCHAR(250);
    DECLARE @record_id INT;
    DECLARE @json_anterior NVARCHAR(MAX) = NULL;
    DECLARE @json_nuevo NVARCHAR(MAX) = NULL;

    IF EXISTS (SELECT * FROM inserted) AND EXISTS (SELECT * FROM deleted)
    BEGIN
        SET @accion = 'UPDATE en Roles';
        SET @record_id = (SELECT TOP 1 role_id FROM inserted); 
        SET @json_anterior = (SELECT * FROM deleted FOR JSON AUTO, WITHOUT_ARRAY_WRAPPER);
        SET @json_nuevo = (SELECT * FROM inserted FOR JSON AUTO, WITHOUT_ARRAY_WRAPPER);
    END
    ELSE IF EXISTS (SELECT * FROM inserted)
    BEGIN
        SET @accion = 'INSERT en Roles';
        SET @record_id = (SELECT TOP 1 role_id FROM inserted);
        SET @json_nuevo = (SELECT * FROM inserted FOR JSON AUTO, WITHOUT_ARRAY_WRAPPER);
    END
    ELSE IF EXISTS (SELECT * FROM deleted)
    BEGIN
        SET @accion = 'DELETE en Roles';
        SET @record_id = (SELECT TOP 1 role_id FROM deleted);
        SET @json_anterior = (SELECT * FROM deleted FOR JSON AUTO, WITHOUT_ARRAY_WRAPPER);
    END

    IF @accion IS NOT NULL
    BEGIN
        INSERT INTO Audits (
            description, previous_values, new_values, user_id, 
            last_ip, table_name, record_id, last_activity
        )
        VALUES (
            @accion, @json_anterior, @json_nuevo, @usuario_responsable, 
            @ip_responsable, 'Roles', @record_id, GETDATE()
        );
    END
END;
GO

--TRANSACTIONS AUDITORIA
DROP TRIGGER IF EXISTS TR_Transactions_Audit;
GO

CREATE TRIGGER TR_Transactions_Audit
ON Transactions
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;

    -- Extraemos el usuario y la IP de la conexión temporal (inyectada por Node)
    DECLARE @usuario_responsable INT = CAST(SESSION_CONTEXT(N'user_id') AS INT);
    DECLARE @ip_responsable VARCHAR(45) = CAST(SESSION_CONTEXT(N'user_ip') AS VARCHAR(45));
    
    IF @usuario_responsable IS NULL SET @usuario_responsable = 1;

    DECLARE @accion VARCHAR(250);
    -- Se usa BIGINT porque tu llave primaria 'transaction_id' es DataTypes.BIGINT
    DECLARE @record_id BIGINT; 
    DECLARE @json_anterior NVARCHAR(MAX) = NULL;
    DECLARE @json_nuevo NVARCHAR(MAX) = NULL;

    IF EXISTS (SELECT * FROM inserted) AND EXISTS (SELECT * FROM deleted)
    BEGIN
        SET @accion = 'UPDATE en Transactions';
        SET @record_id = (SELECT TOP 1 transaction_id FROM inserted); 
        SET @json_anterior = (SELECT * FROM deleted FOR JSON AUTO, WITHOUT_ARRAY_WRAPPER);
        SET @json_nuevo = (SELECT * FROM inserted FOR JSON AUTO, WITHOUT_ARRAY_WRAPPER);
    END
    ELSE IF EXISTS (SELECT * FROM inserted)
    BEGIN
        SET @accion = 'INSERT en Transactions';
        SET @record_id = (SELECT TOP 1 transaction_id FROM inserted);
        SET @json_nuevo = (SELECT * FROM inserted FOR JSON AUTO, WITHOUT_ARRAY_WRAPPER);
    END
    ELSE IF EXISTS (SELECT * FROM deleted)
    BEGIN
        SET @accion = 'DELETE en Transactions';
        SET @record_id = (SELECT TOP 1 transaction_id FROM deleted);
        SET @json_anterior = (SELECT * FROM deleted FOR JSON AUTO, WITHOUT_ARRAY_WRAPPER);
    END

    IF @accion IS NOT NULL
    BEGIN
        INSERT INTO Audits (
            description, previous_values, new_values, user_id, 
            last_ip, table_name, record_id, last_activity
        )
        VALUES (
            @accion, @json_anterior, @json_nuevo, @usuario_responsable, 
            @ip_responsable, 'Transactions', @record_id, GETDATE()
        );
    END
END;
GO

-- USERS AUDITORIA 
DROP TRIGGER 
IF EXISTS TR_Users_Audit;
GO

CREATE OR ALTER TRIGGER TR_Users_Audit
ON Users -- Reemplaza con el nombre real de tu tabla de usuarios si es diferente
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    -- Evita mensajes extra que puedan confundir a Node.js
    SET NOCOUNT ON;

    -- 1. Recuperamos quién hizo el cambio desde el Backend (tu helper)
    DECLARE @usuario_responsable INT = CAST(SESSION_CONTEXT(N'user_id') AS INT);
    DECLARE @ip_responsable VARCHAR(45) = CAST(SESSION_CONTEXT(N'user_ip') AS VARCHAR(45));
    
    -- Si por alguna razón no viene el ID (ej. registro público), usamos el ID 1 por defecto
    IF @usuario_responsable IS NULL SET @usuario_responsable = 1;

    -- Variables para guardar lo que pasó
    DECLARE @accion VARCHAR(250);
    DECLARE @record_id INT;
    DECLARE @json_anterior NVARCHAR(MAX) = NULL;
    DECLARE @json_nuevo NVARCHAR(MAX) = NULL;

    -- 2. Detectamos qué tipo de movimiento fue
    IF EXISTS (SELECT * FROM inserted) AND EXISTS (SELECT * FROM deleted)
    BEGIN
        SET @accion = 'UPDATE en Usuarios';
        -- Sacamos el ID del usuario modificado (Asumiendo que tu PK se llama user_id)
        SET @record_id = (SELECT TOP 1 user_id FROM inserted); 
        SET @json_anterior = (SELECT * FROM deleted FOR JSON AUTO, WITHOUT_ARRAY_WRAPPER);
        SET @json_nuevo = (SELECT * FROM inserted FOR JSON AUTO, WITHOUT_ARRAY_WRAPPER);
    END
    ELSE IF EXISTS (SELECT * FROM inserted)
    BEGIN
        SET @accion = 'INSERT en Usuarios';
        SET @record_id = (SELECT TOP 1 user_id FROM inserted);
        SET @json_nuevo = (SELECT * FROM inserted FOR JSON AUTO, WITHOUT_ARRAY_WRAPPER);
    END
    ELSE IF EXISTS (SELECT * FROM deleted)
    BEGIN
        SET @accion = 'DELETE en Usuarios';
        SET @record_id = (SELECT TOP 1 user_id FROM deleted);
        SET @json_anterior = (SELECT * FROM deleted FOR JSON AUTO, WITHOUT_ARRAY_WRAPPER);
    END

    -- 3. Finalmente, insertamos todo en tu tabla de Auditoría
    IF @accion IS NOT NULL
    BEGIN
        INSERT INTO Audits (
            description, 
            previous_values, 
            new_values, 
            user_id, 
            last_ip, 
            table_name, 
            record_id,
			last_activity
        )
        VALUES (
            @accion, 
            @json_anterior, 
            @json_nuevo, 
            @usuario_responsable, 
            @ip_responsable, 
            'Users',   -- Aquí mandamos 'Users' en duro porque este trigger es de la tabla Users
            @record_id, -- El ID exacto de la fila modificada
			GETDATE()
        );
    END
END;
GO -- Separar por bloques para ejecutar todos los triggers
