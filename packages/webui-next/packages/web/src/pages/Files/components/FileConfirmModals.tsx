import { Button, Modal } from '@heroui/react';

/**
 * 变更确认弹窗属性
 */
interface SaveDecisionModalProps {
  /** 是否打开 */
  isOpen: boolean;
  /** 保存中 */
  saving: boolean;
  /** 切换打开状态 */
  onOpenChange: (open: boolean) => void;
  /** 保存 */
  onSave: () => void;
  /** 不保存 */
  onDiscard: () => void;
}

/**
 * 删除确认弹窗属性
 */
interface DeleteConfirmModalProps {
  /** 是否打开 */
  isOpen: boolean;
  /** 删除中 */
  deleting: boolean;
  /** 切换打开状态 */
  onOpenChange: (open: boolean) => void;
  /** 确认删除 */
  onDelete: () => void;
}

/**
 * 保存决策弹窗
 * @param props 弹窗属性
 * @returns 弹窗节点
 */
export const SaveDecisionModal = (props: SaveDecisionModalProps) => {
  return (
    <Modal isOpen={props.isOpen} onOpenChange={props.onOpenChange}>
      <Modal.Backdrop variant="opaque">
        <Modal.Container size="lg">
          <Modal.Dialog className="sm:max-w-170">
            <Modal.Header>
              <Modal.Heading>检测到代码已修改</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <p className="text-base">你已经修改了文件内容，请选择接下来操作：</p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onPress={props.onSave} isDisabled={props.saving}>保存</Button>
              <Button variant="ghost" onPress={props.onDiscard}>不保存</Button>
              <Button variant="ghost" onPress={() => props.onOpenChange(false)}>取消</Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};

/**
 * 删除确认弹窗
 * @param props 弹窗属性
 * @returns 弹窗节点
 */
export const DeleteConfirmModal = (props: DeleteConfirmModalProps) => {
  return (
    <Modal isOpen={props.isOpen} onOpenChange={props.onOpenChange}>
      <Modal.Backdrop variant="opaque">
        <Modal.Container size="lg">
          <Modal.Dialog className="sm:max-w-170">
            <Modal.Header>
              <Modal.Heading>危险删除确认</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <p className="text-danger text-base">你确定要删除选中项吗？</p>
              <p className="text-default-500">当前接口为模拟删除，返回成功但不执行真实删除。</p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="ghost" onPress={() => props.onOpenChange(false)}>取消</Button>
              <Button className="bg-danger text-danger-foreground" variant="primary" onPress={props.onDelete} isDisabled={props.deleting}>
                {props.deleting ? '删除中...' : '确认删除'}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
};
