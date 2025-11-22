/**
 * stdin控制器
 * @description 此函数适用于需要临时移除stdin监听器的场景，例如在某些交互过程中避免冲突。
 * @description 注意一定要在适当的时候调用`resume`方法恢复监听器，以确保程序的正常运行。
 * @returns stdin控制器
 * @example
 * ```typescript
 * const stdinController = createStdinController()
 *
 * // 移除所有stdin监听器
 * stdinController.remove()
 *
 * // 恢复所有stdin监听器
 * stdinController.resume()
 * ```
 */
export const createStdinController = () => {
  const listeners = process.stdin.listeners('data') as Array<(...args: any[]) => void>

  return {
    /** 移除 */
    remove: () => {
      listeners.forEach(l => process.stdin.removeListener('data', l))
    },
    /** 恢复 */
    resume: () => {
      listeners.forEach(l => process.stdin.on('data', l))
    },
  }
}
