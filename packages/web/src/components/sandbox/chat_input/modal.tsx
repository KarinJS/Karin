import { Button } from '@nextui-org/button'
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure
} from '@nextui-org/modal'

import ChatInput from '.'

export default function ChatInputModal() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  return (
    <>
      <Button onPress={onOpen} color="danger" radius="full" variant="flat">
        构造聊天消息
      </Button>
      <Modal
        size="4xl"
        scrollBehavior="inside"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                构造消息
              </ModalHeader>
              <ModalBody className="overflow-y-auto">
                <div className="overflow-y-auto">
                  <ChatInput />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" onPress={onClose} variant="flat">
                  关闭
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
