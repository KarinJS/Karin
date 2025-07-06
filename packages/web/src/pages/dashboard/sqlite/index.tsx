import { useState, useEffect } from 'react'
import { Button } from '@heroui/button'
import { Input } from '@heroui/input'
import { Pagination } from '@heroui/pagination'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from '@heroui/modal'
import { toast } from 'react-hot-toast'
import {
  getSqliteTables,
  getSqliteTableData,
  executeSqliteQuery,
  TableInfo,
  SqliteTableData,
} from '@/request/sqlite'

const SqliteManagerPage = () => {
  const [dbPath, setDbPath] = useState<string>('D:\\Github\\Karin-dev\\packages\\core\\@karinjs\\data\\db\\kv\\kv.db')
  const [tables, setTables] = useState<TableInfo[]>([])
  const [selectedTable, setSelectedTable] = useState<string>('')
  const [tableData, setTableData] = useState<SqliteTableData | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [searchValue, setSearchValue] = useState<string>('')
  const [sqlQuery, setSqlQuery] = useState<string>('')
  const [queryResult, setQueryResult] = useState<any[] | null>(null)

  // 编辑相关状态
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [editingRecord, setEditingRecord] = useState<any>(null)
  const [editedValues, setEditedValues] = useState<Record<string, any>>({})

  // 添加记录相关状态
  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure()
  const [newRecord, setNewRecord] = useState<Record<string, any>>({})

  // 加载表结构
  const loadTables = async () => {
    try {
      setLoading(true)
      const response = await getSqliteTables(dbPath)

      if (response.success) {
        setTables(response.data)
        if (response.data.length > 0 && !selectedTable) {
          // 自动选择第一个表
          setSelectedTable(response.data[0].name)
        }
      } else {
        toast.error('获取表结构失败: ' + response.message)
      }
    } catch (error: any) {
      toast.error('获取表结构失败: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // 加载表数据
  const loadTableData = async (tableName = selectedTable, page = currentPage, where = searchValue) => {
    try {
      if (!tableName) return

      setLoading(true)
      const response = await getSqliteTableData(dbPath, tableName, page, 10, where)

      if (response.success) {
        setTableData(response.data)
      } else {
        toast.error('获取表数据失败: ' + response.message)
      }
    } catch (error: any) {
      toast.error('获取表数据失败: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // 执行SQL语句
  const executeSql = async () => {
    try {
      if (!sqlQuery.trim()) return

      setLoading(true)
      const response = await executeSqliteQuery(dbPath, sqlQuery)

      if (response.success) {
        if (response.data.isQuery) {
          // 查询语句，显示结果
          setQueryResult(response.data.data as any[])
          toast.success('查询成功')
        } else {
          // 非查询语句，显示影响行数
          toast.success(`操作成功，影响了 ${(response.data.data as any).changes} 行`)
          // 刷新当前表数据
          loadTableData()
          setQueryResult(null)
        }
      } else {
        toast.error('执行失败: ' + response.message)
      }
    } catch (error: any) {
      toast.error('执行失败: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // 保存编辑后的记录
  const saveEditedRecord = async () => {
    try {
      if (!selectedTable || !editingRecord) return

      const currentTable = tables.find(t => t.name === selectedTable)
      if (!currentTable) return

      // 找出主键列
      const pkColumn = currentTable.columns.find(col => col.pk === 1)
      if (!pkColumn) {
        toast.error('该表没有主键，无法编辑记录')
        return
      }

      const pkValue = editingRecord[pkColumn.name]

      // 构建SET部分
      const setClause = Object.entries(editedValues)
        .map(([column, value]) => {
          if (value === null) return `${column} = NULL`
          return typeof value === 'string' ? `${column} = '${value}'` : `${column} = ${value}`
        })
        .join(', ')

      // 构建SQL更新语句
      const sql = `UPDATE ${selectedTable} SET ${setClause} WHERE ${pkColumn.name} = ${typeof pkValue === 'string' ? `'${pkValue}'` : pkValue}`

      // 执行更新操作
      setLoading(true)
      const response = await executeSqliteQuery(dbPath, sql)

      if (response.success) {
        toast.success(`记录更新成功，影响了 ${(response.data.data as any).changes} 行`)
        loadTableData() // 重新加载数据
        onClose()
      } else {
        toast.error('更新记录失败: ' + response.message)
      }
    } catch (error: any) {
      toast.error('更新记录失败: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // 添加新记录
  const addNewRecord = async () => {
    try {
      if (!selectedTable) return

      // 构建列和值
      const columns = Object.keys(newRecord).join(', ')
      const values = Object.values(newRecord).map(v =>
        v === null ? 'NULL' : (typeof v === 'string' ? `'${v}'` : v)
      ).join(', ')

      // 构建SQL插入语句
      const sql = `INSERT INTO ${selectedTable} (${columns}) VALUES (${values})`

      // 执行插入操作
      setLoading(true)
      const response = await executeSqliteQuery(dbPath, sql)

      if (response.success) {
        toast.success(`记录添加成功，ID: ${(response.data.data as any).lastID}`)
        loadTableData() // 重新加载数据
        onAddClose()
        setNewRecord({}) // 清空表单
      } else {
        toast.error('添加记录失败: ' + response.message)
      }
    } catch (error: any) {
      toast.error('添加记录失败: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // 删除记录
  const deleteRecord = async (record: any) => {
    try {
      if (!selectedTable) return

      const currentTable = tables.find(t => t.name === selectedTable)
      if (!currentTable) return

      // 找出主键列
      const pkColumn = currentTable.columns.find(col => col.pk === 1)
      if (!pkColumn) {
        toast.error('该表没有主键，无法删除记录')
        return
      }

      const pkValue = record[pkColumn.name]

      // 确认删除
      if (!window.confirm(`确定要删除该记录吗？主键 ${pkColumn.name} = ${pkValue}`)) {
        return
      }

      // 构建SQL删除语句
      const sql = `DELETE FROM ${selectedTable} WHERE ${pkColumn.name} = ${typeof pkValue === 'string' ? `'${pkValue}'` : pkValue}`

      // 执行删除操作
      setLoading(true)
      const response = await executeSqliteQuery(dbPath, sql)

      if (response.success) {
        toast.success(`记录删除成功，影响了 ${(response.data.data as any).changes} 行`)
        loadTableData() // 重新加载数据
      } else {
        toast.error('删除记录失败: ' + response.message)
      }
    } catch (error: any) {
      toast.error('删除记录失败: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // 初始化
  useEffect(() => {
    if (dbPath) {
      loadTables()
    }
  }, [dbPath])

  // 表切换时重新加载数据
  useEffect(() => {
    if (selectedTable) {
      setCurrentPage(1)
      setSearchValue('')
      loadTableData(selectedTable, 1, '')
    }
  }, [selectedTable])

  // 编辑记录
  const handleEdit = (record: any) => {
    setEditingRecord(record)
    // 初始化编辑值
    const initialValues: Record<string, any> = {}
    for (const key in record) {
      initialValues[key] = record[key]
    }
    setEditedValues(initialValues)
    onOpen()
  }

  // 准备添加记录
  const handleAdd = () => {
    const currentTable = tables.find(t => t.name === selectedTable)
    if (!currentTable) return

    // 初始化新记录对象
    const initialValues: Record<string, any> = {}
    currentTable.columns.forEach(column => {
      // 跳过自增主键
      if (column.pk === 1 && column.type.toLowerCase().includes('integer')) {
        return
      }
      initialValues[column.name] = null
    })

    setNewRecord(initialValues)
    onAddOpen()
  }

  // 渲染表格列
  const getColumns = () => {
    if (!tableData || !tableData.records.length) return []

    // 从记录中获取所有列
    const columns = Object.keys(tableData.records[0]).map(key => ({
      key,
      label: key,
    }))

    // 添加操作列
    columns.push({
      key: 'actions',
      label: '操作',
    })

    return columns
  }

  return (
    <div className='p-4 space-y-4'>
      <h1 className='text-2xl font-bold'>SQLite 数据库管理</h1>

      {/* 数据库路径输入 */}
      <div className='flex gap-2 items-center'>
        <Input
          label='数据库路径'
          value={dbPath}
          onChange={(e) => setDbPath(e.target.value)}
          className='flex-grow'
          placeholder='输入SQLite数据库路径'
        />
        <Button
          color='primary'
          onPress={loadTables}
          isLoading={loading}
        >
          连接
        </Button>
      </div>

      {tables.length > 0 && (
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
          {/* 左侧表列表 */}
          <div className='col-span-1 border rounded-md p-4'>
            <h2 className='text-lg font-semibold mb-2'>表列表</h2>
            <div className='space-y-2'>
              {tables.map((table) => (
                <div
                  key={table.name}
                  className={`p-2 rounded cursor-pointer ${selectedTable === table.name
                    ? 'bg-blue-100 dark:bg-blue-900'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  onClick={() => setSelectedTable(table.name)}
                >
                  {table.name}
                </div>
              ))}
            </div>
          </div>

          {/* 右侧数据显示和操作 */}
          <div className='col-span-1 md:col-span-3 border rounded-md p-4'>
            {selectedTable
              ? (
                <div className='space-y-4'>
                  <div className='flex justify-between items-center'>
                    <h2 className='text-lg font-semibold'>表: {selectedTable}</h2>
                    <Button color='primary' onPress={handleAdd}>添加记录</Button>
                  </div>

                  {/* 搜索栏 */}
                  <div className='flex gap-2'>
                    <Input
                      placeholder="输入搜索条件 (例如: name = 'test')"
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      className='flex-grow'
                    />
                    <Button onPress={() => loadTableData(selectedTable, 1, searchValue)}>搜索</Button>
                  </div>

                  {/* 表格数据 */}
                  {loading
                    ? (
                      <div className='flex justify-center p-10'>
                        <div className='animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent' />
                      </div>
                    )
                    : (
                      <>
                        {tableData && tableData.records.length > 0
                          ? (
                            <div>
                              <div className='overflow-x-auto'>
                                <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
                                  <thead className='bg-gray-50 dark:bg-gray-800'>
                                    <tr>
                                      {getColumns().map(column => (
                                        <th
                                          key={column.key}
                                          className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'
                                        >
                                          {column.label}
                                        </th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody className='bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800'>
                                    {tableData.records.map((record, index) => (
                                      <tr key={index} className='hover:bg-gray-50 dark:hover:bg-gray-800'>
                                        {Object.entries(record).map(([key, value]) => (
                                          <td key={key} className='px-6 py-4 whitespace-nowrap text-sm'>
                                            {value === null
                                              ? <span className='text-gray-500 italic'>NULL</span>
                                              : String(value)}
                                          </td>
                                        ))}
                                        <td className='px-6 py-4 whitespace-nowrap text-sm'>
                                          <div className='flex gap-2'>
                                            <Button size='sm' color='primary' onPress={() => handleEdit(record)}>编辑</Button>
                                            <Button size='sm' color='danger' onPress={() => deleteRecord(record)}>删除</Button>
                                          </div>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>

                              {/* 分页 */}
                              {tableData.total > 0 && (
                                <div className='mt-4 flex justify-center'>
                                  <Pagination
                                    total={Math.ceil(tableData.total / 10)}
                                    initialPage={currentPage}
                                    onChange={(page) => {
                                      setCurrentPage(page)
                                      loadTableData(selectedTable, page, searchValue)
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                          )
                          : (
                            <div className='text-center p-10 text-gray-500'>
                              没有数据
                            </div>
                          )}
                      </>
                    )}

                  {/* SQL查询编辑器 */}
                  <div className='mt-6'>
                    <h3 className='text-lg font-semibold mb-2'>SQL执行</h3>
                    <div className='flex flex-col gap-2'>
                      <textarea
                        placeholder='输入SQL语句'
                        value={sqlQuery}
                        onChange={(e) => setSqlQuery(e.target.value)}
                        className='w-full h-24 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-900'
                      />
                      <Button onPress={executeSql} isLoading={loading}>执行</Button>
                    </div>
                  </div>

                  {/* 查询结果 */}
                  {queryResult && queryResult.length > 0 && (
                    <div className='mt-4'>
                      <h3 className='text-lg font-semibold mb-2'>查询结果</h3>
                      <div className='overflow-x-auto'>
                        <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
                          <thead className='bg-gray-50 dark:bg-gray-800'>
                            <tr>
                              {Object.keys(queryResult[0]).map(key => (
                                <th
                                  key={key}
                                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider'
                                >
                                  {key}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className='bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800'>
                            {queryResult.map((record, index) => (
                              <tr key={index} className='hover:bg-gray-50 dark:hover:bg-gray-800'>
                                {Object.entries(record).map(([key, value]) => (
                                  <td key={key} className='px-6 py-4 whitespace-nowrap text-sm'>
                                    {value === null
                                      ? <span className='text-gray-500 italic'>NULL</span>
                                      : String(value)}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )
              : (
                <div className='text-center p-10 text-gray-500'>
                  请选择一个表
                </div>
              )}
          </div>
        </div>
      )}

      {/* 编辑记录模态框 */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>编辑记录</ModalHeader>
          <ModalBody>
            {editingRecord && (
              <div className='space-y-4'>
                {Object.keys(editingRecord).map(key => {
                  const currentTable = tables.find(t => t.name === selectedTable)
                  const column = currentTable?.columns.find(col => col.name === key)
                  const isPrimaryKey = column?.pk === 1

                  return (
                    <Input
                      key={key}
                      label={key + (isPrimaryKey ? ' (主键)' : '')}
                      value={editedValues[key] === null ? '' : editedValues[key]}
                      onChange={(e) => setEditedValues({ ...editedValues, [key]: e.target.value === '' ? null : e.target.value })}
                      disabled={isPrimaryKey} // 禁止编辑主键
                    />
                  )
                })}
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color='danger' variant='light' onPress={onClose}>取消</Button>
            <Button color='primary' onPress={saveEditedRecord} isLoading={loading}>保存</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* 添加记录模态框 */}
      <Modal isOpen={isAddOpen} onClose={onAddClose}>
        <ModalContent>
          <ModalHeader>添加记录</ModalHeader>
          <ModalBody>
            <div className='space-y-4'>
              {Object.keys(newRecord).map(key => (
                <Input
                  key={key}
                  label={key}
                  value={newRecord[key] === null ? '' : newRecord[key]}
                  onChange={(e) => setNewRecord({ ...newRecord, [key]: e.target.value === '' ? null : e.target.value })}
                />
              ))}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color='danger' variant='light' onPress={onAddClose}>取消</Button>
            <Button color='primary' onPress={addNewRecord} isLoading={loading}>添加</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}

export default SqliteManagerPage
