import { useEffect, useState } from 'react';
import { Card, Spinner } from '@heroui/react';

/**
 * 一言数据结构
 */
interface QuoteInfo {
  /** 语句内容 */
  content: string;
  /** 作者 */
  author: string;
}

/**
 * 一言卡片属性
 */
interface DashboardQuoteCardProps {
  /** 重载标识 */
  reloadKey?: number;
}

const fallbackQuotes: QuoteInfo[] = [
  { content: '代码会说真话，日志会给答案。', author: 'Karin WebUI' },
  { content: '稳定运行不是偶然，是对细节的持续敬畏。', author: 'Karin WebUI' },
  { content: '当系统可观测时，问题就已经解决了一半。', author: 'Karin WebUI' }
];

const pickFallbackQuote = (): QuoteInfo => {
  const randomIndex = Math.floor(Math.random() * fallbackQuotes.length);
  return fallbackQuotes[randomIndex];
};

const DashboardQuoteCard = ({ reloadKey = 0 }: DashboardQuoteCardProps) => {
  const [quote, setQuote] = useState<QuoteInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    const loadQuote = async () => {
      try {
        const hitokotoRes = await fetch('https://v1.hitokoto.cn/?encode=json&c=a&c=b&c=d&c=i&c=k');
        if (hitokotoRes.ok) {
          const hitokotoData = await hitokotoRes.json();
          const author = String(hitokotoData.from_who || hitokotoData.from || '匿名');
          setQuote({
            content: String(hitokotoData.hitokoto || ''),
            author
          });
          return;
        }
      } catch (error) {
      }

      try {
        const jinrishiciRes = await fetch('https://v1.jinrishici.com/all.json');
        if (jinrishiciRes.ok) {
          const jinrishiciData = await jinrishiciRes.json();
          const author = String(jinrishiciData.author || '佚名');
          setQuote({
            content: String(jinrishiciData.content || ''),
            author
          });
          return;
        }
      } catch (error) {
      }

      setQuote(pickFallbackQuote());
    };

    loadQuote().finally(() => setLoading(false));
  }, [reloadKey]);

  return (
    <Card>
      <Card.Content className="px-6 py-5 flex flex-col gap-4 min-h-32">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Spinner size="sm" color="accent" />
          </div>
        ) : (
          <>
            <p className="text-xl leading-8 text-foreground font-medium">{quote?.content || '暂无内容'}</p>
            <p className="text-base text-default-500 text-right">—— {quote?.author || '匿名'}</p>
          </>
        )}
      </Card.Content>
    </Card>
  );
};

export default DashboardQuoteCard;
