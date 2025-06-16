import { Card, CardBody } from '@heroui/card'
import { Skeleton } from '@heroui/skeleton'

/**
 * 加载状态组件
 */
const LoadingState = () => {
  return (
    <Card className='border border-default-200/50 dark:border-default-800/30' shadow='none'>
      <CardBody className='py-6 flex flex-col gap-6'>
        {[1, 2, 3].map((i) => (
          <div key={i} className='flex items-center gap-4'>
            <Skeleton className='w-12 h-12 rounded-full' />
            <div className='flex-1'>
              <Skeleton className='h-5 w-1/3 mb-2 rounded-full' />
              <Skeleton className='h-4 w-2/3 rounded-full' />
            </div>
          </div>
        ))}
      </CardBody>
    </Card>
  )
}

export default LoadingState
