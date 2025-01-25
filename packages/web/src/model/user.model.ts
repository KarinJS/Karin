export class User {
  public userId: string
  public nickname: string
  public avatar: string
  public signature: string
  public id: string

  constructor (
    userId: string,
    nickname: string = 'Karin',
    avatar: string = '/web/karin.png',
    signature: string = '欢迎使用Karin'
  ) {
    this.userId = userId
    this.id = userId
    this.nickname = nickname
    this.avatar = avatar
    this.signature = signature
  }

  async refresh () {
    // const user_info = await getUserInfo(this.user_id)
    // this.nickname = user_info.nickname
    // this.avatar = user_info.avatar
    // this.signature = user_info.signature
  }

  setInfo (nickname: string, avatar: string, signature: string) {
    this.nickname = nickname
    this.avatar = avatar
    this.signature = signature
  }

  toString () {
    return JSON.stringify(this)
  }

  toJSON (): User {
    return this
  }
}
