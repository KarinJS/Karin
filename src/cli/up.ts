/**
 * @description 更新全部插件
 */
export async function up () {
  const { updateAllPkg } = await import('@/utils/system/update')
  await updateAllPkg()
}
