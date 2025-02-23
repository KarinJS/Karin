import { useParams } from 'react-router-dom'

export default function PluginConfigPage () {
  const { name } = useParams()

  return (
    <div className='flex items-center justify-center min-h-[200px]'>
      <div className='text-xl text-default-600'>
        插件名称：{name}
      </div>
    </div>
  )
}
