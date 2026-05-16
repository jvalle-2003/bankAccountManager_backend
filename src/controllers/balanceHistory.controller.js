const sequelize = require("../config/db");
const BalanceHistory = require("../models/balance_history.model");
const { runWithAudit } = require("../utils/audit.helper");


exports.create = async (req, res) => {
  try {
    await runWithAudit(req, async (t) => {
      const record = await BalanceHistory.create(req.body, { transaction: t });
      res.status(201).json(record);
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   OBTENER TODOS
========================= */
exports.findAll = async (req, res) => {
  try {
    const records = await BalanceHistory.findAll();
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   OBTENER POR ID
========================= */
exports.findOne = async (req, res) => {
  try {
    const record = await BalanceHistory.findByPk(req.params.id);
    if (!record) return res.status(404).json({ message: "Record not found" });
    res.json(record);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   ACTUALIZAR
========================= */
exports.update = async (req, res) => {
  try {
    await runWithAudit(req, async (t) => {
      const record = await BalanceHistory.findByPk(req.params.id);
      
      if (!record) return res.status(404).json({ message: "Record not found" });
      
      // Pasamos la transacción para que el cambio quede registrado
      await record.update(req.body, { transaction: t });
      
      res.json(record);
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   ELIMINAR
========================= */
exports.delete = async (req, res) => {
  try {
    await runWithAudit(req, async (t) => {
      const record = await BalanceHistory.findByPk(req.params.id);
      
      if (!record) return res.status(404).json({ message: "Record not found" });
      
      // Pasamos la transacción a la destrucción del registro
      await record.destroy({ transaction: t });
      
      res.json({ message: "Record deleted successfully" });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Obtener estado de cuenta completo para un mes
 * GET /api/balance-history/statement/:account_id/:year/:month
 */
/// controllers/balanceHistory.controller.js

exports.getMonthlyStatement = async (req, res) => {
    try {
        const { account_id, year, month } = req.params;
        
        console.log('=== PARÁMETROS RECIBIDOS ===');
        console.log('account_id:', account_id);
        console.log('year:', year);
        console.log('month:', month);
        
        // ✅ 1. BUSCAR EL CIERRE DE MES EN Balance_History
        const closing = await BalanceHistory.findOne({
            where: {
                account_id: parseInt(account_id),
                year: parseInt(year),
                month: parseInt(month),
                is_monthly_closing: true
            }
        });
        
        if (!closing) {
            console.log('❌ No existe cierre para este período');
            return res.status(404).json({
                success: false,
                message: `No existe cierre para ${year}/${month} de la cuenta ${account_id}. Ejecute el cierre primero.`
            });
        }
        
        console.log('✅ Cierre encontrado:');
        console.log('   - previous_balance:', closing.previous_balance);
        console.log('   - closing_balance:', closing.closing_balance);
        console.log('   - monthly_credits:', closing.monthly_credits);
        console.log('   - monthly_debits:', closing.monthly_debits);
        console.log('   - transaction_count:', closing.transaction_count);
        
        // ✅ 2. Calcular fechas correctamente
        const startDate = `${year}-${String(month).padStart(2, '0')}-01 00:00:00`;
        
        // Último día del mes
        const lastDay = new Date(parseInt(year), parseInt(month), 0);
        const endDate = `${year}-${String(month).padStart(2, '0')}-${String(lastDay.getDate()).padStart(2, '0')} 23:59:59`;
        
        console.log('startDate:', startDate);
        console.log('endDate:', endDate);
        
        // ✅ 3. Obtener transacciones del mes (solo para el detalle)
        const transactions = await sequelize.query(
            `SELECT 
                t.transaction_id,
                t.transaction_date,
                t.reference_number,
                t.concept,
                t.amount,
                t.cancelled,
                t.account_id,
                c.movement_type,
                c.category_name
            FROM Transactions t
            LEFT JOIN Categories c ON t.category_id = c.category_id
            WHERE t.account_id = :account_id
                AND (t.cancelled = 0 OR t.cancelled IS NULL)
                AND t.transaction_date >= :startDate
                AND t.transaction_date <= :endDate
            ORDER BY t.transaction_date ASC`,
            {
                replacements: {
                    account_id: parseInt(account_id),
                    startDate: startDate,
                    endDate: endDate
                },
                type: sequelize.QueryTypes.SELECT
            }
        );
        
        console.log(`✅ Transacciones encontradas:`, transactions.length);
        
        // ✅ 4. USAR LOS VALORES DEL CIERRE, NO RECALCULAR
        const openingBalance = parseFloat(closing.previous_balance) || 0;
        const totalCredits = parseFloat(closing.monthly_credits) || 0;
        const totalDebits = parseFloat(closing.monthly_debits) || 0;
        const closingBalance = parseFloat(closing.closing_balance) || 0;
        const transactionCount = closing.transaction_count || transactions.length;
        
        console.log('=== VALORES DEL CIERRE ===');
        console.log('opening_balance (de Balance_History):', openingBalance);
        console.log('total_credits:', totalCredits);
        console.log('total_debits:', totalDebits);
        console.log('closing_balance:', closingBalance);
        console.log('transaction_count:', transactionCount);
        
        res.json({
            success: true,
            data: {
                account_id: parseInt(account_id),
                period: {
                    year: parseInt(year),
                    month: parseInt(month),
                    start_date: startDate.split(' ')[0],
                    end_date: endDate.split(' ')[0]
                },
                opening_balance: openingBalance,
                closing_balance: closingBalance,
                summary: {
                    total_credits: totalCredits,
                    total_debits: totalDebits,
                    transaction_count: transactionCount
                },
                transactions: transactions
            }
        });
        
    } catch (error) {
        console.error('Error en getMonthlyStatement:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ============================================
// Obtener saldo por fecha específica (ya lo tienes)
// ============================================
exports.getBalanceByDate = async (req, res) => {
  try {
    const { account_id, balance_date } = req.params;
    
    // Usando SQL Server (por el TOP 1 que usas)
    const [result] = await sequelize.query(
      `SELECT TOP 1 
        account_id, 
        balance_date, 
        closing_balance 
       FROM Balance_History 
       WHERE account_id = :account_id 
         AND balance_date <= :balance_date 
       ORDER BY balance_date DESC`,
      {
        replacements: { 
          account_id: account_id, 
          balance_date: balance_date 
        },
        type: sequelize.QueryTypes.SELECT
      }
    );
    
    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'No se encontró saldo para esa fecha'
      });
    }
    
    res.json({
      success: true,
      data: result
    });
    
  } catch (error) {
    console.error('Error en getBalanceByDate:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};


/**
 * Calcular y guardar cierre de mes para una cuenta específica
 * POST /api/balance-history/calculate-closing
 * Body: { account_id, year, month, closed_by (opcional) }
 */
exports.calculateMonthlyClosing = async (req, res) => {
    const t = await sequelize.transaction();
    
    try {
        const { account_id, year, month, closed_by = null } = req.body;
        
        console.log('═══════════════════════════════════════════════════════════');
        console.log('🚀 INICIANDO CIERRE DE MES');
        console.log('═══════════════════════════════════════════════════════════');
        console.log('📥 PARÁMETROS RECIBIDOS:');
        console.log('   - account_id:', account_id, '(tipo:', typeof account_id, ')');
        console.log('   - year:', year, '(tipo:', typeof year, ')');
        console.log('   - month:', month, '(tipo:', typeof month, ')');
        console.log('   - closed_by:', closed_by);
        
        // Validar parámetros
        if (!account_id || !year || !month) {
            console.log('❌ ERROR: Faltan parámetros obligatorios');
            await t.rollback();
            return res.status(400).json({
                success: false,
                message: 'Faltan parámetros: account_id, year, month'
            });
        }
        
        // ✅ 1. OBTENER DATOS DE LA CUENTA
        console.log('\n📌 PASO 1: Buscando cuenta en Bank_Accounts...');
        
        let accountData = null;
        
        // Intentar con nombre exacto "Bank_Accounts"
        try {
            const [result] = await sequelize.query(
                `SELECT account_id, initial_balance, current_balance 
                 FROM Bank_Accounts 
                 WHERE account_id = :account_id`,
                {
                    replacements: { account_id: parseInt(account_id) },
                    type: sequelize.QueryTypes.SELECT,
                    transaction: t
                }
            );
            accountData = result;
            console.log('   🔍 Buscando en "Bank_Accounts":', accountData ? 'ENCONTRADA' : 'NO ENCONTRADA');
        } catch (error) {
            console.log('   ⚠️ Error en Bank_Accounts:', error.message);
        }
        
        // Si no se encontró, intentar con minúsculas "bank_accounts"
        if (!accountData) {
            try {
                const [result] = await sequelize.query(
                    `SELECT account_id, initial_balance, current_balance 
                     FROM bank_accounts 
                     WHERE account_id = :account_id`,
                    {
                        replacements: { account_id: parseInt(account_id) },
                        type: sequelize.QueryTypes.SELECT,
                        transaction: t
                    }
                );
                accountData = result;
                console.log('   🔍 Buscando en "bank_accounts":', accountData ? 'ENCONTRADA' : 'NO ENCONTRADA');
            } catch (error) {
                console.log('   ⚠️ Error en bank_accounts:', error.message);
            }
        }
        
        if (!accountData) {
            console.log('❌ ERROR: Cuenta no encontrada en ninguna tabla');
            await t.rollback();
            return res.status(404).json({
                success: false,
                message: `Cuenta con ID ${account_id} no encontrada`
            });
        }
        
        console.log('   ✅ Cuenta encontrada:');
        console.log('      - account_id:', accountData.account_id);
        console.log('      - initial_balance:', accountData.initial_balance);
        console.log('      - current_balance:', accountData.current_balance);
        
        // ✅ 2. VERIFICAR SI YA EXISTE CIERRE
        console.log('\n📌 PASO 2: Verificando si ya existe cierre para este período...');
        
        const existingClosing = await BalanceHistory.findOne({
            where: {
                account_id: parseInt(account_id),
                year: parseInt(year),
                month: parseInt(month),
                is_monthly_closing: true
            },
            transaction: t
        });
        
        if (existingClosing) {
            console.log('   ⚠️ YA EXISTE un cierre para este período:');
            console.log('      - history_id:', existingClosing.history_id);
            console.log('      - closing_balance:', existingClosing.closing_balance);
            console.log('      - previous_balance:', existingClosing.previous_balance);
            
            await t.rollback();
            return res.status(409).json({
                success: false,
                message: `Ya existe un cierre para ${year}/${month} de la cuenta ${account_id}`
            });
        }
        
        console.log('   ✅ No existe cierre previo, continuando...');
        
        // ✅ 3. CALCULAR FECHAS DEL MES
        console.log('\n📌 PASO 3: Calculando fechas del mes...');
        
        const lastDay = new Date(parseInt(year), parseInt(month), 0);
        const balance_date = lastDay.toISOString().split('T')[0];
        const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
        
        console.log('   - Primer día del mes (startDate):', startDate);
        console.log('   - Último día del mes (endDate):', balance_date);
        console.log('   - Fecha cálculo:', new Date().toLocaleString());
        
        // ✅ 4. CALCULAR SALDO ANTERIOR (previous_balance)
        console.log('\n📌 PASO 4: Calculando saldo anterior...');
        
        let previousBalance = 0;
        let previousMonthBalance = null;
        
        let previousYear = parseInt(year);
        let previousMonth = parseInt(month) - 1;
        
        if (previousMonth === 0) {
            previousMonth = 12;
            previousYear = parseInt(year) - 1;
        }
        
        console.log('   - Buscando cierre de:', previousYear, '/', previousMonth);
        
        previousMonthBalance = await BalanceHistory.findOne({
            where: {
                account_id: parseInt(account_id),
                year: previousYear,
                month: previousMonth,
                is_monthly_closing: true
            },
            transaction: t
        });
        
        if (previousMonthBalance) {
            previousBalance = parseFloat(previousMonthBalance.closing_balance);
            console.log('   ✅ Cierre anterior ENCONTRADO:');
            console.log('      - closing_balance:', previousBalance);
            console.log('      - history_id:', previousMonthBalance.history_id);
        } else {
            // Si no hay cierre anterior, usar el initial_balance de la cuenta
            previousBalance = parseFloat(accountData.initial_balance) || 0;
            console.log('   ℹ️ No hay cierre anterior, usando INITIAL_BALANCE de la cuenta:');
            console.log('      - initial_balance:', accountData.initial_balance);
            console.log('      - previous_balance asignado:', previousBalance);
        }
        
        // ✅ 5. OBTENER TRANSACCIONES DEL MES
        console.log('\n📌 PASO 5: Obteniendo transacciones del período...');
        console.log('   - Filtro: account_id =', account_id);
        console.log('   - Filtro: cancelled = 0');
        console.log('   - Rango fechas:', startDate, 'a', balance_date);
        
        const transactions = await sequelize.query(
            `SELECT 
                t.amount,
                c.movement_type,
                t.transaction_date,
                t.concept
            FROM Transactions t
            LEFT JOIN Categories c ON t.category_id = c.category_id
            WHERE t.account_id = :account_id
                AND (t.cancelled = 0 OR t.cancelled IS NULL)
                AND t.transaction_date >= :startDate
                AND t.transaction_date <= :endDate
            ORDER BY t.transaction_date ASC`,
            {
                replacements: {
                    account_id: parseInt(account_id),
                    startDate: startDate,
                    endDate: balance_date
                },
                type: sequelize.QueryTypes.SELECT,
                transaction: t
            }
        );
        
        console.log('   ✅ Transacciones encontradas:', transactions.length);
        
        if (transactions.length > 0) {
            console.log('   📋 LISTADO DE TRANSACCIONES:');
            transactions.forEach((tx, index) => {
                console.log(`      ${index + 1}. Fecha: ${tx.transaction_date}, Concepto: ${tx.concept?.substring(0, 30)}, Monto: ${tx.amount}, Tipo: ${tx.movement_type}`);
            });
        } else {
            console.log('   ℹ️ No hay transacciones en este período');
        }
        
        // ✅ 6. CALCULAR TOTALES DEL MES
        console.log('\n📌 PASO 6: Calculando totales del mes...');
        
        let monthlyCredits = 0;
        let monthlyDebits = 0;
        
        for (const txn of transactions) {
            const isCredit = txn.movement_type?.toUpperCase() === 'INGRESO';
            const amount = parseFloat(txn.amount) || 0;
            
            if (isCredit) {
                monthlyCredits += amount;
                console.log(`   💚 CRÉDITO: +${amount} (Acumulado: ${monthlyCredits})`);
            } else {
                monthlyDebits += amount;
                console.log(`   ❤️ DÉBITO: -${amount} (Acumulado: ${monthlyDebits})`);
            }
        }
        
        console.log('   ✅ TOTALES DEL MES:');
        console.log('      - Total Créditos (INGRESOS):', monthlyCredits);
        console.log('      - Total Débitos (EGRESOS):', monthlyDebits);
        
        // ✅ 7. CALCULAR SALDO DE CIERRE
        console.log('\n📌 PASO 7: Calculando saldo de cierre...');
        console.log('   Fórmula: SaldoCierre = SaldoAnterior + Créditos - Débitos');
        console.log(`   - Saldo anterior: ${previousBalance}`);
        console.log(`   - + Créditos: ${monthlyCredits}`);
        console.log(`   - - Débitos: ${monthlyDebits}`);
        
        const closingBalance = previousBalance + monthlyCredits - monthlyDebits;
        
        console.log(`   ✅ RESULTADO: Saldo de cierre = ${closingBalance}`);
        
        // ✅ 8. GUARDAR EN BALANCE_HISTORY
        console.log('\n📌 PASO 8: Guardando en Balance_History...');
        
        const balanceRecord = await BalanceHistory.create({
            account_id: parseInt(account_id),
            balance_date: balance_date,
            closing_balance: closingBalance,
            year: parseInt(year),
            month: parseInt(month),
            is_monthly_closing: true,
            previous_balance: previousBalance,
            monthly_credits: monthlyCredits,
            monthly_debits: monthlyDebits,
            transaction_count: transactions.length,
            closed_by: closed_by ? parseInt(closed_by) : null,
            closed_at: new Date(),
            notes: `Cierre de mes ${month}/${year}`
        }, { transaction: t });
        
        console.log('   ✅ Registro guardado correctamente:');
        console.log('      - history_id:', balanceRecord.history_id);
        console.log('      - balance_date:', balanceRecord.balance_date);
        console.log('      - previous_balance:', balanceRecord.previous_balance);
        console.log('      - closing_balance:', balanceRecord.closing_balance);
        console.log('      - transaction_count:', balanceRecord.transaction_count);
        
        await t.commit();
        
        console.log('\n═══════════════════════════════════════════════════════════');
        console.log('🎉 CIERRE DE MES COMPLETADO CON ÉXITO');
        console.log('═══════════════════════════════════════════════════════════');
        console.log('📊 RESUMEN FINAL:');
        console.log('   - Cuenta:', account_id);
        console.log('   - Período:', `${month}/${year}`);
        console.log('   - Saldo anterior:', previousBalance);
        console.log('   - Ingresos del mes:', monthlyCredits);
        console.log('   - Egresos del mes:', monthlyDebits);
        console.log('   - Saldo de cierre:', closingBalance);
        console.log('   - Total transacciones:', transactions.length);
        console.log('═══════════════════════════════════════════════════════════\n');
        
        res.status(201).json({
            success: true,
            message: `Cierre de mes ${month}/${year} completado`,
            data: {
                history_id: balanceRecord.history_id,
                account_id: parseInt(account_id),
                balance_date: balance_date,
                closing_balance: closingBalance,
                previous_balance: previousBalance,
                monthly_credits: monthlyCredits,
                monthly_debits: monthlyDebits,
                transaction_count: transactions.length
            }
        });
        
    } catch (error) {
        await t.rollback();
        
        console.log('\n═══════════════════════════════════════════════════════════');
        console.log('❌ ERROR EN CIERRE DE MES');
        console.log('═══════════════════════════════════════════════════════════');
        console.log('Mensaje de error:', error.message);
        console.log('Stack trace:', error.stack);
        console.log('═══════════════════════════════════════════════════════════\n');
        
        res.status(500).json({
            success: false,
            message: error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

/**
 * Ejecutar cierre de mes para TODAS las cuentas
 * POST /api/balance-history/global-closing
 * Body: { year, month, closed_by (opcional) }
 */
exports.executeGlobalClosing = async (req, res) => {
  try {
    const { year, month, closed_by = null } = req.body;
    
    // Obtener todas las cuentas activas
    const [accounts] = await sequelize.query(
      `SELECT account_id FROM Bank_Accounts WHERE status = 'ACTIVE'`,
      { type: sequelize.QueryTypes.SELECT }
    );
    
    const results = [];
    const errors = [];
    
    for (const account of accounts) {
      try {
        // Crear un request simulado para reutilizar la función
        const mockReq = {
          body: {
            account_id: account.account_id,
            year: year,
            month: month,
            closed_by: closed_by
          }
        };
        
        const mockRes = {
          status: (code) => ({
            json: (data) => {
              if (data.success) {
                results.push(data.data);
              } else {
                errors.push({ account_id: account.account_id, error: data.message });
              }
            }
          })
        };
        
        await exports.calculateMonthlyClosing(mockReq, mockRes);
      } catch (error) {
        errors.push({
          account_id: account.account_id,
          error: error.message
        });
      }
    }
    
    res.json({
      success: errors.length === 0,
      total_accounts: accounts.length,
      successful: results.length,
      failed: errors.length,
      results: results,
      errors: errors
    });
    
  } catch (error) {
    console.error('Error en executeGlobalClosing:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Obtener historial de cierres de una cuenta
 * GET /api/balance-history/closing-history/:account_id?limit=12
 */
exports.getClosingHistory = async (req, res) => {
  try {
    const { account_id } = req.params;
    const { limit = 12 } = req.query;
    
    const history = await BalanceHistory.findAll({
      where: {
        account_id: account_id,
        is_monthly_closing: true
      },
      order: [['year', 'DESC'], ['month', 'DESC']],
      limit: parseInt(limit)
    });
    
    res.json({
      success: true,
      data: history
    });
    
  } catch (error) {
    console.error('Error en getClosingHistory:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Obtener saldo de cierre de un mes específico
 * GET /api/balance-history/monthly-closing/:account_id/:year/:month
 */
exports.getMonthlyClosing = async (req, res) => {
  try {
    const { account_id, year, month } = req.params;
    
    const closing = await BalanceHistory.findOne({
      where: {
        account_id: account_id,
        year: parseInt(year),
        month: parseInt(month),
        is_monthly_closing: true
      }
    });
    
    if (!closing) {
      return res.status(404).json({
        success: false,
        message: `No hay cierre para ${year}/${month}`
      });
    }
    
    res.json({
      success: true,
      data: closing
    });
    
  } catch (error) {
    console.error('Error en getMonthlyClosing:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Obtener saldo INICIAL de un mes (cierre del mes anterior)
 * GET /api/balance-history/opening-balance/:account_id/:year/:month
 */
exports.getOpeningBalance = async (req, res) => {
  try {
    let { account_id, year, month } = req.params;
    
    year = parseInt(year);
    month = parseInt(month);
    
    let prevYear = year;
    let prevMonth = month - 1;
    
    if (prevMonth === 0) {
      prevMonth = 12;
      prevYear = year - 1;
    }
    
    const closing = await BalanceHistory.findOne({
      where: {
        account_id: account_id,
        year: prevYear,
        month: prevMonth,
        is_monthly_closing: true
      }
    });
    
    const openingBalance = closing ? parseFloat(closing.closing_balance) : 0;
    
    res.json({
      success: true,
      data: {
        account_id: account_id,
        year: year,
        month: month,
        opening_balance: openingBalance,
        previous_closing: closing ? {
          year: prevYear,
          month: prevMonth,
          balance: openingBalance,
          date: closing.balance_date
        } : null
      }
    });
    
  } catch (error) {
    console.error('Error en getOpeningBalance:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};