/**
 * @description 更新全部插件
 */
export async function up () {
  const { updateAllPkg, updateAllGitPlugin } = await import('@/utils/system/update')
  await updateAllPkg()
  await updateAllGitPlugin()
  process.exit(0)
}
