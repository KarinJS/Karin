import clsx from 'clsx'
import { memo, useEffect, useState } from 'react'
import { IoClose, IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  startContent?: React.ReactNode
  endContent?: React.ReactNode
  classNames?: {
    container?: string
    input?: string
  }
  align?: 'left' | 'center' | 'right'
}
const PureInput = memo((props: InputProps) => {
  const {
    type,
    id,
    align = 'center',
    startContent,
    endContent,
    className,
    classNames,
    onChange,
    value: _value,
    ...rest
  } = props
  const [value, setValue] = useState<string | number | readonly string[] | undefined>('')
  const [_type, setType] = useState(type)
  useEffect(() => {
    setValue(_value ?? '')
  }, [_value])
  const onClear = () => {
    setValue('')
  }
  const onToggleType = () => {
    setType(_type => (_type === type ? 'text' : type))
  }
  return (
    <div
      className={clsx(
        classNames?.container,
        className,
        'group flex w-full text-zinc-950 bg-opacity-50 dark:bg-opacity-60 bg-zinc-300 rounded-md dark:bg-gray-800 dark:text-gray-300 focus-within:ring-blue-300 focus-within:ring-opacity-40 dark:focus-within:border-blue-300 focus-within:outline-none focus-within:ring hover:bg-opacity-80 focus-within:!bg-opacity-100 transition-colors duration-300 relative cursor-text',
      )}
    >
      <label htmlFor={id} className="flex items-center flex-grow-0 flex-shrink-0 pl-3 pr-2">
        {type === 'password' ? (
          <label htmlFor={id} className="cursor-auto" onClick={onToggleType}>
            {_type === 'password' ? (
              <IoEyeOutline className="text-gray-400 dark:text-gray-500" />
            ) : (
              <IoEyeOffOutline className="text-gray-400 dark:text-gray-500" />
            )}
          </label>
        ) : null}
        {startContent}
      </label>
      <input
        id={id}
        type={_type}
        value={value}
        className={clsx(
          classNames?.input,
          'block outline-none w-full py-3 bg-transparent placeholder:text-zinc-700 focus:placeholder:text-zinc-400 dark:placeholder-gray-500 dark:focus:placeholder-gray-700',
          align === 'left' && 'text-left',
          align === 'center' && 'text-center',
          align === 'right' && 'text-right',
        )}
        onChange={e => {
          setValue(e.target.value)
          if (onChange) {
            onChange(e)
          }
        }}
        {...rest}
      />
      <label
        htmlFor={id}
        className={clsx(
          'flex items-center flex-grow-0 flex-shrink-0 pr-3 pl-2 cursor-text',
          'opacity-0 group-focus-within:opacity-100 group-hover:opacity-100 active:opacity-100',
        )}
      >
        <label htmlFor={id} className="cursor-auto" onClick={onClear}>
          <IoClose className="text-gray-400 dark:text-gray-500" />
        </label>
        {endContent}
      </label>
    </div>
  )
})

export default PureInput
