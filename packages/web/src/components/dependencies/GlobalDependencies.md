# 全局依赖管理方案

## 概述

全局依赖管理功能将允许用户查看和管理系统中全局安装的npm包，类似于本地依赖管理，但针对全局安装的包。

## 实现方案

### 后端实现

1. 新增API接口，用于获取全局依赖列表：
   ```typescript
   // 获取全局依赖列表
   export const getGlobalDependenciesRouter: RequestHandler = async (req, res) => {
     try {
       // 使用npm命令获取全局安装的包
       const { stdout, error } = await exec('npm list -g --depth=0 --json')
       if (error) {
         return createBadRequestResponse(res, error.message)
       }
       
       // 解析结果
       const dependencies = JSON.parse(stdout)
       // 转换为前端需要的格式
       const list = formatGlobalDependencies(dependencies)
       
       return createSuccessResponse(res, list)
     } catch (error) {
       logger.error('[getGlobalDependenciesRouter]', error)
       return createServerErrorResponse(res, error instanceof Error ? error.message : String(error))
     }
   }
   ```

2. 新增API接口，用于安装/更新全局依赖：
   ```typescript
   // 安装/更新全局依赖
   export const manageGlobalDependenciesRouter: RequestHandler<null, null, GlobalDependenciesManage> = async (req, res) => {
     const { type, data } = req.body
     
     if (type === 'add' || type === 'upgrade') {
       return await installGlobalDependencies(res, data, req.ip!)
     }
     
     if (type === 'remove') {
       return await removeGlobalDependencies(res, data, req.ip!)
     }
     
     return handleReturn(res, false, '无效请求：不支持的操作类型')
   }
   ```

3. 在Windows系统上，需要考虑以下问题：
   - 可能需要管理员权限才能安装全局依赖
   - 需要确保npm全局路径正确设置
   - 可能需要处理路径带有空格的情况

### 前端实现

1. 创建新的全局依赖管理组件`GlobalDependencyModal.tsx`：
   ```tsx
   /**
    * 全局依赖管理模态框
    */
   const GlobalDependencyModal = ({ isOpen, onClose }: GlobalDependencyModalProps) => {
     // 实现类似本地依赖管理的功能
     // ...
   }
   ```

2. 实现以下功能：
   - 显示全局依赖列表
   - 安装新的全局依赖
   - 更新全局依赖
   - 卸载全局依赖

3. 界面设计：
   - 使用与本地依赖管理相似的布局
   - 增加权限提示，说明可能需要管理员权限
   - 全局依赖的版本选择和管理

## 权限考虑

全局依赖管理涉及系统级操作，在Windows系统上可能需要管理员权限。建议采用以下策略：

1. 在执行全局依赖安装/卸载前提示用户需要管理员权限
2. 提供详细的操作日志，便于用户了解执行过程
3. 对于权限不足的情况，提供清晰的错误提示和解决方案

## 兼容性考虑

1. Windows系统：
   - 可能需要使用`runas`命令提升权限
   - 处理路径中的空格和特殊字符
   - 可能需要处理防火墙或安全软件拦截的情况

2. 其他系统：
   - Linux/MacOS可能需要使用`sudo`
   - 需要考虑不同用户目录结构的差异

## 后续优化

1. 增加对nvm等Node.js版本管理工具的支持，可以显示和管理不同Node.js版本下的全局依赖
2. 增加全局依赖的使用分析，显示哪些全局依赖使用频率较高
3. 提供全局依赖的清理建议，帮助用户移除不常用或过时的全局依赖 