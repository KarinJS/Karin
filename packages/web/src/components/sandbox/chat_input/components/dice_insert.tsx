import { Button } from '@heroui/button'
import { Tooltip } from '@heroui/tooltip'
import { BsDice3Fill } from 'react-icons/bs'

import useShowStructuredMessage from '@/hooks/sandbox/use_show_strcuted_message'

const DiceInsert = () => {
  const showStructuredMessage = useShowStructuredMessage()

  return (
    <Tooltip content="发送骰子">
      <Button
        size="sm"
        variant="light"
        isIconOnly
        radius="full"
        onPress={() => {
          showStructuredMessage([
            {
              type: 'dice',
            },
          ])
        }}
      >
        <BsDice3Fill className="text-lg" />
      </Button>
    </Tooltip>
  )
}

export default DiceInsert
