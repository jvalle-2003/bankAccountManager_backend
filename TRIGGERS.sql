
DROP TRIGGER IF EXISTS TR_Users_Audit;

-- USUARIO AUDITORIA 
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