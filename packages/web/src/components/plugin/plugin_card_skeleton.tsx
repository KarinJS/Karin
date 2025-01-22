import { Card, CardBody } from '@heroui/card'
import { Skeleton } from '@heroui/skeleton'

export default function PluginCardSkeleton() {
  return (
    <Card className="w-[200px]" radius="sm" shadow="sm">
      <CardBody className="space-y-5">
        <Skeleton className="h-28 rounded-lg">
          <span className="rounded-lg bg-default-300" />
        </Skeleton>
        <div className="space-y-3">
          <Skeleton className="w-3/5 rounded-lg">
            <div className="h-3 w-3/5 rounded-lg bg-default-200" />
          </Skeleton>
          <Skeleton className="w-4/5 rounded-lg">
            <div className="h-3 w-4/5 rounded-lg bg-default-200" />
          </Skeleton>
          <Skeleton className="w-2/5 rounded-lg">
            <div className="h-3 w-2/5 rounded-lg bg-default-300" />
          </Skeleton>
        </div>
      </CardBody>
    </Card>
  )
}
