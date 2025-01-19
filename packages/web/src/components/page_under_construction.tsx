import { Image } from '@heroui/image'

export default function PageUnderConstruction() {
  return <div className="flex flex-col items-center justify-center h-full">
    <Image src="/web/karin.png" className="w-32" alt="logo" />
    <h1 className="text-4xl font-bold">页面建设中</h1>
    <p className="text-lg text-gray-500">敬请期待</p>
  </div>
}
