// import { getUserInfo } from '@renderer/api/request'
import { UserInfo } from '@/types/onebot'

export class User implements UserInfo {
  public user_id: number
  public nickname: string
  public avatar: string
  public signature: string
  public id: number

  constructor(id: number) {
    this.user_id = id
    this.id = id
    this.nickname = 'Karin'
    this.avatar = '/web/karin.png'
    this.signature = '欢迎使用Karin'
  }

  async refresh() {
    // const user_info = await getUserInfo(this.user_id)
    // this.nickname = user_info.nickname
    // this.avatar = user_info.avatar
    // this.signature = user_info.signature
  }

  setInfo(nickname: string, avatar: string, signature: string) {
    this.nickname = nickname
    this.avatar = avatar
    this.signature = signature
  }

  toString() {
    return JSON.stringify(this)
  }

  toJSON(): UserInfo {
    return this
  }
}
