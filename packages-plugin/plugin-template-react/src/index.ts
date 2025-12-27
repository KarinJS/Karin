import fs from 'node:fs'
import vm from 'node:vm'
import React from 'react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { renderToString } from 'react-dom/server'
import * as jsxRuntime from 'react/jsx-runtime'
import type { PluginBuild } from 'esbuild-wasm'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * React SSR 渲染器
 * @description 负责 React 组件的服务端渲染和客户端打包
 */
export class ReactRenderer {
  private readonly resolveDir: string
  private readonly tailwindPath: string

  /**
   * 创建渲染器实例
   * @param resolveDir - 模块解析目录，默认为当前目录
   */
  constructor () {
    this.resolveDir = __dirname
    this.tailwindPath = path.join(this.resolveDir, 'public', 'tailwindcss.js')
  }

  /**
   * 创建模块解析器（用于 SSR）
   * @returns 模块解析函数
   */
  private createResolver () {
    const modules: Record<string, unknown> = {
      react: React,
      'react/jsx-runtime': jsxRuntime,
    }
    return (name: string) => {
      if (name in modules) return modules[name]
      throw new Error(`Module "${name}" not found`)
    }
  }

  /**
   * 在 VM 中执行代码获取组件
   * @param code - 编译后的 JS 代码
   * @returns React 组件
   */
  private executeInVM (code: string): React.ComponentType {
    const exports: Record<string, unknown> = {}
    const context = {
      exports,
      module: { exports },
      require: this.createResolver(),
      console,
    }
    vm.runInNewContext(code, context)
    const mod = context.module.exports as { default?: unknown }
    return (mod.default || mod) as React.ComponentType
  }

  /**
   * SSR 构建：转换 TSX 并渲染为 HTML
   * @param code - TSX/JSX 代码
   * @param props - 组件参数
   * @param esbuild - esbuild 实例
   * @returns 渲染后的 HTML 字符串
   */
  private async buildSSR (code: string, props: Record<string, unknown>, esbuild: typeof import('esbuild-wasm')): Promise<string> {
    const result = await esbuild.transform(code, {
      loader: 'tsx',
      format: 'cjs',
      jsx: 'automatic',
    })
    const Component = this.executeInVM(result.code)
    return renderToString(React.createElement(Component, props as React.Attributes))
  }

  /**
   * 客户端构建：打包 React 和用户代码
   * @param code - TSX/JSX 代码
   * @param props - 组件参数
   * @param esbuild - esbuild 实例
   * @returns 打包后的 JS 代码
   */
  private async buildClient (code: string, props: Record<string, unknown>, esbuild: typeof import('esbuild-wasm')): Promise<string> {
    const result = await esbuild.build({
      bundle: true,
      minify: true,
      treeShaking: true,
      format: 'iife',
      platform: 'browser',
      target: 'es2020',
      define: { 'process.env.NODE_ENV': '"production"' },
      outfile: 'bundle.js',
      write: false,
      plugins: [{
        name: 'virtual-entry',
        setup: (build: PluginBuild) => {
          build.onResolve({ filter: /^virtual-entry$/ }, () => ({
            path: 'virtual-entry',
            namespace: 'virtual-entry-ns',
          }))
          build.onLoad({ filter: /.*/, namespace: 'virtual-entry-ns' }, () => ({
            contents: `
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from 'user-code'
const root = createRoot(document.getElementById('root'))
const props = ${JSON.stringify(props)}
root.render(React.createElement(App, props))
`,
            loader: 'tsx',
            resolveDir: this.resolveDir,
          }))
          build.onResolve({ filter: /^user-code$/ }, () => ({
            path: 'user-code',
            namespace: 'user-code-ns',
          }))
          build.onLoad({ filter: /.*/, namespace: 'user-code-ns' }, () => ({
            contents: code,
            loader: 'tsx',
            resolveDir: this.resolveDir,
          }))
        },
      }],
      entryPoints: ['virtual-entry'],
    })
    const clientJS = result.outputFiles?.[0]?.text
    if (!clientJS) throw new Error('Client build failed')
    return clientJS
  }

  /**
   * 生成完整 HTML 页面
   * @param code - TSX/JSX 代码
   * @param props - 组件参数
   * @returns 完整的 HTML 字符串
   */
  async render (code: string, props: Record<string, unknown> = {}): Promise<string> {
    const esbuild = await import('esbuild-wasm').catch(() => null)
    const tailwindContent = process.env.__TAILWIND__ || fs.readFileSync(this.tailwindPath, 'utf-8')

    if (!esbuild) {
      const html = process.env.__HTML__ || fs.readFileSync(path.join(this.resolveDir, 'public', 'react.html'), 'utf-8')
      const data = html
        .replace('"<{code}>"', code)
        .replace('"<{props}>"', JSON.stringify(props))
      // .replace('<script src="https://cdn.tailwindcss.com"></script>', `<script>${tailwindContent}</script>`)
      return data
    }

    const [html, clientJS] = await Promise.all([
      this.buildSSR(code, props, esbuild),
      this.buildClient(code, props, esbuild),
    ])
    const stylesTags = `<script>${tailwindContent}</script>`

    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>React SSR</title>
${stylesTags}
</head>
<body>
<div id="root">${html}</div>
<script>${clientJS}</script>
</body>
</html>`
  }
}

/**
 * 便捷函数：生成完整 HTML
 * @param code - TSX/JSX 代码
 * @returns 完整的 HTML 字符串
 */
export async function generateFullHTML (code: string, props: Record<string, unknown> = {}): Promise<string> {
  const renderer = new ReactRenderer()
  return renderer.render(code, props)
}

// 测试
const demoCode = fs.readFileSync(path.join(__dirname, 'demo.tsx'), 'utf-8')

generateFullHTML(demoCode, {
  label: '测试计数器',
})
  .then(html => {
    fs.writeFileSync(path.join(__dirname, 'output.html'), html, 'utf-8')
    console.log('✅ HTML 已保存到 output.html (React 已打包)')
  })
  .catch(console.error)
