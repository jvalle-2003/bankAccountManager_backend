-- =====================================================
-- TRIGGERS CORREGIDOS - GESBANCA
-- FECHA: 09/05/2026
-- =====================================================

-- =====================================================
-- 1. ACCOUNT_TYPES AUDITORIA
-- =====================================================
DROP TRIGGER IF EXISTS TR_Account_Types_Audit;
GO

CREATE TRIGGER TR_Account_Types_Audit
ON Account_Types
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @usuario_responsable INT = CAST(SESSION_CONTEXT(N'user_id') AS INT);
    DECLARE @ip_responsable VARCHAR(45) = CAST(SESSION_CONTEXT(N'user_ip') AS VARCHAR(45));
    
    IF @usuario_responsable IS NULL OR NOT EXISTS (SELECT 1 FROM Users WHERE user_id = @usuario_responsable)
        SET @usuario_responsable = NULL;

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
        INSERT INTO Audits (description, previous_values, new_values, user_id, last_ip, table_name, record_id, last_activity)
        VALUES (@accion, @json_anterior, @json_nuevo, @usuario_responsable, @ip_responsable, 'Account_Types', @record_id, GETDATE());
    END
END;
GO

-- =====================================================
-- 2. BALANCE_HISTORY AUDITORIA
-- =====================================================
DROP TRIGGER IF EXISTS TR_Balance_History_Audit;
GO

CREATE TRIGGER TR_Balance_History_Audit
ON Balance_History
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @usuario_responsable INT = CAST(SESSION_CONTEXT(N'user_id') AS INT);
    DECLARE @ip_responsable VARCHAR(45) = CAST(SESSION_CONTEXT(N'user_ip') AS VARCHAR(45));
    
    IF @usuario_responsable IS NULL OR NOT EXISTS (SELECT 1 FROM Users WHERE user_id = @usuario_responsable)
        SET @usuario_responsable = NULL;

    DECLARE @accion VARCHAR(250);
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
        INSERT INTO Audits (description, previous_values, new_values, user_id, last_ip, table_name, record_id, last_activity)
        VALUES (@accion, @json_anterior, @json_nuevo, @usuario_responsable, @ip_responsable, 'Balance_History', @record_id, GETDATE());
    END
END;
GO

-- =====================================================
-- 3. BANK_ACCOUNTS AUDITORIA
-- =====================================================
DROP TRIGGER IF EXISTS TR_Bank_Accounts_Audit;
GO

CREATE TRIGGER TR_Bank_Accounts_Audit
ON Bank_Accounts
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @usuario_responsable INT = CAST(SESSION_CONTEXT(N'user_id') AS INT);
    DECLARE @ip_responsable VARCHAR(45) = CAST(SESSION_CONTEXT(N'user_ip') AS VARCHAR(45));
    
    IF @usuario_responsable IS NULL OR NOT EXISTS (SELECT 1 FROM Users WHERE user_id = @usuario_responsable)
        SET @usuario_responsable = NULL;

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
        INSERT INTO Audits (description, previous_values, new_values, user_id, last_ip, table_name, record_id, last_activity)
        VALUES (@accion, @json_anterior, @json_nuevo, @usuario_responsable, @ip_responsable, 'Bank_Accounts', @record_id, GETDATE());
    END
END;
GO

-- =====================================================
-- 4. BANKS AUDITORIA
-- =====================================================
DROP TRIGGER IF EXISTS TR_Banks_Audit;
GO

CREATE TRIGGER TR_Banks_Audit
ON Banks
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @usuario_responsable INT = CAST(SESSION_CONTEXT(N'user_id') AS INT);
    DECLARE @ip_responsable VARCHAR(45) = CAST(SESSION_CONTEXT(N'user_ip') AS VARCHAR(45));
    
    IF @usuario_responsable IS NULL OR NOT EXISTS (SELECT 1 FROM Users WHERE user_id = @usuario_responsable)
        SET @usuario_responsable = NULL;

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
        INSERT INTO Audits (description, previous_values, new_values, user_id, last_ip, table_name, record_id, last_activity)
        VALUES (@accion, @json_anterior, @json_nuevo, @usuario_responsable, @ip_responsable, 'Banks', @record_id, GETDATE());
    END
END;
GO

-- =====================================================
-- 5. CATEGORIES AUDITORIA
-- =====================================================
DROP TRIGGER IF EXISTS TR_Categories_Audit;
GO

CREATE TRIGGER TR_Categories_Audit
ON Categories
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @usuario_responsable INT = CAST(SESSION_CONTEXT(N'user_id') AS INT);
    DECLARE @ip_responsable VARCHAR(45) = CAST(SESSION_CONTEXT(N'user_ip') AS VARCHAR(45));
    
    IF @usuario_responsable IS NULL OR NOT EXISTS (SELECT 1 FROM Users WHERE user_id = @usuario_responsable)
        SET @usuario_responsable = NULL;

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
        INSERT INTO Audits (description, previous_values, new_values, user_id, last_ip, table_name, record_id, last_activity)
        VALUES (@accion, @json_anterior, @json_nuevo, @usuario_responsable, @ip_responsable, 'Categories', @record_id, GETDATE());
    END
END;
GO

-- =====================================================
-- 6. CURRENCIES AUDITORIA (CORREGIDO - nombre único)
-- =====================================================
DROP TRIGGER IF EXISTS TR_Currencies_Audit;
GO

CREATE TRIGGER TR_Currencies_Audit
ON Currencies
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @usuario_responsable INT = CAST(SESSION_CONTEXT(N'user_id') AS INT);
    DECLARE @ip_responsable VARCHAR(45) = CAST(SESSION_CONTEXT(N'user_ip') AS VARCHAR(45));
    
    IF @usuario_responsable IS NULL OR NOT EXISTS (SELECT 1 FROM Users WHERE user_id = @usuario_responsable)
        SET @usuario_responsable = NULL;

    DECLARE @accion VARCHAR(250);
    DECLARE @record_id VARCHAR(3);
    DECLARE @json_anterior NVARCHAR(MAX) = NULL;
    DECLARE @json_nuevo NVARCHAR(MAX) = NULL;

    IF EXISTS (SELECT * FROM inserted) AND EXISTS (SELECT * FROM deleted)
    BEGIN
        SET @accion = 'UPDATE en Currencies';
        SET @record_id = (SELECT TOP 1 id_currency FROM inserted); 
        SET @json_anterior = (SELECT * FROM deleted FOR JSON AUTO, WITHOUT_ARRAY_WRAPPER);
        SET @json_nuevo = (SELECT * FROM inserted FOR JSON AUTO, WITHOUT_ARRAY_WRAPPER);
    END
    ELSE IF EXISTS (SELECT * FROM inserted)
    BEGIN
        SET @accion = 'INSERT en Currencies';
        SET @record_id = (SELECT TOP 1 id_currency FROM inserted);
        SET @json_nuevo = (SELECT * FROM inserted FOR JSON AUTO, WITHOUT_ARRAY_WRAPPER);
    END
    ELSE IF EXISTS (SELECT * FROM deleted)
    BEGIN
        SET @accion = 'DELETE en Currencies';
        SET @record_id = (SELECT TOP 1 id_currency FROM deleted);
        SET @json_anterior = (SELECT * FROM deleted FOR JSON AUTO, WITHOUT_ARRAY_WRAPPER);
    END

    IF @accion IS NOT NULL
    BEGIN
        INSERT INTO Audits (description, previous_values, new_values, user_id, last_ip, table_name, record_id, last_activity)
        VALUES (@accion, @json_anterior, @json_nuevo, @usuario_responsable, @ip_responsable, 'Currencies', @record_id, GETDATE());
    END
END;
GO

-- =====================================================
-- 7. PERIODS AUDITORIA
-- =====================================================
DROP TRIGGER IF EXISTS TR_Periods_Audit;
GO

CREATE TRIGGER TR_Periods_Audit
ON Periods
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @usuario_responsable INT = CAST(SESSION_CONTEXT(N'user_id') AS INT);
    DECLARE @ip_responsable VARCHAR(45) = CAST(SESSION_CONTEXT(N'user_ip') AS VARCHAR(45));
    
    IF @usuario_responsable IS NULL OR NOT EXISTS (SELECT 1 FROM Users WHERE user_id = @usuario_responsable)
        SET @usuario_responsable = NULL;

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
        INSERT INTO Audits (description, previous_values, new_values, user_id, last_ip, table_name, record_id, last_activity)
        VALUES (@accion, @json_anterior, @json_nuevo, @usuario_responsable, @ip_responsable, 'Periods', @record_id, GETDATE());
    END
END;
GO

-- =====================================================
-- 8. PERMISSIONS AUDITORIA
-- =====================================================
DROP TRIGGER IF EXISTS TR_Permissions_Audit;
GO

CREATE TRIGGER TR_Permissions_Audit
ON Permissions
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @usuario_responsable INT = CAST(SESSION_CONTEXT(N'user_id') AS INT);
    DECLARE @ip_responsable VARCHAR(45) = CAST(SESSION_CONTEXT(N'user_ip') AS VARCHAR(45));
    
    IF @usuario_responsable IS NULL OR NOT EXISTS (SELECT 1 FROM Users WHERE user_id = @usuario_responsable)
        SET @usuario_responsable = NULL;

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
        INSERT INTO Audits (description, previous_values, new_values, user_id, last_ip, table_name, record_id, last_activity)
        VALUES (@accion, @json_anterior, @json_nuevo, @usuario_responsable, @ip_responsable, 'Permissions', @record_id, GETDATE());
    END
END;
GO

-- =====================================================
-- 9. RECONCILIATIONS AUDITORIA
-- =====================================================
DROP TRIGGER IF EXISTS TR_Reconciliations_Audit;
GO

CREATE TRIGGER TR_Reconciliations_Audit
ON Reconciliations
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @usuario_responsable INT = CAST(SESSION_CONTEXT(N'user_id') AS INT);
    DECLARE @ip_responsable VARCHAR(45) = CAST(SESSION_CONTEXT(N'user_ip') AS VARCHAR(45));
    
    IF @usuario_responsable IS NULL OR NOT EXISTS (SELECT 1 FROM Users WHERE user_id = @usuario_responsable)
        SET @usuario_responsable = NULL;

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
        INSERT INTO Audits (description, previous_values, new_values, user_id, last_ip, table_name, record_id, last_activity)
        VALUES (@accion, @json_anterior, @json_nuevo, @usuario_responsable, @ip_responsable, 'Reconciliations', @record_id, GETDATE());
    END
END;
GO

-- =====================================================
-- 10. ROLES AUDITORIA
-- =====================================================
DROP TRIGGER IF EXISTS TR_Roles_Audit;
GO

CREATE TRIGGER TR_Roles_Audit
ON Roles
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @usuario_responsable INT = CAST(SESSION_CONTEXT(N'user_id') AS INT);
    DECLARE @ip_responsable VARCHAR(45) = CAST(SESSION_CONTEXT(N'user_ip') AS VARCHAR(45));
    
    IF @usuario_responsable IS NULL OR NOT EXISTS (SELECT 1 FROM Users WHERE user_id = @usuario_responsable)
        SET @usuario_responsable = NULL;

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
        INSERT INTO Audits (description, previous_values, new_values, user_id, last_ip, table_name, record_id, last_activity)
        VALUES (@accion, @json_anterior, @json_nuevo, @usuario_responsable, @ip_responsable, 'Roles', @record_id, GETDATE());
    END
END;
GO

-- =====================================================
-- 11. TRANSACTIONS AUDITORIA
-- =====================================================
DROP TRIGGER IF EXISTS TR_Transactions_Audit;
GO

CREATE TRIGGER TR_Transactions_Audit
ON Transactions
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @usuario_responsable INT = CAST(SESSION_CONTEXT(N'user_id') AS INT);
    DECLARE @ip_responsable VARCHAR(45) = CAST(SESSION_CONTEXT(N'user_ip') AS VARCHAR(45));
    
    IF @usuario_responsable IS NULL OR NOT EXISTS (SELECT 1 FROM Users WHERE user_id = @usuario_responsable)
        SET @usuario_responsable = NULL;

    DECLARE @accion VARCHAR(250);
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
        INSERT INTO Audits (description, previous_values, new_values, user_id, last_ip, table_name, record_id, last_activity)
        VALUES (@accion, @json_anterior, @json_nuevo, @usuario_responsable, @ip_responsable, 'Transactions', @record_id, GETDATE());
    END
END;
GO

-- =====================================================
-- 12. USERS AUDITORIA
-- =====================================================
DROP TRIGGER IF EXISTS TR_Users_Audit;
GO

CREATE TRIGGER TR_Users_Audit
ON Users
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @usuario_responsable INT = CAST(SESSION_CONTEXT(N'user_id') AS INT);
    DECLARE @ip_responsable VARCHAR(45) = CAST(SESSION_CONTEXT(N'user_ip') AS VARCHAR(45));
    
    IF @usuario_responsable IS NULL OR NOT EXISTS (SELECT 1 FROM Users WHERE user_id = @usuario_responsable)
        SET @usuario_responsable = NULL;

    DECLARE @accion VARCHAR(250);
    DECLARE @record_id INT;
    DECLARE @json_anterior NVARCHAR(MAX) = NULL;
    DECLARE @json_nuevo NVARCHAR(MAX) = NULL;

    IF EXISTS (SELECT * FROM inserted) AND EXISTS (SELECT * FROM deleted)
    BEGIN
        SET @accion = 'UPDATE en Usuarios';
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

    IF @accion IS NOT NULL
    BEGIN
        INSERT INTO Audits (description, previous_values, new_values, user_id, last_ip, table_name, record_id, last_activity)
        VALUES (@accion, @json_anterior, @json_nuevo, @usuario_responsable, @ip_responsable, 'Users', @record_id, GETDATE());
    END
END;
GO

