import { app } from '../app'

app.get('/', (req, res) => {
  res.send({
    code: 200,
    msg: '雪霁银妆素，桔高映琼枝。',
  })
})
