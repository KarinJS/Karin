const isDev = process.argv[2]?.includes('dev')
process.karin = {
  dev: isDev,
  version: '1.0.0',
}
