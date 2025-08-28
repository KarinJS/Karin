import { importGlob as glob } from './index'

const [result] = await glob('2.ts')

Object.values(result).forEach(async (value) => {
  const t = await value()
  console.log(t)
})
