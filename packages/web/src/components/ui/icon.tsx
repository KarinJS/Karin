type IconProps = {
  /** 图标名称 */
  name: string
  /** 图标大小 */
  size?: number
  /** 图标颜色 */
  color?: string
  /** 自定义类名 */
  className?: string
}

/** 图标组件 */
export const Icon: React.FC<IconProps> = ({ name, size = 24, color = 'currentColor', className = '' }) => {
  if (!name) return null

  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={{
        fontSize: `${size}px`,
        color,
        fontVariationSettings: '\'FILL\' 0, \'wght\' 400, \'GRAD\' 0, \'opsz\' 24',
      }}
    >
      {name}
    </span>
  )
}
