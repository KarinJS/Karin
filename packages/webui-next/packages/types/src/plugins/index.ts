/**
 * 插件类别过滤器。
 */
export type PluginCategory = 'all' | 'adapter' | 'tool' | 'fun' | 'utils';

/**
 * 插件排序字段。
 */
export type PluginSortKey = 'downloads' | 'updatedAt' | 'rating';

/**
 * 插件列表请求的查询参数。
 */
export interface PluginStoreListRequest {
  /**
   * 从一开​​始的页码。
   */
  page?: number;
  /**
   * 页面大小。
   */
  pageSize?: number;
  /**
   * 可选的关键字过滤器。
   */
  keyword?: string;
  /**
   * 插件类别过滤器。
   */
  category?: PluginCategory;
  /**
   * 排序字段。
   */
  sortBy?: PluginSortKey;
}

/**
 * 插件详情请求的查询参数。
 */
export interface PluginStoreDetailRequest {
  /**
   * NPM 包名。
   */
  packageName: string;
}

/**
 * 在市场中显示的插件功能卡片。
 */
export interface PluginFeature {
  /**
   * 功能标题。
   */
  title: string;
  /**
   * 功能描述。
   */
  description: string;
  /**
   * UI 使用的图标标记。
   */
  icon: 'flash' | 'shield' | 'box' | 'pulse';
}

/**
 * 插件列表项。
 */
export interface PluginListItem {
  /**
   * 包名。
   */
  packageName: string;
  /**
   * 人类友好的显示名称。
   */
  displayName: string;
  /**
   * 版本字符串。
   */
  version: string;
  /**
   * 作者显示名称。
   */
  author: string;
  /**
   * 作者句柄。
   */
  authorHandle: string;
  /**
   * 简短摘要。
   */
  description: string;
  /**
   * 插件类别。
   */
  category: Exclude<PluginCategory, 'all'>;
  /**
   * 下载计数。
   */
  downloads: number;
  /**
   * 星标计数。
   */
  stars: number;
  /**
   * 评分值。
   */
  rating: number;
  /**
   * 用作后备的短图标文本。
   */
  iconText: string;
  /**
   * 强调色标记。
   */
  accentColor: string;
  /**
   * 是否已安装该插件。
   */
  installed: boolean;
  /**
   * 是否为官方插件。
   */
  isOfficial: boolean;
  /**
   * 插件源仓库 URL。
   */
  githubUrl: string;
}

/**
 * 额外的插件元数据。
 */
export interface PluginMetaInfo {
  /**
   * 开源许可证。
   */
  license: string;
  /**
   * 人类友好的最后更新标签。
   */
  lastUpdateLabel: string;
  /**
   * 兼容性描述。
   */
  compatibility: string;
  /**
   * 人类友好的包大小标签。
   */
  sizeLabel: string;
}

/**
 * 插件详情负载。
 */
export interface PluginDetail {
  /**
   * 包名。
   */
  packageName: string;
  /**
   * 人类友好的显示名称。
   */
  displayName: string;
  /**
   * 版本字符串。
   */
  version: string;
  /**
   * 作者显示名称。
   */
  author: string;
  /**
   * 作者句柄。
   */
  authorHandle: string;
  /**
   * 插件是否已验证。
   */
  verified: boolean;
  /**
   * UI 显示的操作标签。
   */
  installLabel: string;
  /**
   * 源仓库 URL。
   */
  githubUrl: string;
  /**
   * 下载计数。
   */
  downloads: number;
  /**
   * 评分值。
   */
  rating: number;
  /**
   * Markdown 概览。
   */
  overviewMarkdown: string;
  /**
   * Markdown 更新日志。
   */
  changelogMarkdown: string;
  /**
   * Markdown 依赖列表。
   */
  dependenciesMarkdown: string;
  /**
   * 功能列表。
   */
  features: PluginFeature[];
  /**
   * 额外的元数据。
   */
  metaInfo: PluginMetaInfo;
  /**
   * 插件是否公开付费功能。
   */
  isProFeature: boolean;
  /**
   * 付费功能描述。
   */
  proFeatureDescription: string;
}

/**
 * 插件列表负载。
 */
export interface PluginStoreListPayload {
  /**
   * 当前页项目。
   */
  items: PluginListItem[];
  /**
   * 可用项目总数。
   */
  total: number;
  /**
   * 当前页码。
   */
  page: number;
  /**
   * 当前页面大小。
   */
  pageSize: number;
}

/**
 * 插件详情负载。
 */
export interface PluginStoreDetailPayload {
  /**
   * 插件详情对象。
   */
  detail: PluginDetail;
}