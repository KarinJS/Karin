import { useEffect, useMemo, useRef, useState } from 'react';
import { Card, Avatar, AvatarImage, AvatarFallback, Chip } from '@heroui/react';
import { gsap } from 'gsap';
import type { AdapterInfo } from '@karinjs/types';

/**
 * 适配器与 Bot 面板属性
 */
interface DashboardAdapterBotPanelProps {
  /** 适配器列表 */
  adapters: AdapterInfo[];
}

type DashboardPanelView = 'adapters' | 'bots';

/**
 * 计算视图切换按钮样式
 * @param activeView 当前激活视图
 * @param view 目标视图
 * @returns 按钮类名
 */
const getViewButtonClassName = (activeView: DashboardPanelView, view: DashboardPanelView): string => {
  if (activeView === view) {
    return 'rounded-xl border border-accent bg-accent-soft px-3 py-2 text-left transition-colors';
  }
  return 'rounded-xl border border-default-200 bg-surface-secondary px-3 py-2 text-left transition-colors hover:border-default-300';
};

const DashboardAdapterBotPanel = ({ adapters }: DashboardAdapterBotPanelProps) => {
  const [activeView, setActiveView] = useState<DashboardPanelView>('adapters');
  const adaptersViewRef = useRef<HTMLDivElement>(null);
  const botsViewRef = useRef<HTMLDivElement>(null);

  const allBots = useMemo(() => {
    return adapters.flatMap((adapter) => adapter.bots || []);
  }, [adapters]);

  const adapterNameMap = useMemo(() => {
    const map = new Map<string, string>();
    adapters.forEach((adapter) => {
      map.set(adapter.id, adapter.name);
    });
    return map;
  }, [adapters]);

  useEffect(() => {
    if (!adaptersViewRef.current || !botsViewRef.current) return;
    if (activeView === 'adapters') {
      gsap.to(adaptersViewRef.current, { autoAlpha: 1, x: 0, duration: 0.28, ease: 'power2.out', pointerEvents: 'auto' });
      gsap.to(botsViewRef.current, { autoAlpha: 0, x: 20, duration: 0.24, ease: 'power2.out', pointerEvents: 'none' });
      return;
    }
    gsap.to(adaptersViewRef.current, { autoAlpha: 0, x: -20, duration: 0.24, ease: 'power2.out', pointerEvents: 'none' });
    gsap.to(botsViewRef.current, { autoAlpha: 1, x: 0, duration: 0.28, ease: 'power2.out', pointerEvents: 'auto' });
  }, [activeView]);

  return (
    <Card className="h-130 bg-surface border-none shadow-sm rounded-2xl flex flex-col overflow-hidden">
      <Card.Header className="p-5 flex flex-col gap-4 border-b border-default-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-foreground m-0">适配器与 Bot</h3>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            className={getViewButtonClassName(activeView, 'adapters')}
            onClick={() => setActiveView('adapters')}
          >
            <span className={`text-[11px] font-medium ${activeView === 'adapters' ? 'text-accent' : 'text-default-500'}`}>已加载适配器</span>
            <p className={`text-lg font-bold mt-1 ${activeView === 'adapters' ? 'text-accent' : 'text-foreground'}`}>{adapters.length}</p>
          </button>
          <button
            className={getViewButtonClassName(activeView, 'bots')}
            onClick={() => setActiveView('bots')}
          >
            <span className={`text-[11px] font-semibold ${activeView === 'bots' ? 'text-accent' : 'text-default-500'}`}>已加载 Bot</span>
            <p className={`text-2xl font-black mt-0.5 leading-none ${activeView === 'bots' ? 'text-accent' : 'text-foreground'}`}>{allBots.length}</p>
          </button>
        </div>
      </Card.Header>
      <Card.Content className="flex-1 p-4 min-h-0">
        <div className="relative w-full h-full overflow-hidden">
          <div ref={adaptersViewRef} className="absolute inset-0 overflow-y-auto flex flex-col gap-2.5">
            {adapters.map((adapter) => (
              <div key={adapter.id} className="flex items-start gap-3 p-3 rounded-xl bg-surface-secondary border border-default-200">
                <Avatar size="sm">
                  <AvatarImage src={adapter.bots?.[0]?.avatarUrl} />
                  <AvatarFallback>{adapter.bots?.[0]?.avatarFallback || adapter.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-bold text-foreground truncate">{adapter.name}</span>
                    <Chip size="sm" color={adapter.status === 'connected' ? 'success' : 'danger'} variant="soft">
                      {adapter.status === 'connected' ? '已连接' : '异常'}
                    </Chip>
                  </div>
                  <p className="text-xs text-default-500 mt-1">已连接 {adapter.bots?.length || 0} 个 Bot</p>
                </div>
              </div>
            ))}
          </div>
          <div ref={botsViewRef} className="absolute inset-0 overflow-y-auto flex flex-col gap-2.5 opacity-0 pointer-events-none">
            {allBots.map((bot) => (
              <div key={bot.id} className="flex items-start gap-3 p-3 rounded-xl bg-surface-secondary border border-default-200">
                <Avatar size="sm">
                  <AvatarImage src={bot.avatarUrl} />
                  <AvatarFallback>{bot.avatarFallback}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-bold text-foreground truncate">{bot.name}</span>
                    <Chip size="sm" color="accent" variant="soft">
                      {adapterNameMap.get(bot.adapterId) || '未分组'}
                    </Chip>
                  </div>
                  <p className="text-xs text-default-500 mt-1 truncate">self_id: {bot.selfId}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card.Content>
    </Card>
  );
};

export default DashboardAdapterBotPanel;
