process.title = 'karin'
process.env.karin_app_mode = process.argv[2]?.includes('dev') ? 'dev' : 'prod'
process.env.karin_app_lang = JSON.stringify(process.execArgv).includes('tsx@') ? 'ts' : 'js'
