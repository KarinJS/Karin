import { useState, useEffect, useRef } from 'react';
import { Card, Skeleton } from '@heroui/react';
import { format } from 'date-fns';
import { 
  FiActivity,
  FiCpu,
  FiDatabase,
  FiArrowDown
} from 'react-icons/fi';
import request from '@/api/request';
import type { ApiResponse, DashboardData, DashboardRealtimeData } from '@karinjs/types';
import DashboardMessageTrend from './DashboardMessageTrend';
import DashboardQuoteCard from './DashboardQuoteCard';
import DashboardAdapterBotPanel from './DashboardAdapterBotPanel';

/**
 * Dashboard 骨架屏
 * @returns 骨架屏布局
 */
const DashboardSkeleton = () => {
  return (
    <div className="flex flex-col gap-6 max-w-350 mx-auto w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="bg-surface border-none shadow-sm rounded-2xl">
            <Card.Content className="p-6 space-y-4">
              <Skeleton className="h-3 w-20 rounded" />
              <Skeleton className="h-10 w-32 rounded-lg" />
              <Skeleton className="h-2 w-full rounded" />
            </Card.Content>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 h-130 bg-surface border-none shadow-sm rounded-2xl">
          <Card.Content className="p-6 space-y-4">
            <Skeleton className="h-4 w-36 rounded" />
            <Skeleton className="h-3 w-40 rounded" />
            <Skeleton className="h-96 w-full rounded-xl" />
          </Card.Content>
        </Card>
        <Card className="h-130 bg-surface border-none shadow-sm rounded-2xl">
          <Card.Content className="p-6 space-y-3">
            <Skeleton className="h-4 w-28 rounded" />
            <Skeleton className="h-8 w-full rounded-xl" />
            <Skeleton className="h-8 w-full rounded-xl" />
            <Skeleton className="h-8 w-full rounded-xl" />
          </Card.Content>
        </Card>
      </div>
      <Card>
        <Card.Content className="p-6 space-y-3">
          <Skeleton className="h-6 w-full rounded-lg" />
          <Skeleton className="h-6 w-4/5 rounded-lg" />
        </Card.Content>
      </Card>
    </div>
  );
};

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [realtimeData, setRealtimeData] = useState<DashboardRealtimeData | null>(null);
  const [sseEpoch, setSseEpoch] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const trendRetryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sseReconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * 拉取趋势数据
   * @returns void
   */
  const fetchTrendData = async (): Promise<void> => {
    setLoading(true);
    if (trendRetryTimerRef.current) {
      clearTimeout(trendRetryTimerRef.current);
      trendRetryTimerRef.current = null;
    }
    try {
      const response: ApiResponse<DashboardData> = await request.get('/dashboard/trend');
      if (response && response.code === 0) {
        setData(response.data);
      } else {
        trendRetryTimerRef.current = setTimeout(() => {
          fetchTrendData();
        }, 1000);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard trend data:', error);
      trendRetryTimerRef.current = setTimeout(() => {
        fetchTrendData();
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 清理 SSE 重连定时器
   * @returns void
   */
  const clearSSEReconnectTimer = (): void => {
    if (sseReconnectTimerRef.current) {
      clearTimeout(sseReconnectTimerRef.current);
      sseReconnectTimerRef.current = null;
    }
  };

  useEffect(() => {
    fetchTrendData();
    return () => {
      if (trendRetryTimerRef.current) {
        clearTimeout(trendRetryTimerRef.current);
        trendRetryTimerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const disposeSSE = request.createSSE<ApiResponse<DashboardRealtimeData>>('/dashboard/realtime-stream', {
      onMessage: (payload) => {
        if (payload.code === 0) {
          setRealtimeData(payload.data);
        }
      },
      onError: (error) => {
        console.error('Dashboard realtime stream error:', error);
        clearSSEReconnectTimer();
        sseReconnectTimerRef.current = setTimeout(() => {
          setSseEpoch((previousEpoch) => previousEpoch + 1);
        }, 1000);
      }
    });
    return () => {
      disposeSSE();
      clearSSEReconnectTimer();
    };
  }, [sseEpoch]);

  if (loading || !data) {
    return <DashboardSkeleton />;
  }

  const { chartData, adapters: initialAdapters } = data;
  const realtimeAdapters = realtimeData?.adapters || initialAdapters;
  const runtime = realtimeData?.runtime;
  const runtimeStartTimeText = runtime ? format(new Date(runtime.startTimestamp), 'yyyy-MM-dd HH:mm') : '2023-10-01 12:00';

  return (
    <div className="flex flex-col gap-6 max-w-350 mx-auto w-full">
      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Version Info */}
        <Card className="bg-surface border-none shadow-sm rounded-2xl overflow-hidden">
          <Card.Header className="px-6 pt-6 pb-2 flex-col items-start gap-1">
            <span className="text-xs font-bold text-default-500 uppercase tracking-widest">KARIN 版本</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-4xl font-bold text-foreground">{realtimeData?.version || 'v3.0.1'}</span>
            </div>
          </Card.Header>
          <Card.Content className="px-6 pb-6 pt-2">
            <div className="w-full h-2 bg-default-200 rounded-full mt-4 overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: `100%` }}></div>
            </div>
            <div className="flex items-center gap-2 mt-4 text-success text-xs font-medium">
              <FiArrowDown className="rotate-180" />
              <span>当前已是最新版本</span>
            </div>
          </Card.Content>
          <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <FiCpu size={20} />
          </div>
        </Card>

        {/* Plugin Count */}
        <Card className="bg-surface border-none shadow-sm rounded-2xl overflow-hidden">
          <Card.Header className="px-6 pt-6 pb-2 flex-col items-start gap-1">
            <span className="text-xs font-bold text-default-500 uppercase tracking-widest">插件数量</span>
            <div className="flex items-baseline gap-1 mt-1">
              {realtimeData ? (
                <span className="text-4xl font-bold text-foreground">{realtimeData.pluginCount}</span>
              ) : (
                <Skeleton className="h-10 w-16 rounded-lg" />
              )}
              <span className="text-lg text-default-500 font-medium">个</span>
            </div>
          </Card.Header>
          <Card.Content className="px-6 pb-6 pt-2 h-full flex flex-col justify-end">
             <div className="flex items-end gap-1.5 h-10 mt-4">
                {[40, 60, 30, 80, 50, 70, 45, 90, 65, 85].map((h, i) => (
                  <div key={i} className="flex-1 bg-success/80 rounded-sm" style={{ height: `${h}%` }}></div>
                ))}
             </div>
          </Card.Content>
          <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-success/10 flex items-center justify-center text-success">
            <FiDatabase size={20} />
          </div>
        </Card>

        {/* Uptime */}
        <Card className="bg-surface border-none shadow-sm rounded-2xl overflow-hidden">
          <Card.Header className="px-6 pt-6 pb-2 flex-col items-start gap-1">
            <span className="text-xs font-bold text-default-500 uppercase tracking-widest">运行时间</span>
            <div className="flex items-baseline gap-1 mt-1">
              {runtime ? (
                <span className="text-4xl font-bold text-foreground">{runtime.days}</span>
              ) : (
                <Skeleton className="h-10 w-14 rounded-lg" />
              )}
              <span className="text-lg text-default-500 font-medium">天</span>
              {runtime ? (
                <span className="text-4xl font-bold text-foreground ml-1">{runtime.hours}</span>
              ) : (
                <Skeleton className="h-10 w-14 rounded-lg ml-1" />
              )}
              <span className="text-lg text-default-500 font-medium">时</span>
            </div>
          </Card.Header>
          <Card.Content className="px-6 pb-6 pt-2 flex items-end justify-between mt-4">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-default-500 font-medium">启动时间</span>
              <span className="text-sm font-bold text-foreground">{runtimeStartTimeText}</span>
            </div>
          </Card.Content>
          <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-danger/10 flex items-center justify-center text-danger">
            <FiActivity size={20} />
          </div>
        </Card>
      </div>

      {/* Middle Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Area */}
        <DashboardMessageTrend chartData={chartData} adapters={initialAdapters} />

        {/* Adapters List */}
        <DashboardAdapterBotPanel adapters={realtimeAdapters} />
      </div>
      <DashboardQuoteCard />
    </div>
  );
}
