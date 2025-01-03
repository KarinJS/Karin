/**
 * 构建好友场景的`sender`
 * @param userId 用户ID
 * @param name 用户名
 * @param sex 性别
 * @param age 年龄
 * @param uid QQ场景专属
 * @param uin QQ场景专属
 */
export const senderFriend = (userId, name = '', sex, age, uid, uin) => {
    if (!name)
        name = '';
    return {
        userId,
        nick: name,
        name,
        sex,
        age,
        uid,
        uin,
    };
};
/**
 * 构建群聊场景的`sender`
 */
export const senderGroup = (userId, role, name, sex, age, card, area, level, title, uid, uin) => {
    if (typeof userId === 'object') {
        const name = userId.name || '';
        return {
            userId: userId.userId,
            nick: name,
            name,
            role: userId.role,
            card: userId.card,
            area: userId.area,
            level: userId.level,
            title: userId.title,
            sex: userId.sex,
            age: userId.age,
            uid: userId.uid,
            uin: userId.uin,
        };
    }
    if (typeof userId === 'string') {
        return {
            userId,
            nick: name || '',
            name: name || '',
            role: role || 'unknown',
            card,
            area,
            level,
            title,
            sex,
            age,
            uid,
            uin,
        };
    }
    throw TypeError('提供的参数类型错误');
};
/**
 * 构建频道场景的`sender`
 * @param userId 用户ID
 * @param role 群成员身份
 * @param name 用户名
 * @param sex 性别
 * @param age 年龄
 */
export const senderGuild = (userId, role, name = '', sex, age) => {
    if (!name)
        name = '';
    return {
        userId,
        nick: name,
        name,
        role,
        sex,
        age,
    };
};
/**
 * 构建频道私信场景的`sender`
 */
export const senderDirect = senderFriend;
/**
 * 构建群聊临时会话场景的`sender`
 */
export const senderGroupTemp = senderFriend;
/**
 * 事件发送者构建器
 * @description 用于构建不同场景的事件发送者信息
 */
export const sender = {
    /** 好友场景 */
    friend: senderFriend,
    /** 群聊场景 */
    group: senderGroup,
    /** 频道场景 */
    guild: senderGuild,
    /** 频道私信场景 */
    direct: senderDirect,
    /** 群聊临时会话场景 */
    groupTemp: senderGroupTemp,
};
