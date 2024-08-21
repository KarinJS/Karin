import exec from './exec'

/**
 * 停止Bot
 */
export const stop = async () => {
  if (process.env.pm_id) {
    const pm2 = await exec('pm2 delete ' + process.env.pm_id)
    if (pm2.status === 'ok') process.exit()
    return { status: 'failed', data: pm2.error }
  }

  process.exit()
}
