/**
 * config 模块测试
 */

import { describe, it, expect } from 'vitest'
import { defineKarinConfig, defineWebConfig } from '../src/config'
import type { DefineConfig } from '../src/config/karin.config'
import type { DefineConfigWeb } from '../src/config/web.config'

describe('config', () => {
  describe('defineKarinConfig', () => {
    it('should return the same config object', () => {
      const config: DefineConfig = {
        meta: {
          name: 'test-plugin',
          description: 'Test plugin',
        },
        entry: 'src/index.ts',
      }
      const result = defineKarinConfig(config)
      expect(result).toBe(config)
    })

    it('should handle string entry', () => {
      const config: DefineConfig = {
        entry: 'src/apps',
      }
      expect(defineKarinConfig(config).entry).toBe('src/apps')
    })

    it('should handle array entry', () => {
      const config: DefineConfig = {
        entry: ['src/apps', 'src/index.ts'],
      }
      expect(defineKarinConfig(config).entry).toEqual(['src/apps', 'src/index.ts'])
    })

    it('should handle environment-based entry', () => {
      const config: DefineConfig = {
        entry: [
          { type: 'dev', path: 'src/dev.ts' },
          { type: 'prod', path: 'dist/index.js' },
        ],
      }
      const result = defineKarinConfig(config)
      expect(Array.isArray(result.entry)).toBe(true)
    })

    it('should handle public config', () => {
      const config: DefineConfig = {
        public: './public',
      }
      expect(defineKarinConfig(config).public).toBe('./public')
    })

    it('should handle public array', () => {
      const config: DefineConfig = {
        public: ['./public', './dist/public'],
      }
      expect(defineKarinConfig(config).public).toEqual(['./public', './dist/public'])
    })

    it('should handle files config', () => {
      const config: DefineConfig = {
        files: ['config', 'data', 'logs'],
      }
      expect(defineKarinConfig(config).files).toEqual(['config', 'data', 'logs'])
    })

    it('should handle env config with string values', () => {
      const config: DefineConfig = {
        env: {
          MY_VAR: 'value',
        },
      }
      expect(defineKarinConfig(config).env).toEqual({ MY_VAR: 'value' })
    })

    it('should handle env config with object values', () => {
      const config: DefineConfig = {
        env: {
          MY_VAR: { value: 'value', comment: 'My variable' },
        },
      }
      const result = defineKarinConfig(config)
      expect((result.env as Record<string, { value: string }>).MY_VAR.value).toBe('value')
    })

    it('should handle components config', () => {
      const config: DefineConfig = {
        components: {
          config: () => [],
          save: () => ({ success: true, message: 'ok' }),
        },
      }
      const result = defineKarinConfig(config)
      expect(result.components?.config).toBeDefined()
      expect(result.components?.save).toBeDefined()
    })

    it('should handle ignoreEngines flag', () => {
      const config: DefineConfig = {
        ignoreEngines: true,
      }
      expect(defineKarinConfig(config).ignoreEngines).toBe(true)
    })

    it('should handle hooks config', () => {
      const config: DefineConfig = {
        hooks: {
          'load:before': () => { },
          'load:done': () => { },
          'add:before': () => { },
          'add:done': () => { },
          'unlink:before': () => { },
          'unlink:done': () => { },
          'change:before': () => { },
          'change:done': () => { },
        },
      }
      const result = defineKarinConfig(config)
      expect(result.hooks?.['load:before']).toBeDefined()
      expect(result.hooks?.['change:done']).toBeDefined()
    })

    it('should handle full meta config', () => {
      const config: DefineConfig = {
        meta: {
          name: 'test-plugin',
          description: 'Test plugin',
          author: { name: 'Author', home: 'https://example.com', avatar: 'https://example.com/a.png' },
          home: 'https://example.com',
        },
      }
      const result = defineKarinConfig(config)
      expect(result.meta?.home).toBe('https://example.com')
    })
  })

  describe('defineWebConfig', () => {
    it('should return the same config object', () => {
      const config: DefineConfigWeb = {
        info: {
          name: 'test-plugin',
          description: 'Test plugin',
        },
      }
      const result = defineWebConfig(config)
      expect(result).toBe(config)
    })

    it('should handle ignoreEngines flag', () => {
      const config: DefineConfigWeb = {
        info: { name: 'test', description: '' },
        ignoreEngines: true,
      }
      expect(defineWebConfig(config).ignoreEngines).toBe(true)
    })

    it('should handle components function', () => {
      const config: DefineConfigWeb = {
        info: { name: 'test', description: '' },
        components: () => [],
      }
      expect(defineWebConfig(config).components).toBeDefined()
    })

    it('should handle async components function', () => {
      const config: DefineConfigWeb = {
        info: { name: 'test', description: '' },
        components: async () => [],
      }
      expect(defineWebConfig(config).components).toBeDefined()
    })

    it('should handle save function', () => {
      const config: DefineConfigWeb = {
        info: { name: 'test', description: '' },
        save: () => ({ success: true, message: 'ok' }),
      }
      expect(defineWebConfig(config).save).toBeDefined()
    })

    it('should handle typed save function', () => {
      interface MyConfig {
        key: string
      }
      const config: DefineConfigWeb<MyConfig> = {
        info: { name: 'test', description: '' },
        save: (cfg) => ({ success: !!cfg.key, message: 'ok' }),
      }
      expect(defineWebConfig(config).save).toBeDefined()
    })

    it('should handle customComponent', () => {
      const config: DefineConfigWeb = {
        info: { name: 'test', description: '' },
        customComponent: () => ({ custom: true }),
      }
      expect(defineWebConfig(config).customComponent).toBeDefined()
    })
  })
})
