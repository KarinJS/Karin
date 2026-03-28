import { ApiPath } from './common';

const schemaRef = (name: string): string => `#/components/schemas/${name}`;

/**
 * OpenAPI 基础元数据。
 */
export const openApiMeta = {
  openapi: '3.1.0',
  info: {
    title: 'Karin WebUI API',
    version: '1.0.0',
    description: '从 @karinjs/types 生成的 OpenAPI 文档。'
  },
  servers: [
    {
      url: 'http://localhost:7777',
      description: '本地 Karin 后端'
    }
  ],
  tags: [{ name: 'auth' }, { name: 'dashboard' }, { name: 'layout' }, { name: 'files' }, { name: 'plugins' }]
} as const;

/**
 * OpenAPI 路径元数据。
 *
 * 组件 schema 由生成器脚本注入。
 */
export const openApiPaths = {
  [ApiPath.Login]: {
    post: {
      tags: ['auth'],
      summary: '使用 HTTP 认证密钥登录',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: schemaRef('LoginRequest') }
          }
        }
      },
      responses: {
        '200': {
          description: '登录成功',
          content: {
            'application/json': {
              schema: { $ref: schemaRef('ApiResponse_LoginResponse') }
            }
          }
        }
      }
    }
  },
  [ApiPath.RefreshToken]: {
    post: {
      tags: ['auth'],
      summary: '刷新访问令牌',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: schemaRef('RefreshTokenRequest') }
          }
        }
      },
      responses: {
        '200': {
          description: '令牌已刷新',
          content: {
            'application/json': {
              schema: { $ref: schemaRef('ApiResponse_RefreshTokenResponse') }
            }
          }
        }
      }
    }
  },
  [ApiPath.DashboardTrend]: {
    get: {
      tags: ['dashboard'],
      summary: '获取仪表盘趋势数据',
      responses: {
        '200': {
          description: '仪表盘趋势负载',
          content: {
            'application/json': {
              schema: { $ref: schemaRef('ApiResponse_DashboardData') }
            }
          }
        }
      }
    }
  },
  [ApiPath.DashboardRealtimeStream]: {
    get: {
      tags: ['dashboard'],
      summary: '订阅仪表盘实时更新',
      description: '此端点使用 Server-Sent Events (SSE)。',
      responses: {
        '200': {
          description: 'SSE 流',
          content: {
            'text/event-stream': {
              schema: { $ref: schemaRef('ApiResponse_DashboardRealtimeData') }
            }
          }
        }
      }
    }
  },
  [ApiPath.LogsStream]: {
    get: {
      tags: ['layout'],
      summary: '订阅终端日志',
      description: '此端点使用 Server-Sent Events (SSE)。',
      responses: {
        '200': {
          description: 'SSE 流',
          content: {
            'text/event-stream': {
              schema: { $ref: schemaRef('TerminalLog') }
            }
          }
        }
      }
    }
  },
  [ApiPath.HealthWebSocket]: {
    get: {
      tags: ['layout'],
      summary: '后端健康状态 websocket',
      description: '此端点升级为 WebSocket 连接。',
      responses: {
        '101': {
          description: 'WebSocket 升级成功'
        }
      },
      'x-websocket-message-schema': {
        $ref: schemaRef('BackendHealthMessage')
      }
    }
  },
  [ApiPath.FilesList]: {
    get: {
      tags: ['files'],
      summary: '列出目录项',
      parameters: [
        {
          name: 'directory',
          in: 'query',
          required: false,
          schema: { type: 'string' }
        }
      ],
      responses: {
        '200': {
          description: '目录列表',
          content: {
            'application/json': {
              schema: { $ref: schemaRef('ApiResponse_FileListPayload') }
            }
          }
        }
      }
    }
  },
  [ApiPath.FilesContent]: {
    get: {
      tags: ['files'],
      summary: '读取文件内容',
      parameters: [
        {
          name: 'path',
          in: 'query',
          required: true,
          schema: { type: 'string' }
        },
        {
          name: 'raw',
          in: 'query',
          required: false,
          schema: { type: 'boolean' }
        }
      ],
      responses: {
        '200': {
          description: '文件内容',
          content: {
            'application/json': {
              schema: { $ref: schemaRef('ApiResponse_FileContentPayload') }
            }
          }
        }
      }
    }
  },
  [ApiPath.FilesDelete]: {
    post: {
      tags: ['files'],
      summary: '删除单个路径',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: schemaRef('FileDeleteRequest') }
          }
        }
      },
      responses: {
        '200': {
          description: '删除结果',
          content: {
            'application/json': {
              schema: { $ref: schemaRef('ApiResponse_FileDeletePayload') }
            }
          }
        }
      }
    }
  },
  [ApiPath.FilesSave]: {
    post: {
      tags: ['files'],
      summary: '保存文件内容',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: schemaRef('FileSaveRequest') }
          }
        }
      },
      responses: {
        '200': {
          description: '保存结果',
          content: {
            'application/json': {
              schema: { $ref: schemaRef('ApiResponse_FileSavePayload') }
            }
          }
        }
      }
    }
  },
  [ApiPath.FilesSelectionSize]: {
    post: {
      tags: ['files'],
      summary: '计算多个路径的总大小',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: schemaRef('SelectionSizeRequest') }
          }
        }
      },
      responses: {
        '200': {
          description: '选择大小结果',
          content: {
            'application/json': {
              schema: { $ref: schemaRef('ApiResponse_SelectionSizePayload') }
            }
          }
        }
      }
    }
  },
  [ApiPath.FilesDeleteSelection]: {
    post: {
      tags: ['files'],
      summary: '删除多个路径',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: schemaRef('FileBatchDeleteRequest') }
          }
        }
      },
      responses: {
        '200': {
          description: '批量删除结果',
          content: {
            'application/json': {
              schema: { $ref: schemaRef('ApiResponse_FileBatchDeletePayload') }
            }
          }
        }
      }
    }
  },
  [ApiPath.FilesRename]: {
    post: {
      tags: ['files'],
      summary: '重命名路径',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: schemaRef('FileRenameRequest') }
          }
        }
      },
      responses: {
        '200': {
          description: '重命名结果',
          content: {
            'application/json': {
              schema: { $ref: schemaRef('ApiResponse_FileRenamePayload') }
            }
          }
        }
      }
    }
  },
  [ApiPath.FilesCopy]: {
    post: {
      tags: ['files'],
      summary: '将路径复制到剪贴板缓冲区',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: schemaRef('FileCopyRequest') }
          }
        }
      },
      responses: {
        '200': {
          description: '复制结果',
          content: {
            'application/json': {
              schema: { $ref: schemaRef('ApiResponse_FileCopyPayload') }
            }
          }
        }
      }
    }
  },
  [ApiPath.FilesPaste]: {
    post: {
      tags: ['files'],
      summary: '将路径粘贴到目标目录',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: schemaRef('FilePasteRequest') }
          }
        }
      },
      responses: {
        '200': {
          description: '粘贴结果',
          content: {
            'application/json': {
              schema: { $ref: schemaRef('ApiResponse_FilePastePayload') }
            }
          }
        }
      }
    }
  },
  [ApiPath.FilesDirectorySize]: {
    get: {
      tags: ['files'],
      summary: '计算目录大小',
      parameters: [
        {
          name: 'path',
          in: 'query',
          required: true,
          schema: { type: 'string' }
        }
      ],
      responses: {
        '200': {
          description: '目录大小结果',
          content: {
            'application/json': {
              schema: { $ref: schemaRef('ApiResponse_DirectorySizePayload') }
            }
          }
        }
      }
    }
  },
  [ApiPath.PluginStoreList]: {
    get: {
      tags: ['plugins'],
      summary: '获取插件市场列表',
      parameters: [
        {
          name: 'page',
          in: 'query',
          required: false,
          schema: { type: 'integer', format: 'int32' }
        },
        {
          name: 'pageSize',
          in: 'query',
          required: false,
          schema: { type: 'integer', format: 'int32' }
        },
        {
          name: 'keyword',
          in: 'query',
          required: false,
          schema: { type: 'string' }
        },
        {
          name: 'category',
          in: 'query',
          required: false,
          schema: { $ref: schemaRef('PluginCategory') }
        },
        {
          name: 'sortBy',
          in: 'query',
          required: false,
          schema: { $ref: schemaRef('PluginSortKey') }
        }
      ],
      responses: {
        '200': {
          description: '插件列表结果',
          content: {
            'application/json': {
              schema: { $ref: schemaRef('ApiResponse_PluginStoreListPayload') }
            }
          }
        }
      }
    }
  },
  [ApiPath.PluginStoreDetail]: {
    get: {
      tags: ['plugins'],
      summary: '获取插件市场详情',
      parameters: [
        {
          name: 'packageName',
          in: 'query',
          required: true,
          schema: { type: 'string' }
        }
      ],
      responses: {
        '200': {
          description: '插件详情结果',
          content: {
            'application/json': {
              schema: { $ref: schemaRef('ApiResponse_PluginStoreDetailPayload') }
            }
          }
        }
      }
    }
  }
} as const;