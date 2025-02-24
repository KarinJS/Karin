import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@heroui/modal'
import { CheckboxGroup, Checkbox } from '@heroui/checkbox'
import { RadioGroup, Radio } from '@heroui/radio'
import { Tabs, Tab } from '@heroui/tabs'
import { Button } from '@heroui/button'
import { useCronState } from './hook'
import { NumberInput } from '@heroui/number-input'

export interface CronInputProps {
  value?: string
  onChange?: (value: string) => void
}

function getTypeName (type: string) {
  switch (type) {
    case 'second':
      return '秒'
    case 'minute':
      return '分钟'
    case 'hour':
      return '小时'
    case 'day':
      return '日'
    case 'month':
      return '月'
    case 'week':
      return '周'
    default:
      return ''
  }
}

export default function CronInput (props: CronInputProps) {
  const { value, onChange } = props
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const { state, setState, generateCron, validateTabState: hookValidateTabState } = useCronState(value)

  const handleConfirm = () => {
    const cronExpression = generateCron()
    onChange?.(cronExpression)
    onOpenChange()
  }

  const renderTabContent = (type: keyof typeof state) => {
    const tabState = state[type]
    const ranges = {
      second: { min: 0, max: 59 },
      minute: { min: 0, max: 59 },
      hour: { min: 0, max: 23 },
      day: { min: 1, max: 31 },
      month: { min: 1, max: 12 },
      week: { min: 0, max: 6 }
    }

    const isValid = hookValidateTabState(tabState)  // 移除了type参数

    return (
      <div className='space-y-4'>
        <RadioGroup
          value={tabState.type} onValueChange={value =>
            setState(prev => ({
              ...prev,
              [type]: { ...prev[type], type: value }
            }))}
        >
          <Radio value='every'>每{getTypeName(type)}</Radio>
          <Radio value='specific'>指定某{getTypeName(type)}或多个既定{getTypeName(type)}</Radio>
          <Radio value='range'>选择范围</Radio>
          <Radio value='cycle'>周期</Radio>
        </RadioGroup>

        {tabState.type === 'specific' && (
          <>
            <CheckboxGroup
              value={tabState.specific}
              onValueChange={values =>
                setState(prev => ({
                  ...prev,
                  [type]: { ...prev[type], specific: values }
                }))}
              classNames={{
                wrapper: 'flex flex-row gap-2 w-full',
                base: 'inline-flex items-center'
              }}
            >
              {Array.from({ length: ranges[type].max - ranges[type].min + 1 }, (_, i) => (
                <Checkbox
                  key={i}
                  value={String(i + ranges[type].min)}
                  className='shrink-0'
                >
                  {i + ranges[type].min}
                </Checkbox>
              ))}
            </CheckboxGroup>
            {!isValid && (
              <p className='text-danger text-sm'>请至少选择一个值，否则将默认为"每次执行"</p>
            )}
          </>
        )}

        {tabState.type === 'range' && (
          <>
            <div className='flex gap-2 items-center'>
              <span className='shrink-0'>从</span>
              <NumberInput
                aria-label='开始值'
                min={ranges[type].min}
                max={ranges[type].max}
                value={tabState.rangeStart}
                onValueChange={v =>
                  setState(prev => ({
                    ...prev,
                    [type]: { ...prev[type], rangeStart: v }
                  }))}
              />
              <span className='shrink-0'>到</span>
              <NumberInput
                aria-label='结束值'
                min={ranges[type].min}
                max={ranges[type].max}
                value={tabState.rangeEnd}
                onValueChange={v =>
                  setState(prev => ({
                    ...prev,
                    [type]: { ...prev[type], rangeEnd: v }
                  }))}
              />
              <span className='shrink-0'>秒</span>
            </div>
            {!isValid && (
              <p className='text-danger text-sm'>结束值必须大于等于开始值，否则将默认为"每次执行"</p>
            )}
          </>
        )}

        {tabState.type === 'cycle' && (
          <>
            <div className='flex gap-2 items-center'>
              <span className='shrink-0'>周期从</span>
              <NumberInput
                aria-label='开始值'
                min={ranges[type].min}
                max={ranges[type].max}
                value={tabState.cycleStart}
                onValueChange={v =>
                  setState(prev => ({
                    ...prev,
                    [type]: { ...prev[type], cycleStart: v }
                  }))}
              />
              <span className='shrink-0'>秒开始，每</span>
              <NumberInput
                aria-label='步长'
                min={1}
                max={ranges[type].max}
                value={tabState.cycleStep}
                onValueChange={v =>
                  setState(prev => ({
                    ...prev,
                    [type]: { ...prev[type], cycleStep: v }
                  }))}
              />
              <span className='shrink-0'>秒执行一次</span>
            </div>
            {!isValid && (
              <p className='text-danger text-sm'>步长必须大于0，否则将默认为"每次执行"</p>
            )}
          </>
        )}
      </div>
    )
  }

  return (
    <>
      <Button onPress={onOpen}>打开 Cron 编辑器</Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size='xl'>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>Cron 编辑器</ModalHeader>
              <ModalBody>
                <Tabs aria-label='Cron 表达式编辑选项'>
                  <Tab key='second' title='秒'>
                    {renderTabContent('second')}
                  </Tab>
                  <Tab key='minute' title='分'>
                    {renderTabContent('minute')}
                  </Tab>
                  <Tab key='hour' title='时'>
                    {renderTabContent('hour')}
                  </Tab>
                  <Tab key='day' title='日'>
                    {renderTabContent('day')}
                  </Tab>
                  <Tab key='month' title='月'>
                    {renderTabContent('month')}
                  </Tab>
                  <Tab key='week' title='周'>
                    {renderTabContent('week')}
                  </Tab>
                </Tabs>
                <div className='mt-4'>
                  <p>生成的Cron表达式：{generateCron()}</p>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color='danger' variant='light' onPress={onClose}>
                  取消
                </Button>
                <Button color='primary' onPress={handleConfirm}>
                  确定
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
