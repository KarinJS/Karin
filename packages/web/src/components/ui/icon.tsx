type IconProps = {
  /** 图标名称 */
  name: string
  /** 图标大小 */
  size?: number
  /** 图标颜色 */
  color?: string
}

/** 图标组件 */
export const Icon: React.FC<IconProps> = ({ name, size = 24, color = 'black' }) => {
  return <span className='material-icons' style={{ fontSize: size, color }}>{name}</span>
}
