import { app } from '../app'
import { createSuccessResponse } from '../utils/response'

app.get('/', (_req, res) => {
  createSuccessResponse(res, null, '雪霁银妆素，桔高映琼枝。')
})
