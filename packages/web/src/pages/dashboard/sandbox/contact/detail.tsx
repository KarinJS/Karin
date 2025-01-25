import { useNavigate, useParams } from 'react-router-dom'
import { FiEdit, FiEdit3, FiUsers } from 'react-icons/fi'
import { IoMale } from 'react-icons/io5'
// import Button from '@renderer/components/Button'
import { Button } from '@heroui/button'
import useMessages from '@/hooks/sandbox/message'
import { useEffect, useState } from 'react'
import { Image } from '@heroui/image'
import { request } from '@/lib/request'

document.addEventListener('dragover', e => {
  e.preventDefault()
  e.stopPropagation()
})
interface DetailItemProps {
  icon: React.ReactNode
  title: React.ReactNode
  content: React.ReactNode
}

const DetailItem: React.FC<DetailItemProps> = props => {
  const { icon, title, content } = props
  return (
    <div className="flex items-center gap-2 overflow-hidden">
      <div className="w-6 h-6 flex items-center justify-center flex-shrink-0 flex-grow-0 select-none pointer-events-none text-zinc-500 dark:text-zinc-300">
        {icon}
      </div>
      <div className="text-sm flex-shrink-0 flex-grow-0 select-none pointer-events-none">
        {title}
      </div>
      <div className="text-sm ml-auto truncate">{content}</div>
    </div>
  )
}

interface ItemWithDividerProps {
  children: React.ReactNode
  showDivider?: boolean
}

const ItemWithDivider: React.FC<ItemWithDividerProps> = props => {
  const { children, showDivider = true } = props
  return (
    <div className="flex text-xs gap-1 items-center mr-2">
      {children}
      {showDivider && <div className="ml-1 h-3 w-0.5 bg-zinc-100 dark:bg-zinc-800" />}
    </div>
  )
}

export interface Friend {
  userId: string
  nick: string
  avatar: string
}

export interface Group {
  groupId: string
  name: string
  avatar: string
}

const UserDetail: React.FC = () => {
  const id = useParams<{ id: string }>().id
  const navigate = useNavigate()
  const message = useMessages()
  const [friend, setFriend] = useState<Friend | null>(null)
  const [group, setGroup] = useState<Group | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const getContactInfo = async () => {
      if (!id) return

      try {
        setLoading(true)
        setError(null)

        // 先尝试获取群组信息
        const groupList = await request.serverPost<Group[], any>('/api/v1/sandbox/group/list', {})
        const currentGroup = groupList.find(g => g.groupId === id)

        if (currentGroup) {
          setGroup(currentGroup)
          return
        }

        // 如果不是群组，尝试获取好友信息
        const friendList = await request.serverPost<Friend[], any>('/api/v1/sandbox/friend/list', {})
        const currentFriend = friendList.find(f => f.userId === id)

        if (currentFriend) {
          setFriend(currentFriend)
        } else {
          setError('未找到联系人信息')
        }
      } catch (err) {
        console.error('获取联系人信息失败:', err)
        setError('网络错误，请稍后重试')
      } finally {
        setLoading(false)
      }
    }

    getContactInfo()
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-sm text-gray-500">加载中...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-sm text-red-500">{error}</div>
      </div>
    )
  }

  // 群组详情视图
  if (group) {
    return (
      <div className="mx-auto h-full relative px-3">
        <div className="w-full h-20 app-drag"></div>
        <div className="w-[500px] max-w-full mx-auto">
          <div className="flex items-center gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-800">
            <div className="w-24 aspect-square rounded-full overflow-hidden">
              <Image src={group.avatar} alt={group.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-xl font-semibold">{group.name}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">群号: {group.groupId}</div>
            </div>
          </div>
          <div className="py-3 flex flex-col gap-3">
            <DetailItem icon={<FiUsers />} title="群成员" content="查看全部群成员" />
            <DetailItem icon={<FiEdit3 />} title="群公告" content="暂无群公告" />
          </div>
          <div className="flex justify-center gap-2 mt-2">
            <Button size="md">分享</Button>
            <Button
              color="primary"
              size="md"
              onPress={() => {
                message.emptyIfNotExists(id!)
                navigate(`/sandbox/chat/${id}`)
              }}
            >
              发消息
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // 好友详情视图
  if (!friend) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-sm text-gray-500">未找到联系人信息</div>
      </div>
    )
  }

  return (
    <div className="mx-auto h-full relative px-3">
      <div className="w-full h-20 app-drag"></div>
      <div className="w-[500px] max-w-full mx-auto">
        <div className="flex items-center gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-800">
          <div className="w-24 aspect-square rounded-full overflow-hidden">
            <Image src={friend?.avatar} alt={friend?.nick} className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col gap-1">
            <div className="text-xl font-semibold">{friend?.nick}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">ID {id}</div>
            <div className="text-sm">【状态】</div>
          </div>
        </div>
        <div className="flex relative text-sm my-2">
          <ItemWithDivider>
            <IoMale className="text-blue-400" />
            <span>男</span>
          </ItemWithDivider>
          <ItemWithDivider>20岁</ItemWithDivider>
          <ItemWithDivider>9月17日 处女座</ItemWithDivider>
          <ItemWithDivider showDivider={false}>现居 中国</ItemWithDivider>
        </div>
        <div className="py-3 flex flex-col gap-3">
          <DetailItem icon={<FiEdit />} title="备注" content="没有备注" />
          <DetailItem icon={<FiUsers />} title="分组" content="没有分组" />
          <DetailItem icon={<FiEdit3 />} title="签名" content="没有签名" />
        </div>
        <div className="flex justify-center gap-2 mt-2">
          <Button size="md">分享</Button>
          <Button size="md">音视频通话</Button>
          <Button
            color="primary"
            size="md"
            onPress={() => {
              message.emptyIfNotExists(id!)
              navigate(`/sandbox/chat/${id}`)
            }}
          >
            发消息
          </Button>
        </div>
      </div>
    </div>
  )
}

export default UserDetail
