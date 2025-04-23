/**
 * 隐藏小火箭
 */
export const hideRocket = () => {
  console.log('[小火箭] 隐藏')
  window.dispatchEvent(new CustomEvent('karin:modal-open', { detail: { name: 'DependencySettings' } }))
}

/**
 * 显示小火箭
 */
export const showRocket = () => {
  console.log('[小火箭] 显示')
  window.dispatchEvent(new CustomEvent('karin:modal-close', { detail: { name: 'DependencySettings' } }))
}
