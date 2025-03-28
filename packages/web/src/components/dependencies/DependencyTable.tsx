import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@heroui/table'
import { Button } from '@heroui/button'
import { Chip } from '@heroui/chip'
import { Select, SelectItem } from '@heroui/select'
import { Link } from '@heroui/link'
import { Tooltip } from '@heroui/tooltip'
import { LuSettings, LuDownload } from 'react-icons/lu'
import { Dependency, getNpmLink, hasUpdate } from '../../pages/dashboard/dependencies.utils'

interface DependencyTableProps {
  dependencies: Dependency[]
  pendingChanges: Record<string, string>
  updateDependencyVersion: (name: string, version: string) => void
  openSettings: (dependency: Dependency) => void
}

const DependencyTable = ({ dependencies, pendingChanges, updateDependencyVersion, openSettings }: DependencyTableProps) => {
  return (
    <div className='rounded-xl md:rounded-2xl bg-white dark:bg-content1 shadow-sm border border-default-100 overflow-hidden'>
      <Table
        aria-label='依赖列表'
        removeWrapper
        classNames={{
          base: 'min-w-full',
          thead: 'bg-default-50/50',
          th: 'text-default-500 font-normal text-xs uppercase tracking-wider py-3 md:py-4 px-2 md:px-4',
          td: 'py-3 md:py-5 px-2 md:px-4 text-sm',
          tr: 'hover:bg-default-50/80 transition-colors',
        }}
      >
        <TableHeader>
          <TableColumn>包名称</TableColumn>
          <TableColumn>当前版本</TableColumn>
          <TableColumn className='hidden sm:table-cell'>package.json</TableColumn>
          <TableColumn width={180} className='hidden md:table-cell'>可用版本</TableColumn>
          <TableColumn width={64} className='text-center'>操作</TableColumn>
        </TableHeader>
        <TableBody emptyContent='没有找到依赖包'>
          {dependencies.map((dependency) => (
            <TableRow key={dependency.name}>
              <TableCell>
                <div className='flex items-center'>
                  <Tooltip content={dependency.isKarinPlugin ? 'Karin 插件' : 'npm 包'}>
                    <div
                      className='w-2 md:w-2.5 h-2 md:h-2.5 rounded-full mr-1.5 md:mr-2.5 flex-shrink-0'
                      style={{
                        backgroundColor: dependency.isKarinPlugin ? '#10b981' : '#9ca3af',
                        boxShadow: dependency.isKarinPlugin ? '0 0 6px rgba(16, 185, 129, 0.3)' : 'none',
                      }}
                    />
                  </Tooltip>
                  <Link
                    href={getNpmLink(dependency.name)}
                    isExternal
                    showAnchorIcon
                    className='font-medium text-blue-500 hover:text-blue-600 transition-colors text-xs md:text-sm'
                  >
                    {dependency.name}
                  </Link>

                  {hasUpdate(dependency) && (
                    <Tooltip content='有新版本可用'>
                      <div className='ml-1.5 md:ml-2 text-amber-500'>
                        <LuDownload size={12} className='md:hidden' />
                        <LuDownload size={14} className='hidden md:block' />
                      </div>
                    </Tooltip>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Chip
                  color={pendingChanges[dependency.name] ? 'warning' : 'primary'}
                  variant='flat'
                  size='sm'
                  className='font-mono bg-opacity-20 text-xs'
                  radius='sm'
                >
                  {pendingChanges[dependency.name] || dependency.currentVersion}
                </Chip>
              </TableCell>
              <TableCell className='hidden sm:table-cell'>
                <code className='text-xs text-default-500 bg-default-50 px-1.5 md:px-2 py-0.5 md:py-1 rounded'>
                  {dependency.packageJsonVersion}
                </code>
              </TableCell>
              <TableCell className='hidden md:table-cell'>
                <Select
                  selectedKeys={[pendingChanges[dependency.name] || dependency.currentVersion]}
                  onSelectionChange={(keys) => {
                    const selectedKey = keys as string
                    if (selectedKey) {
                      updateDependencyVersion(dependency.name, selectedKey)
                    }
                  }}
                  size='sm'
                  radius='full'
                  classNames={{
                    trigger: 'bg-default-50 border-none shadow-sm h-8 md:h-9 min-h-0',
                    value: 'font-mono text-xs md:text-sm',
                    listbox: 'text-xs',
                  }}
                >
                  {dependency.availableVersions.map((version: string) => (
                    <SelectItem key={version} textValue={version}>
                      <span className='font-mono text-xs md:text-sm'>{version}</span>
                    </SelectItem>
                  ))}
                </Select>
              </TableCell>
              <TableCell className='text-center'>
                <Button
                  isIconOnly
                  size='sm'
                  variant='light'
                  color='default'
                  onPress={() => openSettings(dependency)}
                  className='opacity-70 hover:opacity-100 transition-opacity w-8 h-8 min-w-0 p-0'
                >
                  <LuSettings size={14} className='md:hidden' />
                  <LuSettings size={16} className='hidden md:block' />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default DependencyTable
