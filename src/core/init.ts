if (process.argv[2]?.includes('dev')) {
  process.env.karinMode = 'dev'
} else {
  process.env.karinMode = 'prod'
}
