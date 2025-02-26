import { createSuccessResponse } from '@/server/utils/response'
import { router } from '../router'
import { getAllBotList } from '@/service'

router.get('/utils/get/bots', (req, res) => {
  const authKey = req.headers.authorization
  if (authKey && authKey.startsWith('Bearer ')) {
    const token = authKey.split(' ')[1]
    if (token === process.env.HTTP_AUTH_KEY) {
      const bots = getAllBotList()
      createSuccessResponse(res, bots)
    } else {
      createSuccessResponse(res, [])
    }
  }
})
