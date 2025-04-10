import { api, request, getErrorMessage } from '@/request/base'

import type { Dependency } from 'node-karin'
import type { BaseResponse } from '@/request/base'

/**
 * 获取依赖列表
 * @param isForceRefresh - 是否强制刷新
 * @timeout 2分钟超时
 */
export const getDependencies = async (
  isForceRefresh = false
): Promise<BaseResponse<Dependency[]>> => {
  try {
    const data = { force: isForceRefresh }
    const result = await request.serverPost<Dependency[], { force: boolean }>(
      api.getDependencies,
      data
    )

    return { success: true, data: result }
  } catch (error) {
    return { success: false, data: error, message: getErrorMessage(error) }
  }
}

const test = {
  type: 'selected',
  data: [
    {
      name: 'node-karin',
      version: '1.7.14',
    },
    {
      name: '@types/express',
      version: '5.0.1',
    },
    {
      name: '@types/lodash',
      version: '4.17.16',
    },
    {
      name: '@types/node-schedule',
      version: '2.1.7',
    },
    {
      name: '@types/ws',
      version: '8.18.1',
    },
    {
      name: 'art-template',
      version: 'npm:@karinjs/art-template@1.0.0',
    },
    {
      name: 'axios',
      version: '0.30.0',
    },
    {
      name: 'chalk',
      version: '5.4.1',
    },
    {
      name: 'chokidar',
      version: '4.0.3',
    },
    {
      name: 'commander',
      version: '13.1.0',
    },
    {
      name: 'dotenv',
      version: '16.4.7',
    },
    {
      name: 'express',
      version: '5.1.0',
    },
    {
      name: 'jsonwebtoken',
      version: '9.0.2',
    },
    {
      name: 'lodash',
      version: '4.17.21',
    },
    {
      name: 'log4js',
      version: '6.9.1',
    },
    {
      name: 'moment',
      version: '2.30.1',
    },
    {
      name: 'node-schedule',
      version: '2.1.1',
    },
    {
      name: 'redis',
      version: '5.0.0-next.7',
    },
    {
      name: 'sqlite3',
      version: '5.1.7',
    },
    {
      name: 'ws',
      version: '8.18.1',
    },
    {
      name: 'yaml',
      version: '2.7.1',
    },
    {
      name: '@karinjs/node-pty',
      version: '1.0.4',
    },
    {
      name: '@karinjs/plugin-webui-network-monitor',
      version: '1.0.3',
    },
    {
      name: '@karinjs/plugins-list',
      version: '1.5.0',
    },
    {
      name: '@types/jsonwebtoken',
      version: '9.0.9',
    },
    {
      name: 'cross-env',
      version: '7.0.3',
    },
  ],
}
