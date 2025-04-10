/**
 * 依赖管理使用指南组件
 * 显示依赖管理相关的使用说明和类型介绍
 */
const DependencyUsageGuide = () => {
  return (
    <div className='bg-default-50 rounded-lg md:rounded-xl p-3 md:p-4 mt-3 md:mt-5 border border-default-200/50 text-xs md:text-sm text-default-600'>
      <div className='flex flex-col'>
        <div className='flex items-center gap-1.5 mb-3'>
          <div className='text-blue-500'>
            <svg width='16' height='16' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <path d='M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
              <path d='M12 16V12' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
              <path d='M12 8H12.01' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
            </svg>
          </div>
          <div className='font-medium md:text-base'>依赖管理使用指南</div>
        </div>

        <div className='flex flex-col space-y-4 md:space-y-5'>
          {/* 基本操作部分 */}
          <div className='bg-white dark:bg-default-100/30 rounded-lg p-3 shadow-sm border border-default-200/30'>
            <div className='font-medium mb-2 text-blue-600 dark:text-blue-400 flex items-center gap-1.5'>
              <svg width='14' height='14' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path d='M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
              </svg>
              功能指南
            </div>
            <ul className='space-y-1.5 pl-2'>
              <li className='flex items-start gap-2'>
                <div className='rounded-full bg-blue-100 dark:bg-blue-900/30 w-4 h-4 mt-0.5 flex items-center justify-center flex-shrink-0'>
                  <span className='text-blue-600 dark:text-blue-400 text-[10px] font-bold'>1</span>
                </div>
                <div>通过顶部<span className='text-blue-600 dark:text-blue-400 font-medium'>统计卡片</span>快速筛选不同类别的依赖包</div>
              </li>
              <li className='flex items-start gap-2'>
                <div className='rounded-full bg-blue-100 dark:bg-blue-900/30 w-4 h-4 mt-0.5 flex items-center justify-center flex-shrink-0'>
                  <span className='text-blue-600 dark:text-blue-400 text-[10px] font-bold'>2</span>
                </div>
                <div>利用<span className='text-blue-600 dark:text-blue-400 font-medium'>版本选择器</span>直接切换依赖的版本号</div>
              </li>
              <li className='flex items-start gap-2'>
                <div className='rounded-full bg-blue-100 dark:bg-blue-900/30 w-4 h-4 mt-0.5 flex items-center justify-center flex-shrink-0'>
                  <span className='text-blue-600 dark:text-blue-400 text-[10px] font-bold'>3</span>
                </div>
                <div><span className='text-green-600 dark:text-green-400 font-medium'>绿色圆点</span>标识Karin插件，<span className='text-gray-600 dark:text-gray-400 font-medium'>灰色圆点</span>表示普通npm包</div>
              </li>
              <li className='flex items-start gap-2'>
                <div className='rounded-full bg-blue-100 dark:bg-blue-900/30 w-4 h-4 mt-0.5 flex items-center justify-center flex-shrink-0'>
                  <span className='text-blue-600 dark:text-blue-400 text-[10px] font-bold'>4</span>
                </div>
                <div>点击<span className='text-blue-600 dark:text-blue-400 font-medium'>设置图标</span>访问更多版本选项和包的详细信息</div>
              </li>
              <li className='flex items-start gap-2'>
                <div className='rounded-full bg-blue-100 dark:bg-blue-900/30 w-4 h-4 mt-0.5 flex items-center justify-center flex-shrink-0'>
                  <span className='text-blue-600 dark:text-blue-400 text-[10px] font-bold'>5</span>
                </div>
                <div>所有版本变更将先<span className='text-amber-600 dark:text-amber-400 font-medium'>暂存</span>，点击<span className='text-blue-600 dark:text-blue-400 font-medium'>保存更改</span>按钮后才会应用</div>
              </li>
            </ul>
          </div>

          {/* 依赖类型说明部分 */}
          <div className='bg-white dark:bg-default-100/30 rounded-lg p-3 shadow-sm border border-default-200/30'>
            <div className='font-medium mb-2 text-blue-600 dark:text-blue-400 flex items-center gap-1.5'>
              <svg width='14' height='14' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path d='M9 11L12 14L22 4M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
              </svg>
              依赖类型
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-2 gap-y-3'>
              <div className='flex items-center gap-2.5'>
                <div className='w-4 h-4 rounded-full bg-green-500 flex-shrink-0 shadow-sm shadow-green-200 dark:shadow-green-900/20' />
                <div>
                  <span className='font-medium text-green-600 dark:text-green-400'>生产依赖</span>
                  <div className='text-xs text-default-500'>项目运行时必需的依赖包</div>
                </div>
              </div>
              <div className='flex items-center gap-2.5'>
                <div className='w-4 h-4 rounded-full bg-purple-500 flex-shrink-0 shadow-sm shadow-purple-200 dark:shadow-purple-900/20' />
                <div>
                  <span className='font-medium text-purple-600 dark:text-purple-400'>开发依赖</span>
                  <div className='text-xs text-default-500'>仅在开发环境中使用的工具</div>
                </div>
              </div>
              <div className='flex items-center gap-2.5'>
                <div className='w-4 h-4 rounded-full bg-blue-500 flex-shrink-0 shadow-sm shadow-blue-200 dark:shadow-blue-900/20' />
                <div>
                  <span className='font-medium text-blue-600 dark:text-blue-400'>对等依赖</span>
                  <div className='text-xs text-default-500'>与宿主包配合使用的依赖</div>
                </div>
              </div>
              <div className='flex items-center gap-2.5'>
                <div className='w-4 h-4 rounded-full bg-red-500 flex-shrink-0 shadow-sm shadow-red-200 dark:shadow-red-900/20' />
                <div>
                  <span className='font-medium text-red-600 dark:text-red-400'>临时依赖</span>
                  <div className='text-xs text-default-500'>尚未保存到package.json的包</div>
                </div>
              </div>
              <div className='flex items-center gap-2.5'>
                <div className='w-4 h-4 rounded-full bg-amber-500 flex-shrink-0 shadow-sm shadow-amber-200 dark:shadow-amber-900/20' />
                <div>
                  <span className='font-medium text-amber-600 dark:text-amber-400'>可选依赖</span>
                  <div className='text-xs text-default-500'>安装失败也不影响主功能的包</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DependencyUsageGuide
