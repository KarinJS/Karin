import { Button } from '@heroui/button'
interface FriendRequestItemProps {
  id: string
  time: number
  content: string
  receive: boolean
  accept: boolean
}

const FriendRequestItem: React.FC<FriendRequestItemProps> = props => {
  const { id, time, content, receive, accept } = props
  return (
    <div className="flex items-center gap-2 py-4 px-8 select-none bg-zinc-100 rounded-md dark:bg-zinc-700 dark:bg-opacity-50">
      <div className="w-12 h-12 rounded-full bg-black overflow-hidden pointer-events-none"></div>
      <div className="flex flex-col flex-1">
        <div className="flex items-center gap-2">
          <div className="text-sm font-bold">测试 {id}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(time).toLocaleString()}
          </div>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">{content}</div>
      </div>
      <div className="flex items-center justify-center gap-2">
        {accept ? (
          <div className="text-xs text-gray-500 dark:text-gray-400">已同意</div>
        ) : receive ? (
          <>
            <Button size="sm" color="primary">
              同意
            </Button>
            <Button size="sm" color="danger">
              拒绝
            </Button>
          </>
        ) : (
          <div className="text-xs text-gray-500 dark:text-gray-400">已发送申请</div>
        )}
      </div>
    </div>
  )
}

const FriendRequest: React.FC = () => {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-grow-0 flex-shrink-0 app-drag select-none px-4 py-5 flex">
        <div className="font-bold">好友通知</div>
        {/* <div className="ml-auto">1</div> */}
      </div>
      <div className="flex-1 overflow-y-auto w-[500px] max-w-full mx-auto flex flex-col gap-3">
        <FriendRequestItem
          id="1"
          time={Date.now()}
          content="请求添加你为好友"
          receive
          accept={false}
        />
        <FriendRequestItem id="1" time={Date.now()} content="请求添加你为好友" receive accept />
      </div>
    </div>
  )
}

export default FriendRequest
