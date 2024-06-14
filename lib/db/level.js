import { Level } from 'level'

const path = process.cwd() + '/data/db/Level'

/**
 * @type {Level}
 */
const level = new Level(path, { valueEncoding: 'json' })
export default level
