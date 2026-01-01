/**
 * store/envs.ts 测试
 * @module tests/store-envs.test
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { envManager } from '../src/store/envs'

describe('store/envs', () => {
  const testEnvKeys: string[] = []

  beforeEach(() => {
    envManager.clear()
  })

  afterEach(() => {
    // 清理测试中注入的环境变量
    testEnvKeys.forEach(key => {
      delete process.env[key]
    })
    testEnvKeys.length = 0
  })

  describe('create', () => {
    it('should create env for package with string values', () => {
      testEnvKeys.push('TEST_KEY_1')

      envManager.create('test-plugin', {
        TEST_KEY_1: 'value1',
      })

      const env = envManager.get('test-plugin')
      expect(env).not.toBeNull()
      expect(env?.TEST_KEY_1).toBeDefined()
      expect(env?.TEST_KEY_1.value).toBe('value1')
    })

    it('should create env with comment', () => {
      testEnvKeys.push('TEST_KEY_2')

      envManager.create('test-plugin', {
        TEST_KEY_2: { value: 'value2', comment: 'Test comment' },
      })

      const env = envManager.get('test-plugin')
      expect(env?.TEST_KEY_2.comment).toBe('Test comment')
    })

    it('should inject env into process.env', () => {
      testEnvKeys.push('TEST_INJECT')

      envManager.create('test-plugin', {
        TEST_INJECT: 'injected',
      })

      expect(process.env.TEST_INJECT).toBe('injected')
    })

    it('should not override existing env', () => {
      testEnvKeys.push('TEST_EXISTING')
      process.env.TEST_EXISTING = 'original'

      envManager.create('test-plugin', {
        TEST_EXISTING: 'new',
      })

      expect(process.env.TEST_EXISTING).toBe('original')
    })

    it('should handle empty config', () => {
      envManager.create('empty-plugin')

      const env = envManager.get('empty-plugin')
      // 没有传入 env 参数时，不会创建记录
      expect(env).toBeNull()
    })
  })

  describe('get', () => {
    it('should return null for non-existent package', () => {
      const env = envManager.get('non-existent')
      expect(env).toBeNull()
    })

    it('should return env for existing package', () => {
      testEnvKeys.push('GET_TEST')

      envManager.create('get-test', { GET_TEST: 'value' })

      const env = envManager.get('get-test')
      expect(env).not.toBeNull()
    })
  })

  describe('getAll', () => {
    it('should return all package envs', () => {
      testEnvKeys.push('ALL_TEST_1', 'ALL_TEST_2')

      envManager.create('pkg1', { ALL_TEST_1: 'v1' })
      envManager.create('pkg2', { ALL_TEST_2: 'v2' })

      const all = envManager.getAll()
      expect(Object.keys(all)).toHaveLength(2)
      expect(all.pkg1).toBeDefined()
      expect(all.pkg2).toBeDefined()
    })
  })

  describe('remove', () => {
    it('should remove package env record', () => {
      testEnvKeys.push('REMOVE_TEST')

      envManager.create('to-remove', { REMOVE_TEST: 'value' })
      const removed = envManager.remove('to-remove')

      expect(removed).toBe(true)
      expect(envManager.get('to-remove')).toBeNull()
    })

    it('should return false for non-existent package', () => {
      const removed = envManager.remove('non-existent')
      expect(removed).toBe(false)
    })
  })

  describe('clear', () => {
    it('should clear all env records', () => {
      testEnvKeys.push('CLEAR_1', 'CLEAR_2')

      envManager.create('pkg1', { CLEAR_1: 'v1' })
      envManager.create('pkg2', { CLEAR_2: 'v2' })

      envManager.clear()

      expect(envManager.get('pkg1')).toBeNull()
      expect(envManager.get('pkg2')).toBeNull()
    })
  })

  describe('stats', () => {
    it('should return correct statistics', () => {
      testEnvKeys.push('STATS_1', 'STATS_2', 'STATS_3')

      envManager.create('pkg1', { STATS_1: 'v1', STATS_2: 'v2' })
      envManager.create('pkg2', { STATS_3: 'v3' })

      const stats = envManager.stats()
      expect(stats.packages).toBe(2)
      expect(stats.variables).toBe(3)
    })
  })
})
