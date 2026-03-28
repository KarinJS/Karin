import { useEffect, useMemo, useRef, useState } from 'react';
import { Card, Select, ListBox, Label, Avatar, AvatarImage, AvatarFallback } from '@heroui/react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Label as RechartsLabel,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { format } from 'date-fns';
import type { AdapterInfo, ChartDataPoint } from '@karinjs/types';

/**
 * 消息趋势组件属性
 */
interface DashboardMessageTrendProps {
  /** 全局消息收发趋势 */
  chartData: ChartDataPoint[];
  /** 适配器列表 */
  adapters: AdapterInfo[];
}

/**
 * 图表刻度属性
 */
interface TickProps {
  /** x 轴坐标 */
  x?: number;
  /** y 轴坐标 */
  y?: number;
  /** 刻度负载 */
  payload?: {
    /** 刻度值 */
    value?: string | number;
  };
}

/**
 * 消息趋势点
 */
interface MessageTrendPoint {
  /** 数据时间戳（毫秒） */
  timestamp: number;
  /** 日期标签 */
  dateLabel: string;
  /** 接收消息数 */
  inboundMessages: number;
  /** 发送消息数 */
  outboundMessages: number;
}

/**
 * 格式化图表日期标签
 * @param timestamp 时间戳（毫秒）
 * @returns 日期字符串
 */
const formatDateLabel = (timestamp: number): string => {
  return format(new Date(timestamp), 'MM-dd');
};

const CustomXAxisTick = ({ x = 0, y = 0, payload }: TickProps) => (
  <text x={x} y={y} dy={16} textAnchor="middle" className="fill-current text-default-500" fontSize={11} fontWeight={600}>
    {payload?.value}
  </text>
);

const CustomYAxisTick = ({ x = 0, y = 0, payload }: TickProps) => (
  <text x={x} y={y} dx={-12} dy={4} textAnchor="end" className="fill-current text-default-500" fontSize={11} fontWeight={600}>
    {payload?.value}
  </text>
);

const aggregateSelectedTrend = (trends: Array<ChartDataPoint[]>): MessageTrendPoint[] => {
  const trendMap = new Map<number, MessageTrendPoint>();
  trends.forEach((trend) => {
    trend.forEach((point) => {
      const current = trendMap.get(point.timestamp) || {
        timestamp: point.timestamp,
        dateLabel: formatDateLabel(point.timestamp),
        inboundMessages: 0,
        outboundMessages: 0
      };
      trendMap.set(point.timestamp, {
        timestamp: point.timestamp,
        dateLabel: formatDateLabel(point.timestamp),
        inboundMessages: current.inboundMessages + point.inboundMessages,
        outboundMessages: current.outboundMessages + point.outboundMessages
      });
    });
  });
  return Array.from(trendMap.values()).sort((left, right) => left.timestamp - right.timestamp).slice(-14);
};

const DashboardMessageTrend = ({ chartData, adapters }: DashboardMessageTrendProps) => {
  const [selectedAdapterIds, setSelectedAdapterIds] = useState<string[]>([]);
  const [selectedBotIds, setSelectedBotIds] = useState<string[]>([]);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [chartWidth, setChartWidth] = useState<number>(0);

  const filteredAdapters = useMemo<AdapterInfo[]>(() => {
    if (selectedAdapterIds.length === 0) return adapters;
    return adapters.filter((adapter) => selectedAdapterIds.includes(adapter.id));
  }, [selectedAdapterIds, adapters]);

  const availableBots = useMemo(() => {
    return filteredAdapters.flatMap((adapter) => adapter.bots || []).filter((bot): bot is NonNullable<typeof bot> => Boolean(bot));
  }, [filteredAdapters]);

  useEffect(() => {
    const availableBotIdSet = new Set(availableBots.map((bot) => bot.id));
    setSelectedBotIds((prev) => prev.filter((id) => availableBotIdSet.has(id)));
  }, [availableBots]);

  /**
   * 将图表数据转换为 UI 数据结构
   * @param points 原始趋势点
   * @returns 带格式化日期的趋势点
   */
  const mapTrendData = (points: ChartDataPoint[]): MessageTrendPoint[] => {
    return points
      .map((point) => ({
        timestamp: point.timestamp,
        dateLabel: formatDateLabel(point.timestamp),
        inboundMessages: point.inboundMessages,
        outboundMessages: point.outboundMessages
      }))
      .sort((left, right) => left.timestamp - right.timestamp)
      .slice(-14);
  };

  const trendData = useMemo<MessageTrendPoint[]>(() => {
    if (filteredAdapters.length === 0) return mapTrendData(chartData);
    const filteredBots = availableBots.filter((bot) => bot && selectedBotIds.includes(bot.id));
    if (filteredBots.length > 0) {
      return aggregateSelectedTrend(filteredBots.map((bot) => bot.trend));
    }
    if (filteredAdapters.length === adapters.length && selectedAdapterIds.length === 0) {
      return mapTrendData(chartData);
    }
    return aggregateSelectedTrend(filteredAdapters.map((adapter) => adapter.trend || []));
  }, [chartData, adapters.length, filteredAdapters, availableBots, selectedBotIds, selectedAdapterIds.length]);

  useEffect(() => {
    const target = chartContainerRef.current;
    if (!target) return;
    const updateWidth = () => {
      const nextWidth = target.clientWidth;
      setChartWidth(nextWidth);
    };
    updateWidth();
    const observer = new ResizeObserver(() => updateWidth());
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return (
    <Card className="lg:col-span-2 h-130 bg-surface border-none shadow-sm rounded-2xl overflow-hidden flex flex-col">
      <Card.Header className="px-6 pt-6 grid grid-cols-[minmax(0,1fr)_18rem] items-start gap-6">
        <div className="flex flex-col gap-1 min-w-0">
          <h3 className="text-xl font-bold text-foreground m-0">消息收发趋势</h3>
          <span className="text-sm text-default-500">默认展示最近 14 天数据</span>
        </div>
        <div className="w-72 justify-self-end shrink-0 flex flex-col gap-2.5">
          <Select
            selectionMode="multiple"
            value={selectedAdapterIds}
            onChange={(keys) => {
              const normalized = Array.isArray(keys) ? keys.map((key) => String(key)) : [];
              setSelectedAdapterIds(normalized);
            }}
            placeholder="筛选适配器"
            aria-label="筛选适配器"
          >
            <Select.Trigger className="h-9 min-h-9 bg-surface-secondary border border-border rounded-lg px-2.5">
              <Select.Value className="text-xs font-medium text-foreground">
                {({ state }) => {
                  if (state.selectedItems.length === 0) return '全部适配器';
                  return `已筛选 ${state.selectedItems.length} 个适配器`;
                }}
              </Select.Value>
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover className="bg-surface border border-border shadow-lg rounded-lg">
              <ListBox selectionMode="multiple">
                {adapters.map((adapter) => (
                  <ListBox.Item key={adapter.id} id={adapter.id} textValue={adapter.name}>
                    <div className="flex items-center gap-2 py-1">
                      <span className={`inline-block w-2 h-2 rounded-full ${adapter.status === 'connected' ? 'bg-success' : adapter.status === 'error' ? 'bg-danger' : 'bg-warning'}`}></span>
                      <div className="flex flex-col">
                        <Label className="text-xs font-semibold text-foreground">{adapter.name}</Label>
                        <span className="text-[10px] text-default-400">{adapter.status === 'connected' ? '已连接' : adapter.status === 'error' ? '错误' : '已断开'}</span>
                      </div>
                      <ListBox.ItemIndicator className="ml-auto" />
                    </div>
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
          <Select
            selectionMode="multiple"
            value={selectedBotIds}
            onChange={(keys) => {
              const normalized = Array.isArray(keys) ? keys.map((key) => String(key)) : [];
              setSelectedBotIds(normalized);
            }}
            placeholder="筛选 Bot"
            aria-label="筛选 Bot"
          >
            <Select.Trigger className="h-9 min-h-9 bg-surface-secondary border border-border rounded-lg px-2.5">
              <Select.Value className="text-xs font-medium text-foreground">
                {({ state }) => {
                  if (state.selectedItems.length === 0) return '全部 Bot';
                  return `已筛选 ${state.selectedItems.length} 个 Bot`;
                }}
              </Select.Value>
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover className="bg-surface border border-border shadow-lg rounded-lg">
              <ListBox selectionMode="multiple">
                {availableBots.map((bot) => (
                  <ListBox.Item key={bot.id} id={bot.id} textValue={bot.name}>
                    <div className="flex items-center gap-2.5 py-1">
                      <Avatar size="sm">
                        <AvatarImage src={bot.avatarUrl} />
                        <AvatarFallback>{bot.avatarFallback}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col min-w-0">
                        <Label className="text-xs font-semibold text-foreground">{bot.name}</Label>
                        <span className="text-[10px] text-default-400 truncate">self_id: {bot.selfId}</span>
                      </div>
                      <ListBox.ItemIndicator className="ml-auto" />
                    </div>
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
        </div>
      </Card.Header>
      <Card.Content className="pb-5 flex-1 min-h-0">
        <div ref={chartContainerRef} className="w-full h-full">
          {chartWidth > 0 && (
            <LineChart width={chartWidth} height={430} data={trendData} margin={{ top: 35, right: 55, left: 24, bottom: 24 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-default-200" />
              <XAxis
                dataKey="dateLabel"
                axisLine={{ stroke: 'var(--color-default-300)' }}
                tickLine={false}
                tick={<CustomXAxisTick />}
                interval={0}
                padding={{ left: 6, right: 6 }}
              >
                <RechartsLabel
                  className="fill-default-500 text-sm font-semibold"
                  value="日期"
                  position="right"
                  dx={16}
                  dy={4}
                />
              </XAxis>
              <YAxis
                axisLine={{ stroke: 'var(--color-default-300)' }}
                tickLine={false}
                tick={<CustomYAxisTick />}
                width={56}
              >
                <RechartsLabel
                  className="fill-default-500 text-sm font-semibold"
                  value="条"
                  position="top"
                  angle={0}
                  dx={-2}
                  dy={-16}
                />
              </YAxis>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '12px',
                  color: 'var(--color-foreground)'
                }}
                itemStyle={{ color: 'var(--color-foreground)' }}
              />
              <Legend
                iconType="circle"
                verticalAlign="bottom"
                wrapperStyle={{ paddingTop: '16px' }}
                formatter={(value) => <span className="text-default-500 text-xs font-medium">{value}</span>}
              />
              <Line
                name="接收消息"
                type="monotone"
                dataKey="inboundMessages"
                stroke="#006FEE"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 6, className: 'fill-primary stroke-background', strokeWidth: 2 }}
              />
              <Line
                name="发送消息"
                type="monotone"
                dataKey="outboundMessages"
                stroke="#17C964"
                strokeWidth={2.5}
                strokeDasharray="5 4"
                dot={false}
              />
            </LineChart>
          )}
        </div>
      </Card.Content>
    </Card>
  );
};

export default DashboardMessageTrend;
