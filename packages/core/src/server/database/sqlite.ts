import { Request, Response } from 'express'
import sqlite3 from 'sqlite3'

/**
 * 获取SQLite数据库表结构
 * @param req 请求
 * @param res 响应
 */
export async function getSqliteTablesRouter (req: Request, res: Response) {
  try {
    const { dbPath } = req.body
    if (!dbPath) {
      return res.status(400).json({ code: 400, message: '数据库路径不能为空' })
    }

    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('连接数据库失败', err)
        return res.status(500).json({ code: 500, message: `连接数据库失败: ${err.message}` })
      }
    })

    // 使用Promise包装查询操作
    const getTables = (): Promise<any[]> => {
      return new Promise((resolve, reject) => {
        db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, rows) => {
          if (err) reject(err)
          else resolve(rows)
        })
      })
    }

    const getColumns = (tableName: string): Promise<any[]> => {
      return new Promise((resolve, reject) => {
        db.all(`PRAGMA table_info(${tableName})`, (err, rows) => {
          if (err) reject(err)
          else resolve(rows)
        })
      })
    }

    try {
      const tables = await getTables()

      const tablesWithColumns = await Promise.all(
        tables.map(async (table) => {
          const columns = await getColumns(table.name)
          return {
            name: table.name,
            columns,
          }
        })
      )

      db.close()

      res.json({
        code: 200,
        data: tablesWithColumns,
      })
    } catch (error: any) {
      db.close()
      console.error('获取SQLite表结构失败', error)
      res.status(500).json({ code: 500, message: `获取表结构失败: ${error.message}` })
    }
  } catch (error: any) {
    console.error('获取SQLite表结构失败', error)
    res.status(500).json({ code: 500, message: `获取表结构失败: ${error.message}` })
  }
}

/**
 * 获取SQLite数据库表数据
 * @param req 请求
 * @param res 响应
 */
export async function getSqliteTableDataRouter (req: Request, res: Response) {
  try {
    const { dbPath, tableName, page = 1, pageSize = 50, where = '' } = req.body

    if (!dbPath || !tableName) {
      return res.status(400).json({ code: 400, message: '数据库路径和表名不能为空' })
    }

    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('连接数据库失败', err)
        return res.status(500).json({ code: 500, message: `连接数据库失败: ${err.message}` })
      }
    })

    const getCount = (): Promise<number> => {
      return new Promise((resolve, reject) => {
        db.get(`SELECT COUNT(*) as count FROM ${tableName} ${where ? 'WHERE ' + where : ''}`, (err, row: { count: number }) => {
          if (err) reject(err)
          else resolve(row.count)
        })
      })
    }

    const getData = (offset: number): Promise<any[]> => {
      return new Promise((resolve, reject) => {
        db.all(
          `SELECT * FROM ${tableName} ${where ? 'WHERE ' + where : ''} LIMIT ${pageSize} OFFSET ${offset}`,
          (err, rows) => {
            if (err) reject(err)
            else resolve(rows)
          }
        )
      })
    }

    try {
      const total = await getCount()
      const offset = (page - 1) * pageSize
      const data = await getData(offset)

      db.close()

      res.json({
        code: 200,
        data: {
          records: data,
          total,
          page,
          pageSize,
        },
      })
    } catch (error: any) {
      db.close()
      console.error('获取SQLite表数据失败', error)
      res.status(500).json({ code: 500, message: `获取表数据失败: ${error.message}` })
    }
  } catch (error: any) {
    console.error('获取SQLite表数据失败', error)
    res.status(500).json({ code: 500, message: `获取表数据失败: ${error.message}` })
  }
}

/**
 * 执行SQL语句
 * @param req 请求
 * @param res 响应
 */
export async function executeSqliteQueryRouter (req: Request, res: Response) {
  try {
    const { dbPath, sql } = req.body

    if (!dbPath || !sql) {
      return res.status(400).json({ code: 400, message: '数据库路径和SQL语句不能为空' })
    }

    const db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('连接数据库失败', err)
        return res.status(500).json({ code: 500, message: `连接数据库失败: ${err.message}` })
      }
    })

    const statement = sql.trim().toLowerCase()

    // 判断是否为查询语句
    const isQuery = statement.startsWith('select')

    try {
      if (isQuery) {
        // 查询语句
        const executeQuery = (): Promise<any[]> => {
          return new Promise((resolve, reject) => {
            db.all(sql, (err, rows) => {
              if (err) reject(err)
              else resolve(rows)
            })
          })
        }

        const result = await executeQuery()
        db.close()

        res.json({
          code: 200,
          data: result,
          isQuery: true,
        })
      } else {
        // 非查询语句
        const executeUpdate = (): Promise<{ changes: number, lastID: number }> => {
          return new Promise((resolve, reject) => {
            db.run(sql, function (err) {
              if (err) reject(err)
              else resolve({ changes: this.changes, lastID: this.lastID })
            })
          })
        }

        const result = await executeUpdate()
        db.close()

        res.json({
          code: 200,
          data: {
            changes: result.changes,
            lastID: result.lastID,
          },
          isQuery: false,
        })
      }
    } catch (error: any) {
      db.close()
      console.error('执行SQL语句失败', error)
      res.status(500).json({ code: 500, message: `执行SQL语句失败: ${error.message}` })
    }
  } catch (error: any) {
    console.error('执行SQL语句失败', error)
    res.status(500).json({ code: 500, message: `执行SQL语句失败: ${error.message}` })
  }
}
