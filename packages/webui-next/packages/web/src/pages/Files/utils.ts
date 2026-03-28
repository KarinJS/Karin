import type { FileSystemItem, FileSystemItemType } from './types'

const IMAGE_EXTENSIONS = new Set([
  'apng',
  'avif',
  'bmp',
  'gif',
  'ico',
  'jfif',
  'jpeg',
  'jpg',
  'png',
  'svg',
  'webp'
])

const VIDEO_EXTENSIONS = new Set([
  'avi',
  'm4v',
  'mkv',
  'mov',
  'mp4',
  'ogg',
  'webm'
])

const PDF_EXTENSIONS = new Set(['pdf'])

const AUDIO_EXTENSIONS = new Set([
  'aac',
  'flac',
  'm4a',
  'mp3',
  'ogg',
  'wav'
])

const TEXT_EDITABLE_EXTENSIONS = new Set([
  'c',
  'conf',
  'cpp',
  'css',
  'csv',
  'env',
  'go',
  'graphql',
  'html',
  'ini',
  'java',
  'js',
  'json',
  'jsx',
  'less',
  'log',
  'lua',
  'md',
  'mdx',
  'php',
  'py',
  'rb',
  'rs',
  'scss',
  'sh',
  'sql',
  'toml',
  'ts',
  'tsx',
  'txt',
  'xml',
  'yaml',
  'yml'
])

const resolveFileExtension = (fileName: string): string => {
  return fileName.toLowerCase().split('.').pop() || ''
}

export const formatFileSize = (size: number): string => {
  if (size < 1024) {
    return `${size} B`
  }
  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`
  }
  return `${(size / 1024 / 1024).toFixed(1)} MB`
}

export const splitPathSegments = (currentDirectory: string): string[] => {
  if (!currentDirectory) {
    return []
  }
  return currentDirectory.split('/').filter(Boolean)
}

export const resolveEditorLanguage = (fileName: string): string => {
  const extension = resolveFileExtension(fileName)
  const languageMap: Record<string, string> = {
    ts: 'typescript',
    tsx: 'typescript',
    js: 'javascript',
    jsx: 'javascript',
    json: 'json',
    css: 'css',
    scss: 'scss',
    html: 'html',
    md: 'markdown',
    yaml: 'yaml',
    yml: 'yaml'
  }
  return languageMap[extension] || 'plaintext'
}

export const isMarkdownFile = (fileName: string): boolean => {
  return resolveFileExtension(fileName) === 'md'
}

export const isImageFile = (fileName: string): boolean => {
  return IMAGE_EXTENSIONS.has(resolveFileExtension(fileName))
}

export const isVideoFile = (fileName: string): boolean => {
  return VIDEO_EXTENSIONS.has(resolveFileExtension(fileName))
}

export const isPdfFile = (fileName: string): boolean => {
  return PDF_EXTENSIONS.has(resolveFileExtension(fileName))
}

export const isAudioFile = (fileName: string): boolean => {
  return AUDIO_EXTENSIONS.has(resolveFileExtension(fileName))
}

export const isTextEditableFile = (fileName: string): boolean => {
  return TEXT_EDITABLE_EXTENSIONS.has(resolveFileExtension(fileName))
}

export const resolveFileContentUrl = (relativePath: string, raw: boolean = true): string => {
  const baseURL = import.meta.env.VITE_API_BASE_URL || '/api'
  const normalizedBase = baseURL.endsWith('/') ? baseURL.slice(0, -1) : baseURL
  const query = new URLSearchParams({
    path: relativePath
  })
  if (raw) {
    query.set('raw', '1')
  }
  return `${normalizedBase}/files/content?${query.toString()}`
}

export const resolveFileTypeLabel = (fileName: string, type: FileSystemItemType): string => {
  if (type === 'directory') {
    return '文件夹'
  }
  const extension = resolveFileExtension(fileName)
  const labelMap: Record<string, string> = {
    ts: 'TypeScript 源文件',
    tsx: 'TypeScript JSX 文件',
    js: 'JavaScript 源文件',
    jsx: 'JavaScript JSX 文件',
    json: 'JSON 配置文件',
    css: 'CSS 样式文件',
    scss: 'SCSS 样式文件',
    html: 'HTML 文档',
    md: 'Markdown 文档',
    gif: 'GIF 图片',
    png: 'PNG 图片',
    jpg: 'JPG 图片',
    jpeg: 'JPEG 图片',
    webp: 'WebP 图片',
    svg: 'SVG 图片',
    mp4: 'MP4 视频',
    webm: 'WebM 视频',
    pdf: 'PDF 文档'
  }
  return labelMap[extension] || '文件'
}

export interface FileIconMeta {
  icon: string
  className: string
}

const LIGHT_VARIANT_ICON_MAP: Record<string, string> = {
  'vscode-icons:file-type-yaml': 'vscode-icons:file-type-light-yaml',
  'vscode-icons:file-type-yaml-official': 'vscode-icons:file-type-light-yaml-official',
  'vscode-icons:file-type-vite': 'vscode-icons:file-type-light-vite',
  'vscode-icons:file-type-vitest': 'vscode-icons:file-type-light-vitest'
}

/**
 * 为文件图标按主题选择 light/dark 变体
 * @param icon 原始图标（带前缀）
 * @param isDark 是否深色模式
 * @returns 主题适配后的图标
 */
const resolveThemedFileIcon = (icon: string, isDark: boolean): string => {
  if (isDark) {
    return icon.replace('vscode-icons:file-type-light-', 'vscode-icons:file-type-')
  }
  if (LIGHT_VARIANT_ICON_MAP[icon]) {
    return LIGHT_VARIANT_ICON_MAP[icon]
  }
  if (icon.startsWith('vscode-icons:file-type-light-')) {
    return icon
  }
  return icon
}

/**
 * 安全解析图标（校验存在性并按主题适配）
 * @param icon 目标图标
 * @param fallbackIcon 兜底图标
 * @param isDark 是否深色模式
 * @returns 可用图标
 */
const resolveSafeIcon = (icon: string, fallbackIcon: string, isDark: boolean): string => {
  const themedIcon = resolveThemedFileIcon(icon, isDark)
  if (themedIcon) {
    return themedIcon
  }
  return resolveThemedFileIcon(fallbackIcon, isDark)
}

/**
 * 基于完整文件名补充特征图标
 * @param fileName 小写文件名
 * @returns 特征图标
 */
const resolveSpecialFileIconByPattern = (fileName: string): string => {
  if (/^readme([._-].+)?\.(md|mdx|txt)$/.test(fileName)) {
    return 'vscode-icons:file-type-markdown'
  }
  if (/^changelog([._-].+)?\.(md|mdx|txt)$/.test(fileName)) {
    return 'vscode-icons:file-type-markdown'
  }
  if (/^vite\.config\.(js|ts|mjs|mts|cjs|cts)$/.test(fileName)) {
    return 'vscode-icons:file-type-vite'
  }
  if (/^vitest\.config\.(js|ts|mjs|mts|cjs|cts)$/.test(fileName)) {
    return 'vscode-icons:file-type-vitest'
  }
  if (/^eslint\.config\.(js|ts|mjs|mts|cjs|cts)$/.test(fileName)) {
    return 'vscode-icons:file-type-eslint'
  }
  if (/^tailwind\.config\.(js|ts|mjs|mts|cjs|cts)$/.test(fileName)) {
    return 'vscode-icons:file-type-tailwind'
  }
  if (/^postcss\.config\.(js|ts|mjs|mts|cjs|cts)$/.test(fileName)) {
    return 'vscode-icons:file-type-postcss'
  }
  if (/^prettier\.config\.(js|ts|mjs|mts|cjs|cts)$/.test(fileName)) {
    return 'vscode-icons:file-type-prettier'
  }
  if (/^jest\.config\.(js|ts|mjs|mts|cjs|cts)$/.test(fileName)) {
    return 'vscode-icons:file-type-jest'
  }
  if (/^playwright\.config\.(js|ts|mjs|mts|cjs|cts)$/.test(fileName)) {
    return 'vscode-icons:file-type-playwright'
  }
  if (/^cypress\.config\.(js|ts|mjs|mts|cjs|cts)$/.test(fileName)) {
    return 'vscode-icons:file-type-cypress'
  }
  return ''
}

/**
 * 解析文件图标（使用 VSCode Icons）
 * @param item 文件系统项
 * @param isDark 是否深色模式
 * @returns 图标元数据
 */
export const resolveFileIcon = (item: FileSystemItem, isDark: boolean): FileIconMeta => {
  if (item.type === 'directory') {
    const folderName = item.name.toLowerCase()
    const specialFolders: Record<string, string> = {
      'node_modules': 'vscode-icons:folder-type-node',
      '.git': 'vscode-icons:folder-type-git',
      '.github': 'vscode-icons:folder-type-github',
      '.vscode': 'vscode-icons:folder-type-vscode',
      'src': 'vscode-icons:folder-type-src',
      'dist': 'vscode-icons:folder-type-dist',
      'build': 'vscode-icons:folder-type-buildtools',
      'public': 'vscode-icons:folder-type-public',
      'assets': 'vscode-icons:folder-type-assets',
      'images': 'vscode-icons:folder-type-images',
      'components': 'vscode-icons:folder-type-component',
      'utils': 'vscode-icons:folder-type-utils',
      'lib': 'vscode-icons:folder-type-library',
      'config': 'vscode-icons:folder-type-config',
      'test': 'vscode-icons:folder-type-test',
      'tests': 'vscode-icons:folder-type-test',
      '__tests__': 'vscode-icons:folder-type-test',
      'docs': 'vscode-icons:folder-type-docs',
      'api': 'vscode-icons:folder-type-api',
      'styles': 'vscode-icons:folder-type-css',
      'css': 'vscode-icons:folder-type-css',
      'scripts': 'vscode-icons:folder-type-scripts',
      'types': 'vscode-icons:folder-type-typescript',
      'hooks': 'vscode-icons:folder-type-hook',
      'pages': 'vscode-icons:folder-type-route',
      'routes': 'vscode-icons:folder-type-route',
      'middleware': 'vscode-icons:folder-type-middleware',
      'models': 'vscode-icons:folder-type-model',
      'controllers': 'vscode-icons:folder-type-controller',
      'services': 'vscode-icons:folder-type-services',
      'views': 'vscode-icons:folder-type-view',
      'layouts': 'vscode-icons:folder-type-layout',
      'store': 'vscode-icons:folder-type-store',
      'redux': 'vscode-icons:folder-type-redux',
      'context': 'vscode-icons:folder-type-context',
      'providers': 'vscode-icons:folder-type-provider',
      'helpers': 'vscode-icons:folder-type-helper',
      'constants': 'vscode-icons:folder-type-constant',
      'interfaces': 'vscode-icons:folder-type-interface',
      'database': 'vscode-icons:folder-type-database',
      'migrations': 'vscode-icons:folder-type-database',
      'seeds': 'vscode-icons:folder-type-database',
      'locales': 'vscode-icons:folder-type-locale',
      'i18n': 'vscode-icons:folder-type-i18n',
      'translations': 'vscode-icons:folder-type-locale',
      'fonts': 'vscode-icons:folder-type-font',
      'icons': 'vscode-icons:folder-type-icon',
      'animations': 'vscode-icons:folder-type-animation',
      'audio': 'vscode-icons:folder-type-audio',
      'video': 'vscode-icons:folder-type-video',
      'temp': 'vscode-icons:folder-type-temp',
      'tmp': 'vscode-icons:folder-type-temp',
      'cache': 'vscode-icons:folder-type-temp',
      'logs': 'vscode-icons:folder-type-log',
      'coverage': 'vscode-icons:folder-type-coverage',
      'e2e': 'vscode-icons:folder-type-e2e',
      'cypress': 'vscode-icons:folder-type-cypress',
      'webpack': 'vscode-icons:folder-type-webpack',
      'vite': 'vscode-icons:folder-type-vite',
      'docker': 'vscode-icons:folder-type-docker',
      'kubernetes': 'vscode-icons:folder-type-kubernetes',
      'k8s': 'vscode-icons:folder-type-kubernetes',
      'terraform': 'vscode-icons:folder-type-terraform',
      'ansible': 'vscode-icons:folder-type-ansible',
      'aws': 'vscode-icons:folder-type-aws',
      'azure': 'vscode-icons:folder-type-azure',
      'gcp': 'vscode-icons:folder-type-gcp',
      'firebase': 'vscode-icons:folder-type-firebase',
      'supabase': 'vscode-icons:folder-type-supabase',
      'prisma': 'vscode-icons:folder-type-prisma',
      'graphql': 'vscode-icons:folder-type-graphql',
      'grpc': 'vscode-icons:folder-type-grpc',
      'proto': 'vscode-icons:folder-type-proto',
      'android': 'vscode-icons:folder-type-android',
      'ios': 'vscode-icons:folder-type-ios',
      'macos': 'vscode-icons:folder-type-macos',
      'windows': 'vscode-icons:folder-type-windows',
      'linux': 'vscode-icons:folder-type-linux'
    }
    return {
      icon: resolveSafeIcon(specialFolders[folderName] || 'vscode-icons:default-folder', 'vscode-icons:default-folder', isDark),
      className: ''
    }
  }

  const fileName = item.name.toLowerCase()
  const extension = resolveFileExtension(item.name)
  const specialFiles: Record<string, string> = {
    'package.json': 'vscode-icons:file-type-npm',
    'package-lock.json': 'vscode-icons:file-type-npm',
    'yarn.lock': 'vscode-icons:file-type-yarn',
    'pnpm-lock.yaml': 'vscode-icons:file-type-pnpm',
    'pnpm-workspace.yaml': 'vscode-icons:file-type-pnpm',
    'pnpmfile.cjs': 'vscode-icons:file-type-pnpm',
    'npm-shrinkwrap.json': 'vscode-icons:file-type-npm',
    'bun.lockb': 'vscode-icons:file-type-bun',
    'deno.json': 'vscode-icons:file-type-deno',
    'deno.jsonc': 'vscode-icons:file-type-deno',
    'tsconfig.json': 'vscode-icons:file-type-tsconfig',
    'jsconfig.json': 'vscode-icons:file-type-jsconfig',
    'webpack.config.js': 'vscode-icons:file-type-webpack',
    'vite.config.js': 'vscode-icons:file-type-vite',
    'vite.config.ts': 'vscode-icons:file-type-vite',
    'rollup.config.js': 'vscode-icons:file-type-rollup',
    'babel.config.js': 'vscode-icons:file-type-babel',
    '.babelrc': 'vscode-icons:file-type-babel',
    'eslint.config.js': 'vscode-icons:file-type-eslint',
    '.eslintrc': 'vscode-icons:file-type-eslint',
    '.eslintrc.js': 'vscode-icons:file-type-eslint',
    '.eslintrc.cjs': 'vscode-icons:file-type-eslint',
    '.eslintrc.mjs': 'vscode-icons:file-type-eslint',
    '.eslintrc.yaml': 'vscode-icons:file-type-eslint',
    '.eslintrc.yml': 'vscode-icons:file-type-eslint',
    '.eslintrc.json': 'vscode-icons:file-type-eslint',
    '.prettierrc': 'vscode-icons:file-type-prettier',
    '.prettierrc.cjs': 'vscode-icons:file-type-prettier',
    '.prettierrc.mjs': 'vscode-icons:file-type-prettier',
    '.prettierrc.json': 'vscode-icons:file-type-prettier',
    '.prettierrc.yaml': 'vscode-icons:file-type-prettier',
    '.prettierrc.yml': 'vscode-icons:file-type-prettier',
    'prettier.config.js': 'vscode-icons:file-type-prettier',
    '.editorconfig': 'vscode-icons:file-type-editorconfig',
    'dockerfile': 'vscode-icons:file-type-docker',
    'docker-compose.yml': 'vscode-icons:file-type-docker',
    'docker-compose.yaml': 'vscode-icons:file-type-docker',
    '.dockerignore': 'vscode-icons:file-type-docker',
    '.gitignore': 'vscode-icons:file-type-git',
    '.gitattributes': 'vscode-icons:file-type-git',
    '.gitmodules': 'vscode-icons:file-type-git',
    'readme.md': 'vscode-icons:file-type-markdown',
    'changelog.md': 'vscode-icons:file-type-markdown',
    'license': 'vscode-icons:file-type-license',
    'license.md': 'vscode-icons:file-type-license',
    'license.txt': 'vscode-icons:file-type-license',
    '.env': 'vscode-icons:file-type-dotenv',
    '.env.local': 'vscode-icons:file-type-dotenv',
    '.env.development': 'vscode-icons:file-type-dotenv',
    '.env.production': 'vscode-icons:file-type-dotenv',
    'makefile': 'vscode-icons:file-type-makefile',
    'cmake': 'vscode-icons:file-type-cmake',
    'cmakelists.txt': 'vscode-icons:file-type-cmake',
    'cargo.toml': 'vscode-icons:file-type-cargo',
    'cargo.lock': 'vscode-icons:file-type-cargo',
    'go.mod': 'vscode-icons:file-type-go-mod',
    'go.sum': 'vscode-icons:file-type-go-mod',
    'requirements.txt': 'vscode-icons:file-type-python',
    'pipfile': 'vscode-icons:file-type-python',
    'poetry.lock': 'vscode-icons:file-type-python',
    'gemfile': 'vscode-icons:file-type-ruby',
    'gemfile.lock': 'vscode-icons:file-type-ruby',
    'composer.json': 'vscode-icons:file-type-composer',
    'composer.lock': 'vscode-icons:file-type-composer',
    'build.gradle': 'vscode-icons:file-type-gradle',
    'pom.xml': 'vscode-icons:file-type-maven',
    'nuxt.config.js': 'vscode-icons:file-type-nuxt',
    'nuxt.config.ts': 'vscode-icons:file-type-nuxt',
    'next.config.js': 'vscode-icons:file-type-next',
    'next.config.ts': 'vscode-icons:file-type-next',
    'angular.json': 'vscode-icons:file-type-angular',
    'vue.config.js': 'vscode-icons:file-type-vue-config',
    'svelte.config.js': 'vscode-icons:file-type-svelte-config',
    'astro.config.mjs': 'vscode-icons:file-type-astro-config',
    'remix.config.js': 'vscode-icons:file-type-remix',
    'gatsby-config.js': 'vscode-icons:file-type-gatsby',
    'tailwind.config.js': 'vscode-icons:file-type-tailwind',
    'tailwind.config.ts': 'vscode-icons:file-type-tailwind',
    'postcss.config.js': 'vscode-icons:file-type-postcss',
    'jest.config.js': 'vscode-icons:file-type-jest',
    'vitest.config.js': 'vscode-icons:file-type-vitest',
    'vitest.config.ts': 'vscode-icons:file-type-vitest',
    'cypress.config.js': 'vscode-icons:file-type-cypress',
    'playwright.config.js': 'vscode-icons:file-type-playwright',
    'vercel.json': 'vscode-icons:file-type-vercel',
    'netlify.toml': 'vscode-icons:file-type-netlify',
    'firebase.json': 'vscode-icons:file-type-firebase',
    'app.json': 'vscode-icons:file-type-expo',
    'expo.json': 'vscode-icons:file-type-expo',
    'capacitor.config.json': 'vscode-icons:file-type-capacitor',
    'ionic.config.json': 'vscode-icons:file-type-ionic',
    'electron.js': 'vscode-icons:file-type-electron',
    'tauri.conf.json': 'vscode-icons:file-type-tauri',
    'wrangler.toml': 'vscode-icons:file-type-wrangler',
    'cloudflare.json': 'vscode-icons:file-type-cloudflare',
    'serverless.yml': 'vscode-icons:file-type-serverless',
    'terraform.tfvars': 'vscode-icons:file-type-terraform',
    'ansible.cfg': 'vscode-icons:file-type-ansible',
    'vagrantfile': 'vscode-icons:file-type-vagrant',
    'procfile': 'vscode-icons:file-type-procfile',
    'jenkinsfile': 'vscode-icons:file-type-jenkins',
    '.gitlab-ci.yml': 'vscode-icons:file-type-gitlab',
    '.travis.yml': 'vscode-icons:file-type-travis',
    'appveyor.yml': 'vscode-icons:file-type-appveyor',
    'azure-pipelines.yml': 'vscode-icons:file-type-azure-pipelines',
    'bitbucket-pipelines.yml': 'vscode-icons:file-type-bitbucket',
    'renovate.json': 'vscode-icons:file-type-renovate',
    'dependabot.yml': 'vscode-icons:file-type-dependabot',
    'turbo.json': 'vscode-icons:file-type-turbo',
    'nx.json': 'vscode-icons:file-type-nx',
    'lerna.json': 'vscode-icons:file-type-lerna',
    'rush.json': 'vscode-icons:file-type-rush',
    'workspace.json': 'vscode-icons:file-type-workspace',
    'biome.json': 'vscode-icons:file-type-biome',
    'rome.json': 'vscode-icons:file-type-rome',
    'dprint.json': 'vscode-icons:file-type-dprint',
    'lefthook.yml': 'vscode-icons:file-type-lefthook',
    'husky': 'vscode-icons:file-type-husky',
    '.huskyrc': 'vscode-icons:file-type-husky',
    'commitlint.config.js': 'vscode-icons:file-type-commitlint',
    '.commitlintrc': 'vscode-icons:file-type-commitlint',
    'lint-staged.config.js': 'vscode-icons:file-type-lint-staged',
    '.lintstagedrc': 'vscode-icons:file-type-lint-staged',
    'stylelint.config.js': 'vscode-icons:file-type-stylelint',
    '.stylelintrc': 'vscode-icons:file-type-stylelint',
    'browserslist': 'vscode-icons:file-type-browserslist',
    '.browserslistrc': 'vscode-icons:file-type-browserslist',
    'nodemon.json': 'vscode-icons:file-type-nodemon',
    'pm2.config.js': 'vscode-icons:file-type-pm2'
  }

  const specialIconByPattern = resolveSpecialFileIconByPattern(fileName)
  if (specialIconByPattern) {
    return {
      icon: resolveSafeIcon(specialIconByPattern, 'vscode-icons:default-file', isDark),
      className: ''
    }
  }

  if (specialFiles[fileName]) {
    return {
      icon: resolveSafeIcon(specialFiles[fileName], 'vscode-icons:default-file', isDark),
      className: ''
    }
  }

  const extensionMap: Record<string, string> = {
    'js': 'vscode-icons:file-type-js',
    'jsx': 'vscode-icons:file-type-reactjs',
    'ts': 'vscode-icons:file-type-typescript',
    'tsx': 'vscode-icons:file-type-reactts',
    'mjs': 'vscode-icons:file-type-js',
    'cjs': 'vscode-icons:file-type-js',
    'mts': 'vscode-icons:file-type-typescript',
    'cts': 'vscode-icons:file-type-typescript',
    'html': 'vscode-icons:file-type-html',
    'htm': 'vscode-icons:file-type-html',
    'css': 'vscode-icons:file-type-css',
    'scss': 'vscode-icons:file-type-scss',
    'sass': 'vscode-icons:file-type-sass',
    'less': 'vscode-icons:file-type-less',
    'styl': 'vscode-icons:file-type-stylus',
    'vue': 'vscode-icons:file-type-vue',
    'svelte': 'vscode-icons:file-type-svelte',
    'astro': 'vscode-icons:file-type-astro',
    'json': 'vscode-icons:file-type-json',
    'jsonc': 'vscode-icons:file-type-json',
    'json5': 'vscode-icons:file-type-json',
    'yaml': 'vscode-icons:file-type-yaml',
    'yml': 'vscode-icons:file-type-yaml',
    'toml': 'vscode-icons:file-type-toml',
    'xml': 'vscode-icons:file-type-xml',
    'csv': 'vscode-icons:file-type-csv',
    'ini': 'vscode-icons:file-type-ini',
    'conf': 'vscode-icons:file-type-config',
    'config': 'vscode-icons:file-type-config',
    'md': 'vscode-icons:file-type-markdown',
    'mdx': 'vscode-icons:file-type-mdx',
    'txt': 'vscode-icons:file-type-text',
    'pdf': 'vscode-icons:file-type-pdf',
    'doc': 'vscode-icons:file-type-word',
    'docx': 'vscode-icons:file-type-word',
    'xls': 'vscode-icons:file-type-excel',
    'xlsx': 'vscode-icons:file-type-excel',
    'ppt': 'vscode-icons:file-type-powerpoint',
    'pptx': 'vscode-icons:file-type-powerpoint',
    'png': 'vscode-icons:file-type-image',
    'jpg': 'vscode-icons:file-type-image',
    'jpeg': 'vscode-icons:file-type-image',
    'gif': 'vscode-icons:file-type-image',
    'svg': 'vscode-icons:file-type-svg',
    'webp': 'vscode-icons:file-type-image',
    'avif': 'vscode-icons:file-type-image',
    'ico': 'vscode-icons:file-type-image',
    'bmp': 'vscode-icons:file-type-image',
    'tiff': 'vscode-icons:file-type-image',
    'psd': 'vscode-icons:file-type-photoshop',
    'ai': 'vscode-icons:file-type-illustrator',
    'sketch': 'vscode-icons:file-type-sketch',
    'fig': 'vscode-icons:file-type-figma',
    'xd': 'vscode-icons:file-type-xd',
    'mp4': 'vscode-icons:file-type-video',
    'webm': 'vscode-icons:file-type-video',
    'mov': 'vscode-icons:file-type-video',
    'avi': 'vscode-icons:file-type-video',
    'mkv': 'vscode-icons:file-type-video',
    'flv': 'vscode-icons:file-type-video',
    'wmv': 'vscode-icons:file-type-video',
    'mp3': 'vscode-icons:file-type-audio',
    'wav': 'vscode-icons:file-type-audio',
    'ogg': 'vscode-icons:file-type-audio',
    'flac': 'vscode-icons:file-type-audio',
    'aac': 'vscode-icons:file-type-audio',
    'm4a': 'vscode-icons:file-type-audio',
    'zip': 'vscode-icons:file-type-zip',
    'rar': 'vscode-icons:file-type-zip',
    '7z': 'vscode-icons:file-type-zip',
    'tar': 'vscode-icons:file-type-zip',
    'gz': 'vscode-icons:file-type-zip',
    'bz2': 'vscode-icons:file-type-zip',
    'xz': 'vscode-icons:file-type-zip',
    'py': 'vscode-icons:file-type-python',
    'pyc': 'vscode-icons:file-type-python',
    'pyw': 'vscode-icons:file-type-python',
    'pyx': 'vscode-icons:file-type-python',
    'java': 'vscode-icons:file-type-java',
    'class': 'vscode-icons:file-type-java',
    'jar': 'vscode-icons:file-type-jar',
    'kt': 'vscode-icons:file-type-kotlin',
    'kts': 'vscode-icons:file-type-kotlin',
    'scala': 'vscode-icons:file-type-scala',
    'groovy': 'vscode-icons:file-type-groovy',
    'c': 'vscode-icons:file-type-c',
    'h': 'vscode-icons:file-type-c',
    'cpp': 'vscode-icons:file-type-cpp',
    'cc': 'vscode-icons:file-type-cpp',
    'cxx': 'vscode-icons:file-type-cpp',
    'hpp': 'vscode-icons:file-type-cpp',
    'cs': 'vscode-icons:file-type-csharp',
    'fs': 'vscode-icons:file-type-fsharp',
    'vb': 'vscode-icons:file-type-vb',
    'go': 'vscode-icons:file-type-go',
    'rs': 'vscode-icons:file-type-rust',
    'swift': 'vscode-icons:file-type-swift',
    'rb': 'vscode-icons:file-type-ruby',
    'php': 'vscode-icons:file-type-php',
    'lua': 'vscode-icons:file-type-lua',
    'r': 'vscode-icons:file-type-r',
    'dart': 'vscode-icons:file-type-dart',
    'ex': 'vscode-icons:file-type-elixir',
    'exs': 'vscode-icons:file-type-elixir',
    'erl': 'vscode-icons:file-type-erlang',
    'hrl': 'vscode-icons:file-type-erlang',
    'clj': 'vscode-icons:file-type-clojure',
    'cljs': 'vscode-icons:file-type-clojure',
    'hs': 'vscode-icons:file-type-haskell',
    'ml': 'vscode-icons:file-type-ocaml',
    'nim': 'vscode-icons:file-type-nim',
    'zig': 'vscode-icons:file-type-zig',
    'v': 'vscode-icons:file-type-vlang',
    'jl': 'vscode-icons:file-type-julia',
    'cr': 'vscode-icons:file-type-crystal',
    'sh': 'vscode-icons:file-type-shell',
    'bash': 'vscode-icons:file-type-shell',
    'zsh': 'vscode-icons:file-type-shell',
    'fish': 'vscode-icons:file-type-shell',
    'ps1': 'vscode-icons:file-type-powershell',
    'psm1': 'vscode-icons:file-type-powershell',
    'bat': 'vscode-icons:file-type-bat',
    'cmd': 'vscode-icons:file-type-bat',
    'sql': 'vscode-icons:file-type-sql',
    'db': 'vscode-icons:file-type-db',
    'sqlite': 'vscode-icons:file-type-sqlite',
    'prisma': 'vscode-icons:file-type-prisma',
    'graphql': 'vscode-icons:file-type-graphql',
    'gql': 'vscode-icons:file-type-graphql',
    'proto': 'vscode-icons:file-type-proto',
    'lock': 'vscode-icons:file-type-lock',
    'lockb': 'vscode-icons:file-type-bun',
    'ttf': 'vscode-icons:file-type-font',
    'otf': 'vscode-icons:file-type-font',
    'woff': 'vscode-icons:file-type-font',
    'woff2': 'vscode-icons:file-type-font',
    'eot': 'vscode-icons:file-type-font',
    'pem': 'vscode-icons:file-type-cert',
    'crt': 'vscode-icons:file-type-cert',
    'cer': 'vscode-icons:file-type-cert',
    'key': 'vscode-icons:file-type-key',
    'log': 'vscode-icons:file-type-log',
    'exe': 'vscode-icons:file-type-binary',
    'dll': 'vscode-icons:file-type-binary',
    'so': 'vscode-icons:file-type-binary',
    'dylib': 'vscode-icons:file-type-binary',
    'bin': 'vscode-icons:file-type-binary',
    'wasm': 'vscode-icons:file-type-wasm',
    'asm': 'vscode-icons:file-type-assembly'
  }

  return {
    icon: resolveSafeIcon(extensionMap[extension] || 'vscode-icons:default-file', 'vscode-icons:default-file', isDark),
    className: ''
  }
}
