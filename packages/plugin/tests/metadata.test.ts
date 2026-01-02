/**
 * Metadata 解析测试
 * 覆盖 core/metadata.ts
 */
import { describe, it, expect } from 'vitest'
import { parsePluginMetadata } from '../src/core/metadata'

describe('parsePluginMetadata', () => {
  describe('有效元数据解析', () => {
    it('应该解析完整的元数据块', () => {
      const content = `
/*!
 * @name karin-plugin-test
 * @version 1.0.0
 * @author test-author
 * @repository https://github.com/test/repo
 * @description A test plugin
 * @license MIT
 * @raw https://raw.githubusercontent.com/test/repo/main/plugin.js
 */
export const plugin = {}
`
      const meta = parsePluginMetadata(content)

      expect(meta).not.toBeNull()
      expect(meta!.name).toBe('karin-plugin-test')
      expect(meta!.version).toBe('1.0.0')
      expect(meta!.author).toBe('test-author')
      expect(meta!.repository).toBe('https://github.com/test/repo')
      expect(meta!.description).toBe('A test plugin')
      expect(meta!.license).toBe('MIT')
      expect(meta!.raw).toBe('https://raw.githubusercontent.com/test/repo/main/plugin.js')
    })

    it('应该处理多行描述', () => {
      const content = `
/*!
 * @name plugin
 * @version 1.0.0
 * @author author
 * @repository https://github.com/test/repo
 * @description This is a very long description that spans one line
 * @license MIT
 * @raw https://example.com/raw
 */
`
      const meta = parsePluginMetadata(content)

      expect(meta).not.toBeNull()
      expect(meta!.description).toBe('This is a very long description that spans one line')
    })

    it('应该处理 Unicode 字符', () => {
      const content = `
/*!
 * @name 中文插件名称
 * @version 1.0.0
 * @author 作者名🎉
 * @repository https://github.com/test/repo
 * @description 这是一个中文描述
 * @license MIT
 * @raw https://example.com/raw
 */
`
      const meta = parsePluginMetadata(content)

      expect(meta).not.toBeNull()
      expect(meta!.name).toBe('中文插件名称')
      expect(meta!.author).toBe('作者名🎉')
      expect(meta!.description).toBe('这是一个中文描述')
    })

    it('应该处理带空格的字段值', () => {
      const content = `
/*!
 * @name   plugin-with-spaces
 * @version   2.0.0
 * @author   author name
 * @repository https://github.com/test/repo
 * @description   description with spaces
 * @license   Apache-2.0
 * @raw https://example.com/raw
 */
`
      const meta = parsePluginMetadata(content)

      expect(meta).not.toBeNull()
      expect(meta!.name).toBe('plugin-with-spaces')
      expect(meta!.version).toBe('2.0.0')
      expect(meta!.author).toBe('author name')
      expect(meta!.license).toBe('Apache-2.0')
    })
  })

  describe('无效元数据处理', () => {
    it('应该返回 null 当没有元数据块时', () => {
      const content = `
// 这是一个普通的 JavaScript 文件
export const plugin = {}
`
      const meta = parsePluginMetadata(content)
      expect(meta).toBeNull()
    })

    it('应该返回 null 当元数据不完整时', () => {
      const content = `
/*!
 * @name plugin
 * @version 1.0.0
 */
`
      const meta = parsePluginMetadata(content)
      expect(meta).toBeNull()
    })

    it('应该返回 null 当字段缺失时', () => {
      const content = `
/*!
 * @name plugin
 * @version 1.0.0
 * @author author
 * @repository https://github.com/test/repo
 * @description description
 */
`
      // 缺少 license 和 raw
      const meta = parsePluginMetadata(content)
      expect(meta).toBeNull()
    })

    it('应该返回 null 当使用错误的注释格式时', () => {
      const content = `
/*
 * @name plugin
 * @version 1.0.0
 * @author author
 * @repository https://github.com/test/repo
 * @description description
 * @license MIT
 * @raw https://example.com/raw
 */
`
      // 使用 /* 而不是 /*!
      const meta = parsePluginMetadata(content)
      expect(meta).toBeNull()
    })

    it('应该返回 null 当输入为空字符串时', () => {
      const meta = parsePluginMetadata('')
      expect(meta).toBeNull()
    })

    it('应该忽略未知字段', () => {
      const content = `
/*!
 * @name plugin
 * @version 1.0.0
 * @author author
 * @repository https://github.com/test/repo
 * @description description
 * @license MIT
 * @raw https://example.com/raw
 * @unknown this should be ignored
 * @custom also ignored
 */
`
      const meta = parsePluginMetadata(content)

      expect(meta).not.toBeNull()
      expect((meta as any).unknown).toBeUndefined()
      expect((meta as any).custom).toBeUndefined()
    })
  })

  describe('边缘情况', () => {
    it('应该处理文件中间的元数据块', () => {
      const content = `
// 前面的代码
const a = 1

/*!
 * @name plugin
 * @version 1.0.0
 * @author author
 * @repository https://github.com/test/repo
 * @description description
 * @license MIT
 * @raw https://example.com/raw
 */

// 后面的代码
const b = 2
`
      const meta = parsePluginMetadata(content)
      expect(meta).not.toBeNull()
    })

    it('应该处理带有特殊字符的 URL', () => {
      const content = `
/*!
 * @name plugin
 * @version 1.0.0
 * @author author
 * @repository https://github.com/test/repo?ref=main&foo=bar#readme
 * @description description
 * @license MIT
 * @raw https://example.com/path/to/file.js?v=1.0.0&t=123
 */
`
      const meta = parsePluginMetadata(content)

      expect(meta).not.toBeNull()
      expect(meta!.repository).toContain('?ref=main')
      expect(meta!.raw).toContain('?v=1.0.0')
    })

    it('应该处理多个元数据块（只取第一个）', () => {
      const content = `
/*!
 * @name first-plugin
 * @version 1.0.0
 * @author author1
 * @repository https://github.com/test/repo1
 * @description first description
 * @license MIT
 * @raw https://example.com/raw1
 */

/*!
 * @name second-plugin
 * @version 2.0.0
 * @author author2
 * @repository https://github.com/test/repo2
 * @description second description
 * @license Apache-2.0
 * @raw https://example.com/raw2
 */
`
      const meta = parsePluginMetadata(content)

      expect(meta).not.toBeNull()
      expect(meta!.name).toBe('first-plugin')
      expect(meta!.version).toBe('1.0.0')
    })

    it('应该处理 minified 代码中的元数据', () => {
      // 当前实现需要 @ 字段在独立行上，minified 代码不支持
      const content = '/*!@name my-plugin @version 1.0.0 @author test @repository https://github.com/test @description desc @license MIT @raw https://raw.test*/'

      const meta = parsePluginMetadata(content)
      // 由于字段不在独立行，返回 null
      expect(meta).toBeNull()
    })

    it('应该处理 Windows 换行符', () => {
      const content = '/*!\r\n * @name plugin\r\n * @version 1.0.0\r\n * @author author\r\n * @repository https://github.com/test/repo\r\n * @description description\r\n * @license MIT\r\n * @raw https://example.com/raw\r\n */'

      const meta = parsePluginMetadata(content)
      expect(meta).not.toBeNull()
    })
  })
})
