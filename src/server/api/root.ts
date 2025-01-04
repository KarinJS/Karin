import { app } from '../app'
import lodash from 'lodash'
import { rootMsg } from '@/utils/config/index'

app.get('/', (req, res) => {
  res.send({
    code: 200,
    msg: lodash.sample(rootMsg()),
  })
})
