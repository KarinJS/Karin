/**
 * 仪表盘摘要指标。
 */
export interface DashboardMetrics {
  /**
   * 当前 CPU 负载百分比。
   */
  cpuLoad: number;
  /**
   * 与上一周期相比的 CPU 负载变化。
   */
  cpuLoadChange: number;
  /**
   * 当前内存使用量，单位为 GB。
   */
  memoryUsage: number;
  /**
   * 总内存容量，单位为 GB。
   */
  memoryTotal: number;
  /**
   * 历史内存使用百分比。
   */
  memoryHistory: number[];
  /**
   * 总处理包数。
   */
  totalPackets: number;
  /**
   * 总入站包数。
   */
  inboundPackets: number;
  /**
   * 总出站包数。
   */
  outboundPackets: number;
}

/**
 * 图表使用的趋势点。
 */
export interface ChartDataPoint {
  /**
   * Unix 时间戳，单位为毫秒。
   */
  timestamp: number;
  /**
   * 入站消息数。
   */
  inboundMessages: number;
  /**
   * 出站消息数。
   */
  outboundMessages: number;
}

/**
 * 仪表盘中显示的机器人信息。
 */
export interface BotInfo {
  /**
   * 机器人标识符。
   */
  id: string;
  /**
   * 机器人显示名称。
   */
  name: string;
  /**
   * 机器人在适配器平台上的自身标识符。
   */
  selfId: string;
  /**
   * 拥有此机器人的适配器标识符。
   */
  adapterId: string;
  /**
   * 机器人头像 URL。
   */
  avatarUrl: string;
  /**
   * 后备头像文本。
   */
  avatarFallback: string;
  /**
   * 总入站消息数。
   */
  inboundMessages: number;
  /**
   * 总出站消息数。
   */
  outboundMessages: number;
  /**
   * 每日消息趋势。
   */
  trend: ChartDataPoint[];
}

/**
 * 支持的适配器连接状态。
 */
export type AdapterStatus = 'connected' | 'disconnected' | 'error';

/**
 * 仪表盘中显示的适配器信息。
 */
export interface AdapterInfo {
  /**
   * 适配器标识符。
   */
  id: string;
  /**
   * 适配器显示名称。
   */
  name: string;
  /**
   * 当前适配器状态。
   */
  status: AdapterStatus;
  /**
   * 可选的适配器延迟，单位为毫秒。
   */
  latency?: number;
  /**
   * 总入站消息数。
   */
  inboundMessages: number;
  /**
   * 总出站消息数。
   */
  outboundMessages: number;
  /**
   * 聚合的适配器趋势。
   */
  trend: ChartDataPoint[];
  /**
   * 附加到适配器的机器人。
   */
  bots: BotInfo[];
}

/**
 * 通过 HTTP 获取的初始仪表盘负载。
 */
export interface DashboardData {
  /**
   * 顶部摘要指标。
   */
  metrics: DashboardMetrics;
  /**
   * 全局图表趋势数据。
   */
  chartData: ChartDataPoint[];
  /**
   * 适配器列表快照。
   */
  adapters: AdapterInfo[];
}

/**
 * 运行时长信息。
 */
export interface DashboardRuntimeInfo {
  /**
   * 后端启动时间戳，单位为毫秒。
   */
  startTimestamp: number;
  /**
   * 运行天数。
   */
  days: number;
  /**
   * 不足一整天的剩余运行小时数。
   */
  hours: number;
}

/**
 * 通过 SSE 推送的实时仪表盘负载。
 */
export interface DashboardRealtimeData {
  /**
   * 后端版本字符串。
   */
  version: string;
  /**
   * 已安装的插件数量。
   */
  pluginCount: number;
  /**
   * 实时摘要指标。
   */
  metrics: DashboardMetrics;
  /**
   * 运行信息。
   */
  runtime: DashboardRuntimeInfo;
  /**
   * 实时适配器列表。
   */
  adapters: AdapterInfo[];
}
