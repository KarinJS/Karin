import './styles.css'
import React, { useState } from 'react'

/**
 * 简单的演示组件
 * 这个组件将被打包为插件并动态加载
 */
const DemoComponent: React.FC = () => {
  const [count, setCount] = useState(0)

  return (
    <div className='demo-container'>
      <div className='demo-header'>
        <svg
          className='demo-logo'
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          stroke='#3b82f6'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <path d='M12 2L2 7l10 5 10-5-10-5z' />
          <path d='M2 17l10 5 10-5' />
          <path d='M2 12l10 5 10-5' />
        </svg>
        <h2 className='demo-title'>Karin 插件演示</h2>
      </div>

      <p className='demo-description'>
        这是一个动态加载的插件组件，完全独立打包。
      </p>

      <div className='demo-counter'>
        <p>点击次数: <strong>{count}</strong></p>
        <button
          onClick={() => setCount(count + 1)}
          className='btn btn-primary'
        >
          增加
        </button>
        <button
          onClick={() => setCount(0)}
          className='btn btn-danger'
        >
          重置
        </button>
      </div>

      <div className='demo-footer'>
        插件版本: 1.0.0
      </div>
    </div>
  )
}

export default DemoComponent
