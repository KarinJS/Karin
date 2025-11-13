import axios from 'axios'

// https://bigdata.nncvt.edu.cn/ump/weChatLogin/account/accountBind/1762934997112Ewyk4KC
const url = 'https://bigdata.nncvt.edu.cn/ump/weChatLogin/account/accountBind/1762934997112Ewyk4KC'
const res = await axios.request({
  method: 'post',
  url,
  data: {
    password: '123',
    staffCode: '1',
    bindId: null,
  },
  headers: {
    'accept': '*/*',
    'accept-encoding': 'gzip, deflate, br, zstd',
    'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
    'cache-control': 'no-cache',
    'content-type': 'application/x-www-form-urlencoded',
    'origin': 'https://bigdata.nncvt.edu.cn',
    'pragma': 'no-cache',
    'referer': 'https://bigdata.nncvt.edu.cn/h5/pages/login/login',
    'sec-ch-ua': '"Chromium";v="142", "Google Chrome";v="142", "Not_A Brand";v="99"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36',
  },
})

console.log('res', res)
