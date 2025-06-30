import { api, request, getErrorMessage } from '@/request/base'

import type { BaseResponse } from '@/request/base'

/** 表列信息 */
export interface ColumnInfo {
  name: string
  type: string
  pk: number
  notnull: number
  dflt_value: string | null
  cid: number
}

/** 表信息 */
export interface TableInfo {
  name: string
  columns: ColumnInfo[]
}

/** 表数据响应 */
export interface SqliteTableData {
  records: any[]
  total: number
  page: number
  pageSize: number
}

/** SQL执行结果（非查询语句） */
export interface SqliteExecuteResult {
  changes: number
  lastID: number
}

/** 获取数据库表结构 */
export const getSqliteTables = async (dbPath: string): Promise<BaseResponse<TableInfo[]>> => {
  try {
    const result = await request.serverPost<TableInfo[], { dbPath: string }>(
      api.getSqliteTables,
      { dbPath }
    )

    return { success: true, data: result }
  } catch (error) {
    return { success: false, data: error, message: getErrorMessage(error) }
  }
}

/** 获取数据库表数据 */
export const getSqliteTableData = async (
  dbPath: string,
  tableName: string,
  page: number = 1,
  pageSize: number = 10,
  where: string = ''
): Promise<BaseResponse<SqliteTableData>> => {
  try {
    const result = await request.serverPost<SqliteTableData, {
      dbPath: string
      tableName: string
      page: number
      pageSize: number
      where: string
    }>(
      api.getSqliteTableData,
      { dbPath, tableName, page, pageSize, where }
    )

    return { success: true, data: result }
  } catch (error) {
    return { success: false, data: error, message: getErrorMessage(error) }
  }
}

/** 执行SQL语句 */
export const executeSqliteQuery = async (
  dbPath: string,
  sql: string
): Promise<BaseResponse<{ data: any[] | SqliteExecuteResult, isQuery: boolean }>> => {
  try {
    const result = await request.serverPost<{ data: any[] | SqliteExecuteResult, isQuery: boolean }, {
      dbPath: string
      sql: string
    }>(
      api.executeSqliteQuery,
      { dbPath, sql }
    )

    return { success: true, data: result }
  } catch (error) {
    return { success: false, data: error, message: getErrorMessage(error) }
  }
}
