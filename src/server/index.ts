import { createExpress } from './app'

const app = createExpress()

const list = await import('./api')
for (const key in list) {
  app.get(`/${key}`, (req, res) => list[key as keyof typeof list](req, res))
}

app.listen(3000, '0.0.0.0', () => console.log('Server is running on http://localhost:3000'))

export { }
