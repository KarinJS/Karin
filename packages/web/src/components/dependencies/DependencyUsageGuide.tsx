const DependencyUsageGuide = () => {
  return (
    <div className='bg-default-50 rounded-lg md:rounded-xl p-3 md:p-4 mt-3 md:mt-5 border border-default-200/50 text-xs md:text-sm text-default-600'>
      <div className='flex flex-col'>
        <div className='flex items-center gap-1.5 mb-1'>
          <div className='text-blue-500'>
            <svg width='16' height='16' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <path d='M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
              <path d='M12 16V12' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
              <path d='M12 8H12.01' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
            </svg>
          </div>
          <div className='font-medium'>依赖管理使用指南</div>
        </div>
        <ul className='ml-1.5 list-disc list-inside space-y-0.5'>
          <li>点击顶部卡片可快速筛选不同类型的依赖</li>
          <li>使用选择器可直接更改依赖版本</li>
          <li>绿色圆点表示 Karin 插件，灰色圆点表示普通 npm 包</li>
          <li>点击设置图标可查看更多版本选项和详细信息</li>
          <li>所有修改会先暂存，点击"保存更改"后才会真正应用</li>
        </ul>
      </div>
    </div>
  )
}

export default DependencyUsageGuide
