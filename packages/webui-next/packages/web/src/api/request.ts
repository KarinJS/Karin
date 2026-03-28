import axios, { type AxiosInstance } from 'axios';

// Create a single axios instance
// 固定使用 /api/v2 作为基础路径
// 在开发环境中，Vite 会自动代理到 http://localhost:7777
const request = axios.create({
  baseURL: '/api/v2',
  timeout: 10000,
});

// Request interceptor
request.interceptors.request.use(
  (config) => {
    // 从 localStorage 获取 token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
request.interceptors.response.use(
  (response) => {
    // 你可以在这里处理全局响应解析
    return response.data;
  },
  (error) => {
    // 处理全局错误
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

/**
 * SSE 连接选项
 */
export interface SSEOptions<T> {
  /** 消息回调 */
  onMessage: (data: T) => void;
  /** 错误回调 */
  onError?: (error: unknown) => void;
}

/**
 * SSE 关闭函数
 */
export type SSEDisposer = () => void;

/**
 * 扩展请求客户端类型
 */
export interface RequestClient extends AxiosInstance {
  /** 创建 SSE 长连接 */
  createSSE: <T>(url: string, options: SSEOptions<T>) => SSEDisposer;
}

/**
 * 创建 SSE 长连接
 * @param url 目标地址（不包含 /api/v2）
 * @param options 连接选项
 * @returns 关闭连接函数
 */
const createSSE = <T>(url: string, options: SSEOptions<T>): SSEDisposer => {
  const controller = new AbortController();
  const token = localStorage.getItem('token');
  // 使用相对路径，Vite 代理会自动转发到后端
  const resolvedURL = `/api/v2${url.startsWith('/') ? '' : '/'}${url}`;

  (async () => {
    try {
      const response = await fetch(resolvedURL, {
        method: 'GET',
        headers: {
          Accept: 'text/event-stream',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        signal: controller.signal
      });
      if (!response.ok || !response.body) {
        throw new Error(`SSE request failed: ${response.status}`);
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split('\n\n');
        buffer = events.pop() || '';
        events.forEach((eventChunk) => {
          const dataLines = eventChunk
            .split('\n')
            .filter((line) => line.startsWith('data:'))
            .map((line) => line.replace(/^data:\s?/, ''));
          if (dataLines.length === 0) return;
          const rawData = dataLines.join('\n');
          try {
            options.onMessage(JSON.parse(rawData) as T);
          } catch (error) {
            options.onError?.(error);
          }
        });
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        options.onError?.(error);
      }
    }
  })();

  return () => controller.abort();
};

const requestClient: RequestClient = Object.assign(request, { createSSE });

export default requestClient;



