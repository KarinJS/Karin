/**
 * core/utils/env.ts 单元测试
 * @description 插件环境变量管理器测试
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { pluginEnv } from '../src/core/utils/env'
import { envManager } from '../src/store'

describe('core/utils/pluginEnv', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    envManager.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    envManager.clear()
  })

  describe('create', () => {
    it('应该调用 envManager.create', () => {
      const spy = vi.spyOn(envManager, 'create')
      const envs = {
        API_KEY: 'test-key',
      }

      pluginEnv.create('my-plugin', envs)

      expect(spy).toHaveBeenCalledWith('my-plugin', envs)
    })

    it('应该支持带注释的环境变量', () => {
      const spy = vi.spyOn(envManager, 'create')
      const envs = {
        DEBUG: { value: 'true', comment: '调试模式' },
      }

      pluginEnv.create('my-plugin', envs)

      expect(spy).toHaveBeenCalledWith('my-plugin', envs)
    })

    it('应该支持混合格式的环境变量', () => {
      const spy = vi.spyOn(envManager, 'create')
      const envs = {
        SIMPLE_KEY: 'simple-value',
        COMPLEX_KEY: { value: 'complex-value', comment: '复杂配置' },
      }

      pluginEnv.create('my-plugin', envs)

      expect(spy).toHaveBeenCalledWith('my-plugin', envs)
    })

    it('应该支持空的环境变量对象', () => {
      const spy = vi.spyOn(envManager, 'create')

      pluginEnv.create('my-plugin', {})

      expect(spy).toHaveBeenCalledWith('my-plugin', {})
    })

    it('应该支持 undefined 的环境变量', () => {
      const spy = vi.spyOn(envManager, 'create')

      pluginEnv.create('my-plugin', undefined)

      expect(spy).toHaveBeenCalledWith('my-plugin', undefined)
    })

    it('create 应该返回 undefined', () => {
      const result = pluginEnv.create('my-plugin', { KEY: 'value' })
      expect(result).toBeUndefined()
    })
  })

  describe('pluginEnv 对象结构', () => {
    it('应该有 create 方法', () => {
      expect(typeof pluginEnv.create).toBe('function')
    })

    it('应该只有一个属性', () => {
      expect(Object.keys(pluginEnv)).toEqual(['create'])
    })
  })

  describe('实际 envManager 交互', () => {
    it('应该实际创建环境变量', () => {
      pluginEnv.create('test-plugin', { MY_VAR: 'my-value' })

      const all = envManager.getAll()
      expect(all['test-plugin']).toBeDefined()
      // envManager 存储为 { value, comment } 格式
      expect(all['test-plugin']['MY_VAR']).toEqual({ value: 'my-value', comment: '' })
    })

    it('应该正确处理多个插件的环境变量', () => {
      pluginEnv.create('plugin-a', { KEY_A: 'value-a' })
      pluginEnv.create('plugin-b', { KEY_B: 'value-b' })

      const all = envManager.getAll()
      // envManager 存储为 { value, comment } 格式
      expect(all['plugin-a']['KEY_A']).toEqual({ value: 'value-a', comment: '' })
      expect(all['plugin-b']['KEY_B']).toEqual({ value: 'value-b', comment: '' })
    })
  })
})
