import os from 'node:os'
import fs from 'node:fs'

/** 是否为windows */
export const isWin = os.platform() === 'win32'
/** 是否为linux */
export const isLinux = os.platform() === 'linux'
/** 是否为mac */
export const isMac = os.platform() === 'darwin'
/** 是否为docker */
export const isDocker = fs.existsSync('/.dockerenv')
/** 是否为root用户 仅linux */
export const isRoot = os.userInfo().uid === 0
