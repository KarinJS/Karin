import { Image } from '@heroui/image'
import { Button } from '@heroui/button'

const GroupNotice: React.FC = () => {
  return (
    <div className="flex flex-col gap-4 items-center h-full select-none">
      <div className="w-full h-20 app-drag"></div>
      <div className="w-24 h-24 rounded-full overflow-hidden pointer-events-none">
        <Image alt="logo" className="w-full h-full object-cover block" src="/web/karin.png" />
      </div>
      <div className="text-2xl font-bold">群功能暂未实现</div>
      <div className="flex gap-2">
        <Button>取消</Button>
        <Button color="primary">确认</Button>
      </div>
    </div>
  )
}

export default GroupNotice
