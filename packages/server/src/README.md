# 新增路由规范

**特别提醒: 请不要手动处理返回值，请使用`packages/core/src/server/utils/response.ts`中的函数处理返回值**


1. 请在 `packages/core/src/server/router/router.ts` 文件中新增路由，并确保路由名称唯一。
2. 在对应的文件下创建路由处理函数，并导出:
   ```ts
   import type { RequestHandler } from 'express'
   import { createSuccessResponse } from '../utils/response'

   /**
    * ping路由
    */
   export const pingRouter: RequestHandler = (_req, res) => {
     createSuccessResponse(
       res,
       {
         ping: 'pong',
       },
       '成功',
     )
   }

   ```
3. 在 `packages/core/src/server/router/indx.ts` 文件中导入并注册路由
