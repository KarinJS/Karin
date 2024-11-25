import fs from 'fs'

/**
 * @description 获取package.json路径
 */
const getPkgPath = () => process.cwd() + '/package.json'

/**
 * @description 读取package.json
 */
const readPkg = () => JSON.parse(fs.readFileSync(getPkgPath(), 'utf-8'))

/**
 * @description 写入package.json
 * @param pkg package.json
 */
const writePkg = (pkg: any) => fs.writeFileSync(getPkgPath(), JSON.stringify(pkg, null, 2))

/**
 * @description 构建pr版本号
 * @param pkg package.json
 */
const updateVersion = (pkg: any) => {
  const list = pkg.version.split('.')
  list[2] = `${Number(list[2])}-dev`
  list.push(process.env.PR_NUMBER)
  list.push(Date.now().toString())

  pkg.version = list.join('.')
}

/**
 * @description 设置环境变量
 * @param pkg package.json
 */
const setEnvVariables = (pkg: any) => {
  fs.appendFileSync(process.env.GITHUB_ENV!, `PKG_NAME=${pkg.name}\nPKG_VERSION=${pkg.version}\n`)
}

/**
 * @description 更新版本号并设置环境变量
 */
const version = () => {
  const pkg = readPkg()
  updateVersion(pkg)
  writePkg(pkg)
  setEnvVariables(pkg)
}

/**
 * @description 删除devDependencies和peerDependencies
 */
const clean = () => {
  const pkg = readPkg()
  delete pkg.devDependencies
  delete pkg.peerDependencies
  writePkg(pkg)
}

/**
 * @description 执行所有操作
 */
const all = () => {
  const pkg = readPkg()
  updateVersion(pkg)
  delete pkg.devDependencies
  delete pkg.peerDependencies
  writePkg(pkg)
  setEnvVariables(pkg)
}

const cmd = process.argv[2]
if (cmd === 'version') {
  version()
} else if (cmd === 'clean') {
  clean()
} else if (cmd === 'all') {
  all()
}
