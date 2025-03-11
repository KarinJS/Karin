import clsx from 'clsx'
import { TbMessageCircle, TbMessageCircleFilled, TbUser, TbUserFilled } from 'react-icons/tb'
import { useMatch, useNavigate } from 'react-router-dom'
import { Image } from '@heroui/image'
import useSandbox from '@/hooks/sandbox/use_sandbox'

interface MenuItemProps {
  icon?: React.ReactNode
  activeIcon?: React.ReactNode
  className?: string
  isActive?: boolean
  href?: string
  onClick?: () => void
}

const MenuItem: React.FC<MenuItemProps> = props => {
  const { icon, activeIcon, className, isActive, onClick, href } = props
  const navigate = useNavigate()
  const match = useMatch(`${href}/*`)
  const active = href ? !!match : isActive

  return (
    <div
      className={clsx(
        'aspect-square rounded-lg flex items-center justify-center text-2xl !bg-opacity-50 relative transition-colors',
        active
          ? 'bg-zinc-300 dark:bg-zinc-700 !bg-opacity-100'
          : 'hover:bg-zinc-300 dark:hover:bg-zinc-700 dark:active:text-zinc-600 active:text-zinc-400',
        className,
      )}
      onClick={() => {
        if (href && !active) {
          navigate(href, {
            replace: true,
          })
        }
        if (onClick && !active) {
          onClick()
        }
      }}
    >
      <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'>{icon}</div>
      <div
        className={clsx(
          'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-500 transition-opacity',
          active ? 'clip-path-circle-active' : 'clip-path-circle',
        )}
      >
        {activeIcon}
      </div>
    </div>
  )
}
const SideBar = () => {
  const sandbox = useSandbox()
  const { ws } = sandbox
  const { botInfo } = ws
  return (
    <div className='select-none flex flex-col items-stretch px-2 flex-1'>
      <div className='aspect-square rounded-full my-4'>
        <Image src={botInfo.avatar} className='w-full h-full rounded-full' alt='avatar' />
      </div>
      <div className='flex flex-1 flex-col items-stretch gap-2 pb-3'>
        <MenuItem
          icon={<TbMessageCircle />}
          activeIcon={<TbMessageCircleFilled />}
          href='/sandbox/chat'
        />
        <MenuItem icon={<TbUser />} activeIcon={<TbUserFilled />} href='/sandbox/contact' />
        <div className='mt-auto' />
      </div>
    </div>
  )
}

export default SideBar
