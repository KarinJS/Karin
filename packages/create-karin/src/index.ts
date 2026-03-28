#!/usr/bin/env node

import ora from 'ora'
import fs from 'node:fs'
import path from 'node:path'
import prompts from 'prompts'
import { getPm2Version } from './utils/pm2'
import { getStr, sleep } from './utils/tools'
import { getPnpmVersion } from './utils/pnpm'
import { green, red, yellow, blue, magenta } from 'kolorist'
import { getBestRegistry, getRegistry, getRegistryList, setRegistry, getCurrentRegistryName } from './utils/registry'
import { exec } from './utils/exec'
import { createPlugin, createProject } from './project'
import stripJsonComments from 'strip-json-comments'

// 解析命令行参数
const parseArgs = () => {
  const args = process.argv.slice(2)
  const flags = {
    yes: false, // 静默安装标志
    help: false, // 帮助信息标志
  }

  for (const arg of args) {
    if (arg === '-y' || arg === '--yes') {
      flags.yes = true
    } else if (arg === '-h' || arg === '--help') {
      flags.help = true
    }
  }

  return flags
}

// 获取命令行参数
const cliArgs = parseArgs()

/**
 * 显示帮助信息
 */
const showHelp = () => {
  console.log(`
${green('create-karin')} - Karin项目创建工具 ${blue(`v${process.env.npm_package_version || ''}`)}

${yellow('用法:')}
  ${green('pnpm create karin')} ${blue('[选项]')}

${yellow('选项:')}
  ${green('-y, --yes')}      静默安装，使用默认配置
  ${green('-h, --help')}     显示此帮助信息

${yellow('示例:')}
  ${green('pnpm create karin')}           交互式创建Karin项目
  ${green('pnpm create karin -y')}        使用默认配置静默创建Karin项目

${yellow('更多信息:')}
  ${blue('GitHub: https://github.com/KarinJS/Karin/tree/main/packages/create-karin')}
`)
}

/**
 * 验证项目名称
 */
const validateProjectName = (value: string) => {
  const dir = path.join(process.cwd(), value)
  /** 不允许中文 */
  if (/[\u4e00-\u9fa5]/.test(value)) {
    return '项目名称不允许包含中文'
  }
  if (fs.existsSync(dir)) {
    return `目录 ${value} 已存在，推荐使用 ${value}-${getStr(5)}`
  }
  return true
}

/**
 * 检查环境并初始化
 */
const checkEnvironment = async () => {
  const spinner = ora('正在检查环境...').start()
  sleep(200)

  spinner.color = 'yellow'
  spinner.text = '正在获取当前npm registry...'
  /** 当前registry */
  const registry = await getRegistry()
  spinner.succeed(`registry: ${green(registry)}`)

  spinner.start('正在获取当前npm registry...')
  /** 最佳registry */
  const bestRegistry = await getBestRegistry()
  spinner.succeed(`最佳registry: ${green(bestRegistry)}`)

  spinner.start('正在获取pnpm安装状态...')
  /** pnpm版本 */
  const pnpmVersion = await getPnpmVersion()
  pnpmVersion
    ? spinner.succeed(`pnpm: ${green(pnpmVersion)}`)
    : spinner.fail(`pnpm: ${red('未安装')}`)

  spinner.start('正在检查pm2安装状态...')
  /** pm2版本 */
  const pm2Version = await getPm2Version()
  pm2Version
    ? spinner.succeed(`pm2: ${green(pm2Version)}`)
    : spinner.fail(`pm2: ${red('未安装')}`)

  return {
    registry,
    bestRegistry,
    pnpmVersion,
    pm2Version,
  }
}

/**
 * 处理镜像源切换流程
 */
const handleRegistryChange = async () => {
  const spinner = ora('正在获取当前镜像源...').start()
  const currentRegistry = await getRegistry()
  const currentRegistryName = await getCurrentRegistryName()
  spinner.succeed(`当前镜像源: ${green(currentRegistryName)} (${currentRegistry})`)

  /** 获取可用的镜像源列表 */
  const registryList = getRegistryList()

  /** 提示用户选择镜像源 */
  const registryResponse = await prompts({
    type: 'select' as const,
    name: 'registry',
    message: '请选择要切换的镜像源:',
    initial: registryList.findIndex(item => currentRegistry.includes(item.url)),
    choices: registryList.map(item => ({
      title: `${item.name} ${currentRegistry.includes(item.url) ? blue('(当前)') : ''}`,
      value: item.url,
      description: item.url,
    })),
  }, {
    onCancel: () => {
      showGoodbye()
      process.exit(0)
    },
  })

  /** 用户取消选择处理 */
  if (!registryResponse.registry) {
    console.log(yellow('已取消镜像源切换'))
    showGoodbye()
    return
  }

  /** 切换镜像源 */
  const selectedRegistry = registryResponse.registry
  if (currentRegistry === selectedRegistry) {
    console.log(yellow('您选择的镜像源与当前使用的相同，无需切换'))
    return
  }

  const selectedRegistryInfo = registryList.find(item => item.url === selectedRegistry)
  const registryName = selectedRegistryInfo?.name || '选中的镜像源'

  spinner.start(`正在切换到 ${registryName} 镜像源...`)
  const success = await setRegistry(selectedRegistry)

  if (success) {
    spinner.succeed(`镜像源已成功切换到 ${green(registryName)} (${selectedRegistry})`)
  } else {
    spinner.fail(`镜像源切换失败！请检查您的网络连接或手动执行: ${yellow(`npm config set registry ${selectedRegistry}`)}`)
  }
}

/**
 * 根据模板类型获取默认项目名称
 */
const getDefaultProjectName = (template: string) => {
  if (!template || template === 'production') return 'karin-project'
  return template
}

/**
 * 显示再见信息
 */
const showGoodbye = () => {
  const goodbyeMessages = [
    '啊哦！你要走了吗？ Karin 会想你的！😭',
    '好的，下次再见！Karin 会在这里等你回来！👋',
    '操作取消了，但是我们的缘分还没有结束！期待再见！😄',
    '下次一定要完成我们的小项目哦！Karin 会思念你的！😊',
    '我会一直在这里，随时等你的命令！🚀',
    '下次一起搭建你的梦想项目吧！💻',
  ]

  const randomMessage = goodbyeMessages[Math.floor(Math.random() * goodbyeMessages.length)]
  const border = magenta('♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥♥')

  console.log(`
${border}
${randomMessage}

点个star吧：https://github.com/Karinjs/Karin
你的支持是我最大的动力，感谢你的使用，下次见！👋
${border}
`)
}

/**
 * 处理强制修复环境的功能
 */
const handleFixEnvironment = async () => {
  console.log(yellow('警告：强制修复将会尝试刷新当前目录的Karin环境，可能会覆盖已有的node-karin版本。'))

  /** 选择版本 */
  const versionResponse = await prompts({
    type: 'select',
    name: 'karinVersionType',
    message: '选择node-karin版本:',
    initial: 0,
    choices: [
      { title: '最新版本(latest)', value: 'latest' },
      { title: '自定义版本/URL', value: 'custom' },
    ],
  }, {
    onCancel: () => {
      showGoodbye()
      process.exit(0)
    },
  })

  let karinVersion = 'latest'
  if (versionResponse.karinVersionType === 'custom') {
    const customVersionResponse = await prompts({
      type: 'text',
      name: 'customKarinVersion',
      message: '请输入自定义版本号或URL:',
      initial: 'https://pkg.pr.new/node-karin@',
      validate: (value: string) => {
        if (!value) {
          return '版本号不能为空'
        }
        return true
      },
    }, {
      onCancel: () => {
        showGoodbye()
        process.exit(0)
      },
    })

    if (customVersionResponse.customKarinVersion) {
      karinVersion = customVersionResponse.customKarinVersion
    }
  }

  /** 再次确认 */
  const confirmResponse = await prompts({
    type: 'confirm' as const,
    name: 'confirm',
    message: `你确定要继续吗？这将更新当前环境的node-karin到${karinVersion}版本。`,
    initial: false,
  }, {
    onCancel: () => {
      showGoodbye()
      process.exit(0)
    },
  })

  if (!confirmResponse.confirm) {
    showGoodbye()
    return
  }

  const spinner = ora('正在检查当前环境...').start()
  const cwd = process.cwd()
  const packageJsonPath = path.join(cwd, 'package.json')
  let hasPackageJson = false
  let hasNodeKarin = false
  let packageJsonObj: any = null

  /** 检查是否存在package.json */
  if (fs.existsSync(packageJsonPath)) {
    hasPackageJson = true
    spinner.succeed('检测到package.json文件')
    spinner.start('正在检查node-karin依赖...')

    try {
      /** 尝试读取和修复package.json */
      const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf-8')

      try {
        /** 先直接尝试解析 */
        packageJsonObj = JSON.parse(packageJsonContent)
      } catch (parseError) {
        spinner.info('原始package.json解析失败，尝试修夌...')

        /** 使用strip-json-comments来修夌 */
        try {
          const strippedJson = stripJsonComments(packageJsonContent, {
            trailingCommas: true,
            whitespace: true,
          })
          packageJsonObj = JSON.parse(strippedJson)
          spinner.succeed('package.json修夌成功')

          /** 写回修复后的package.json */
          fs.writeFileSync(packageJsonPath, JSON.stringify(packageJsonObj, null, 2))
        } catch (stripError) {
          spinner.fail('package.json无法修夌，错误信息: ' + String(stripError))
          return
        }
      }

      /** 检查是否有node-karin依赖 */
      const hasNodeKarinDep = packageJsonObj?.dependencies && Object.keys(packageJsonObj.dependencies).some((dep: string) => /node-karin/.test(dep))
      const hasNodeKarinDevDep = packageJsonObj?.devDependencies && Object.keys(packageJsonObj.devDependencies).some((dep: string) => /node-karin/.test(dep))

      hasNodeKarin = hasNodeKarinDep || hasNodeKarinDevDep

      if (hasNodeKarin) {
        spinner.succeed('检测到node-karin依赖')
      } else {
        spinner.info('没有找到node-karin依赖')
      }
    } catch (error) {
      spinner.fail('读取package.json失败: ' + String(error))
      return
    }
  } else {
    spinner.info('当前目录没有package.json，将创建新的环境')
  }

  /** 如果没有package.json，创建新的 */
  if (!hasPackageJson) {
    spinner.start('正在初始化新的package.json...')
    try {
      await exec('pnpm init', { cwd })
      spinner.succeed('package.json创建成功')
    } catch (error) {
      spinner.fail('创建 package.json 失败: ' + String(error))
      return
    }
  }

  /** 安装最新版本的node-karin */
  spinner.start(`正在安装 node-karin@${karinVersion}...`)
  try {
    const { registry } = await checkEnvironment()
    const registrySuffix = registry ? ` --registry=${registry}` : ''
    await exec(`pnpm install node-karin@${karinVersion}${registrySuffix}`, { cwd })
    spinner.succeed(`node-karin@${karinVersion} 安装成功`)
  } catch (error) {
    spinner.fail('node-karin安装失败: ' + String(error))
    return
  }

  /** 执行karin初始化 */
  spinner.start('正在初始化Karin环境...')
  try {
    await exec('npx karin init', { cwd })
    spinner.succeed('Karin环境初始化完成')
  } catch (error) {
    spinner.fail('Karin初始化失败: ' + String(error))
    return
  }

  /** 获取并显示node-karin版本 */
  try {
    const { stdout: versionOutput } = await exec('npx karin -v', { cwd })
    const version = versionOutput.trim()
    console.log(green(`
修复成功！当前 node-karin 版本: ${yellow(version)}
`))
    console.log(blue('你可以使用 ') + yellow('pnpm app') + blue(' 来启动Karin机器人。'))
  } catch (error) {
    console.log(yellow('无法获取node-karin版本，但修复已完成。'))
  }
}

const selectProjectTemplate = async () => {
  const templateResponse = await prompts({
    type: 'select',
    name: 'template',
    message: '选择项目类型:',
    initial: 0,
    choices: [
      {
        title: `${yellow('Karin机器人')} ${green('(推荐)')}`,
        value: 'production',
        description: '创建完整的Karin机器人项目',
      },
      {
        title: 'TypeScript插件',
        value: 'karin-plugin-ts',
        description: '创建TypeScript插件项目',
      },
      {
        title: 'JavaScript插件',
        value: 'karin-plugin-js',
        description: '创建JavaScript插件项目',
      },
      {
        title: `${red('强制修复')}生产环境`,
        value: 'fix-env',
        description: '修复当前目录下的Karin环境（升级node-karin并重新初始化）',
      },
      {
        title: 'registry',
        value: 'registry',
        description: '切换镜像源',
      },
    ],
  }, {
    onCancel: () => {
      showGoodbye()
      process.exit(0)
    },
  })

  if (!templateResponse.template) {
    showGoodbye()
    process.exit(0)
  }

  return templateResponse.template as 'production' | 'karin-plugin-ts' | 'karin-plugin-js' | 'registry' | 'fix-env'
}

/**
 * 检查Node版本并给出警告
 */
const checkNodeVersion = () => {
  if (Number(process.version.split('.')[0]) < 18) {
    console.log(
      yellow(`Node.js版本(${process.version})较低，请升级到最新的LTS版本\n`) +
      'nodejs官网: https://nodejs.org/en/download\n' +
      'nodejs cn镜像: https://nodejs.cn/en/download\n' +
      '阿里云镜像站: https://registry.npmmirror.com/binary.html?path=node/latest'
    )
  }
}

/**
 * 安装pnpm依赖
 */
const installPnpmDependency = async (registrySuffix: string) => {
  const spinner = ora('正在安装pnpm...').start()
  const cmd = `npm install -g pnpm@^9${registrySuffix}`
  const { error, stderr } = await exec(cmd)
  if (error) throw error
  if (stderr) console.log(stderr)

  const { stdout: version } = await exec('pnpm -v')
  spinner.succeed(`pnpm v${version.trim()} 安装成功`)
}

/**
 * 安装pm2依赖
 */
const installPm2Dependency = async (registrySuffix: string) => {
  const spinner = ora('正在安装pm2...').start()
  const cmd = `npm install -g pm2${registrySuffix}`
  const { error, stderr } = await exec(cmd)
  if (error) throw error
  if (stderr) console.log(stderr)

  const { stdout: version } = await exec('pm2 -v')
  spinner.succeed(`pm2 v${version.trim()} 安装成功`)
}

/**
 * 构建项目配置选项
 */
const buildProjectConfigOptions = (
  templateChoice: string,
  registry: string,
  bestRegistry: string,
  pnpmVersion: string | null,
  pm2Version: string | null
) => {
  const options: prompts.PromptObject[] = [
    {
      type: 'text',
      name: 'projectName',
      message: '项目名称:',
      initial: getDefaultProjectName(templateChoice),
      validate: validateProjectName,
    },
  ]

  /** 处理pnpm安装选项 */
  if (pnpmVersion) {
    const majorVersion = Number(pnpmVersion.split('.')[0])
    if (majorVersion < 9) {
      options.push({
        type: 'confirm',
        name: 'upgradePnpm',
        message: `pnpm版本(${pnpmVersion})较低，推荐升级，是否升级?`,
        initial: true,
      })
    } else if (majorVersion > 9) {
      options.push({
        type: 'confirm',
        name: 'downgradePnpm',
        message: `使用pnpm ${pnpmVersion} 需要一定的专业性知识，是否降级到9.x?`,
        initial: true,
      })
    }
  }

  /** 处理pm2安装选项 */
  if (!pm2Version) {
    options.push({
      type: 'confirm',
      name: 'installPm2',
      message: '是否安装PM2用于项目后台运行?',
      initial: true,
    })
  }

  /** 处理镜像源设置选项 */
  if (registry !== bestRegistry) {
    options.push({
      type: 'select',
      name: 'changeRegistry',
      message: `是否切换到更快的镜像源 ${bestRegistry}?`,
      initial: 0,
      choices: [
        { title: '是', value: bestRegistry },
        { title: '否', value: registry },
      ],
    })
  }

  /** 添加node-karin版本选择选项 */
  options.push({
    type: 'select',
    name: 'karinVersionType',
    message: '选择node-karin版本:',
    initial: 0,
    choices: [
      { title: '最新版本(latest)', value: 'latest' },
      { title: '自定义版本/URL', value: 'custom' },
    ],
  })

  /** 基于选择添加自定义版本输入选项 */
  options.push({
    type: (prev, values) => {
      return values.karinVersionType === 'custom' ? 'text' : null
    },
    name: 'customKarinVersion',
    message: '请输入自定义版本号或URL:',
    initial: 'https://pkg.pr.new/node-karin@',
    validate: (value: string) => {
      if (!value) {
        return '版本号不能为空'
      }
      return true
    },
  })

  /** 添加鉴权选项 */
  options.push(
    {
      type: 'text',
      name: 'httpServerAuthKey',
      message: 'http_server鉴权秘钥:',
      initial: getStr(6),
      validate: (value: string) => {
        if (!value) {
          return '鉴权秘钥不能为空'
        }

        /** 不允许存在中文 */
        if (/^.*[\u4e00-\u9fa5].*$/i.test(value)) {
          return '鉴权秘钥不允许包含中文'
        }

        return true
      },
    },
    {
      type: 'text',
      name: 'wsServerAuthKey',
      message: 'ws_server鉴权秘钥(允许为空 按一下空格键):',
      initial: getStr(6),
    }
  )

  return options
}

/**
 * 处理项目创建流程
 */
const handleProjectCreation = async (
  templateChoice: 'production' | 'karin-plugin-ts' | 'karin-plugin-js',
  projectName: string,
  registrySuffix: string,
  httpAuthKey: string,
  wsAuthKey: string,
  karinVersion: string
) => {
  try {
    if (templateChoice === 'production') {
      return await createProject(projectName, registrySuffix, httpAuthKey, wsAuthKey, karinVersion)
    }

    if (templateChoice === 'karin-plugin-ts' || templateChoice === 'karin-plugin-js') {
      return await createPlugin(templateChoice, projectName, registrySuffix, httpAuthKey, wsAuthKey, karinVersion)
    }

    throw new Error('发生未知错误: 无效的模板选择')
  } catch (error) {
    console.log(magenta('Github: https://github.com/Karinjs/Karin/issues'))
    console.log(red('发生错误，请将以下信息反馈给开发者：'))
    console.log(green('--------------------------------'))
    console.log(error)
    console.log(green('--------------------------------'))
  }
}

/**
 * 创建新项目的主函数
 */
const main = async () => {
  // 显示帮助信息
  if (cliArgs.help) {
    showHelp()
    return
  }

  /** 检查环境 */
  const {
    registry,
    bestRegistry,
    pnpmVersion,
    pm2Version,
  } = await checkEnvironment()

  // 处理静默安装模式
  if (cliArgs.yes) {
    console.log(blue('检测到静默安装标志 (-y)，将使用默认配置...'))

    // 生成默认配置
    let defaultProjectName = 'karin-project'

    // 检查默认项目名称是否存在冲突
    const defaultDir = path.join(process.cwd(), defaultProjectName)
    if (fs.existsSync(defaultDir)) {
      // 如果冲突，在项目名称后添加3个随机字母
      defaultProjectName = `${defaultProjectName}-${getStr(3)}`
      console.log(yellow(`默认项目名称冲突，已自动重命名为: ${defaultProjectName}`))
    }

    const httpAuthKey = getStr(6)
    const wsAuthKey = getStr(6)
    const registrySuffix = bestRegistry ? ` --registry=${bestRegistry}` : ''

    // 检查Node版本
    checkNodeVersion()

    // 如果没有安装pnpm，则安装
    if (!pnpmVersion) {
      await installPnpmDependency(registrySuffix)
    }

    // 如果没有安装PM2，则安装
    if (!pm2Version) {
      await installPm2Dependency(registrySuffix)
    }

    // 创建项目
    await handleProjectCreation(
      'production',
      defaultProjectName,
      registrySuffix,
      httpAuthKey,
      wsAuthKey,
      'latest'
    )

    return
  }

  /** 选择项目模板 */
  const templateChoice = await selectProjectTemplate()
  if (!templateChoice) return

  /** 如果是 registry 则进入镜像源管理流程 */
  if (templateChoice === 'registry') {
    await handleRegistryChange()
    return
  }

  /** 如果是强制修复环境选项 */
  if (templateChoice === 'fix-env') {
    await handleFixEnvironment()
    return
  }

  /** 构建项目配置选项 */
  const options = buildProjectConfigOptions(
    templateChoice,
    registry,
    bestRegistry,
    pnpmVersion,
    pm2Version
  )

  /** 获取用户配置 */
  const result = await prompts(options, {
    onCancel: () => {
      showGoodbye()
      process.exit(0)
    },
  })

  /** 检查用户是否中途退出（没有输入项目名称） */
  if (!result.projectName) {
    showGoodbye()
    process.exit(0)
  }

  /** 提取配置结果 */
  const projectName = result.projectName.trim()
  const installPm2 = result.installPm2
  const changeRegistry = result.changeRegistry
  const installPnpm = !pnpmVersion || result?.upgradePnpm || result?.downgradePnpm

  /** 获取node-karin版本 */
  const karinVersion = result.karinVersionType === 'custom'
    ? result.customKarinVersion
    : 'latest'

  /** 构建registry后缀 */
  const registrySuffix = changeRegistry ? ` --registry=${changeRegistry}` : ''

  /** 检查Node版本 */
  checkNodeVersion()

  /** 安装依赖 */
  if (installPnpm) {
    await installPnpmDependency(registrySuffix)
  }

  if (installPm2) {
    await installPm2Dependency(registrySuffix)
  }

  /** 创建项目 */
  await handleProjectCreation(
    templateChoice,
    projectName,
    registrySuffix,
    result?.httpServerAuthKey,
    result?.wsServerAuthKey?.trim?.(),
    karinVersion
  )
}

main()
