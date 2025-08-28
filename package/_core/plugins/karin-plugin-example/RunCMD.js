import karin from "node-karin"
import { exec } from 'child_process'
const GBK = new TextDecoder("GBK", { fatal: false })

const regCMD = /^(#|\/)cmd\s(.*)$/

export const runcmd = karin.command(regCMD, async (e) => {
    if(!e.isMaster) return e.reply('你无权这样做!', { recallMsg: 30, reply: true })

    const content = e.msg.match(regCMD)[2].trim()

    return exec(content, { encoding: 'buffer' }, (error, stdout, stderr) => {
        if (error) {
            let errorOutput = []
            stderr.length > 0 && errorOutput.push(GBK.decode(stderr))
            stdout.length > 0 && errorOutput.push(GBK.decode(stdout))
            
            return e.reply(
                errorOutput.join('\n') || error.message,
                { reply: true }
            )
        }
        const output = [
            GBK.decode(stdout),
            GBK.decode(stderr)
        ].filter(Boolean).join('\n')
        
        return e.reply(output || '命令执行成功', { reply: true })
    })
})
