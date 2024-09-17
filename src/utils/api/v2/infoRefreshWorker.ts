import { parentPort } from 'worker_threads'

async function refreshInfo () {
  if (parentPort) {
    parentPort.postMessage('getStaticInfo')
  } else {
    console.error('parentPort 为 null')
  }
}

// if (parentPort) {
//   parentPort.on('message', (staticInfo: unknown) => {
//     // 处理接收到的静态信息
//     console.log('接收到静态信息:', staticInfo)
//   })
// }

setInterval(refreshInfo, 5000)
refreshInfo()
