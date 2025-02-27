import { createSuccessResponse } from '@/server/utils/response'
import { router } from '../router'
import { getAllBotList } from '@/service'

router.get('/utils/get/bots', (req, res) => {
  createSuccessResponse(res, getAllBotList())
})
