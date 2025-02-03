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

  static fromFriend (friend: { userId: string; nick: string; avatar: string }) {
    return new User(friend.userId, friend.nick, friend.avatar)
  }

  static fromGroup (group: { groupId: string; name: string; avatar: string }) {
    return new User(group.groupId, group.name, group.avatar)
  }

  async refresh () {
    // 不需要重新获取，因为已经有了完整信息
    return
  }

  setInfo (nickname: string, avatar: string, signature: string) {
    this.nickname = nickname
    this.avatar = avatar
    this.signature = signature
  }

  toString () {
    return JSON.stringify(this)
  }

  toJSON () {
    return {
      userId: this.userId,
      nickname: this.nickname,
      avatar: this.avatar,
      signature: this.signature,
      id: this.id
    }
  }
}
