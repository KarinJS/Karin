import path from 'node:path'

/**
 * MIME 类型映射
 * @param filePath 文件路径
 * @returns MIME 类型
 */
const getMimeType = (filePath: string): string => {
  const ext = path.extname(filePath).toLowerCase()
  switch (ext) {
    case '.js': return 'application/javascript'
    case '.css': return 'text/css'
    case '.html': return 'text/html'
    case '.json': return 'application/json'
    case '.png': return 'image/png'
    case '.jpg': case '.jpeg': return 'image/jpeg'
    case '.gif': return 'image/gif'
    case '.bmp': return 'image/bmp'
    case '.svg': return 'image/svg+xml'
    case '.ico': return 'image/x-icon'
    case '.mp3': return 'audio/mpeg'
    case '.wav': return 'audio/wav'
    case '.mp4': return 'video/mp4'
    case '.webm': return 'video/webm'
    case '.pdf': return 'application/pdf'
    case '.doc': case '.docx': return 'application/msword'
    case '.xls': case '.xlsx': return 'application/vnd.ms-excel'
    case '.ppt': case '.pptx': return 'application/vnd.ms-powerpoint'
    case '.xml': return 'application/xml'
    case '.zip': return 'application/zip'
    case '.rar': return 'application/x-rar-compressed'
    case '.tar': return 'application/x-tar'
    case '.gz': return 'application/gzip'
    case '.txt': return 'text/plain'
    case '.csv': return 'text/csv'
    case '.ts': return 'application/typescript'
    case '.woff': return 'font/woff'
    case '.woff2': return 'font/woff2'
    case '.ttf': return 'font/ttf'
    case '.otf': return 'font/otf'
    case '.eot': return 'application/vnd.ms-fontobject'
    default: return 'application/octet-stream' // 默认二进制流
  }
}

export default getMimeType
