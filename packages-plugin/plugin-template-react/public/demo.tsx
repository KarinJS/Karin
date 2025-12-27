import React, { useState } from 'react'

interface CounterButtonProps {
  initialCount?: number
  label?: string
}

const CounterButton: React.FC<CounterButtonProps> = ({
  initialCount = 0,
  label = '点击次数',
}) => {
  const [count, setCount] = useState<number>(initialCount)

  const handleClick = () => {
    setCount(prev => prev + 1)
  }

  return (
    <div className='bg-white p-8 rounded-lg shadow-md'>
      <h2 className='text-2xl font-bold mb-4 text-gray-800'>{label}</h2>
      <p className='mb-4 text-gray-600'>
        当前计数: <strong className='text-3xl text-blue-600'>{count}</strong>
      </p>
      <button
        onClick={handleClick}
        className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors'
      >
        点击 +1
      </button>
      <button
        onClick={() => setCount(0)}
        className='ml-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors'
      >
        重置
      </button>
    </div>
  )
}

export default CounterButton
