import Version from '../utils/updateVersion.js'

const path = process.cwd()
const version = new Version(path)
await version.init()
