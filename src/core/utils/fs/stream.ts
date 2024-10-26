import type { Readable } from 'stream'

/**
 * 将数据流对象转换为Buffer对象
 * @param stream - 要转换的数据流对象
 * @returns 返回Buffer对象
 */
export const stream = (stream: Readable) => new Promise<Buffer>((resolve, reject) => {
  const chunks: Buffer[] = []
  stream.on('data', chunk => chunks.push(chunk))
  stream.on('end', () => resolve(Buffer.concat(chunks)))
  stream.on('error', error => reject(error))
})
