import { AdapterBase } from '@/adapter/base';
import type { OB11NodeSegment, OB11Segment, Params, Request, OB11AllEvent } from '@/adapter/onebot/types';
import { Contact, GroupSender } from '@/types/event';
import { Elements, ForwardOptions, NodeElement, SendElement } from '@/types/segment';
import { GetGroupHighlightsResponse, QQGroupHonorInfo, SendMsgResults } from '@/types/adapter';
export declare abstract class AdapterOneBot extends AdapterBase {
    protected constructor();
    /**
     * 事件处理
     * @param data 事件数据对象
     * @param str 事件字符串
     */
    eventHandlers(data: OB11AllEvent, str: string): void;
    /**
     * onebot11转karin
     * @return karin格式消息
     */
    AdapterConvertKarin(data: Array<OB11Segment>): Elements[];
    /**
     * karin转onebot11
     * @param data karin格式消息
     */
    KarinConvertAdapter(data: Array<SendElement>): OB11Segment[];
    /**
     * 获取头像url
     * @param userId 头像大小，默认`0`
     * @param size 头像大小，默认`0`
     * @returns 头像的url地址
     */
    getAvatarUrl(userId?: string, size?: number): Promise<string>;
    /**
     * 获取群头像
     * @param groupId 群号
     * @param size 头像大小，默认`0`
     * @param history 历史头像记录，默认`0`，若要获取历史群头像则填写1,2,3...
     * @returns 群头像的url地址
     */
    getGroupAvatarUrl(groupId: string, size?: number, history?: number): Promise<string>;
    /**
     * 发送消息
     * @param contact
     * @param elements
     * @returns 消息ID
     */
    sendMsg(contact: Contact, elements: Array<SendElement>, retryCount?: number): Promise<SendMsgResults>;
    /**
     * 发送消息
     * @deprecated 已废弃，请使用`sendMsg`
     */
    SendMessage(contact: Contact, elements: Array<Elements>, retryCount?: number): Promise<SendMsgResults>;
    /**
     * 发送长消息
     * @param contact 目标信息
     * @param resId 资源ID
     */
    sendLongMsg(contact: Contact, resId: string): Promise<{
        messageId: string;
        messageTime: number;
        rawData: {
            message_id: number;
        };
        message_id: string;
        message_time: number;
        time: number;
    }>;
    /**
     * @deprecated 已废弃，请使用`sendLongMsg`
     */
    SendMessageByResId(contact: Contact, id: string): Promise<{
        messageId: string;
        messageTime: number;
        rawData: {
            message_id: number;
        };
        message_id: string;
        message_time: number;
        time: number;
    }>;
    /**
     * 撤回消息
     * @param contact ob11无需提供contact参数
     * @param messageId 消息ID
     */
    recallMsg(contact: Contact, messageId: string): Promise<boolean>;
    /**
     * @deprecated 已废弃，请使用`recallMsg`
     */
    RecallMessage(_contact: Contact, messageId: string): Promise<boolean>;
    /**
     * 获取消息
     * @param contact 联系人信息
     * @param messageId 消息ID
     */
    getMsg(contact: Contact, messageId: string): Promise<{
        time: number;
        messageId: string;
        message_id: string;
        message_seq: number;
        messageSeq: number;
        contact: {
            scene: "group" | "friend";
            peer: string;
            sub_peer: null;
            name: string;
        };
        sender: {
            userId: string;
            uid: string;
            uin: number;
            nick: string;
            role: "unknown";
            name: string;
        };
        elements: Elements[];
    }>;
    /**
     * @deprecated 已废弃，请使用`getMsg`
     */
    GetMessage(contact: Contact, messageId: string): Promise<{
        time: number;
        messageId: string;
        message_id: string;
        message_seq: number;
        messageSeq: number;
        contact: {
            scene: "group" | "friend";
            peer: string;
            sub_peer: null;
            name: string;
        };
        sender: {
            userId: string;
            uid: string;
            uin: number;
            nick: string;
            role: "unknown";
            name: string;
        };
        elements: Elements[];
    }>;
    /**
     * 获取msgId获取历史消息
     * @param contact 目标信息
     * @param startMsgId 起始消息ID
     * @param count 获取消息数量 默认为1
     * @returns 包含历史消息的数组
     */
    getHistoryMsg(contact: Contact, startMsgId: string, count: number): Promise<{
        time: number;
        messageId: string;
        messageSeq: number;
        message_id: string;
        message_seq: number;
        contact: Contact;
        sender: {
            userId: string;
            uid: string;
            uin: number;
            nick: string;
            name: string;
            role: "unknown" | "admin" | "owner" | "member";
            card: string;
        };
        elements: Elements[];
    }[]>;
    /**
     * 获取msg_id获取历史消息
     * @deprecated 已废弃，请使用`getHistoryMsg`
     */
    GetHistoryMessage(contact: Contact, startMessageId: string, count?: number): Promise<{
        time: number;
        messageId: string;
        messageSeq: number;
        message_id: string;
        message_seq: number;
        contact: Contact;
        sender: {
            userId: string;
            uid: string;
            uin: number;
            nick: string;
            name: string;
            role: "unknown" | "admin" | "owner" | "member";
            card: string;
        };
        elements: Elements[];
    }[]>;
    /**
     * 发送好友赞
     * @param targetId 目标ID
     * @param count 赞的次数
     * @returns 此接口的返回值不值得信任
     */
    sendLike(targetId: string, count: number): Promise<boolean>;
    /**
     * @deprecated 已废弃，请使用`sendLike`
     */
    VoteUser(targetId: string, voteCount?: number): Promise<boolean>;
    /**
     * 群踢人
     * @param groupId 群ID
     * @param targetId 被踢出目标的ID 任选其一
     * @param rejectAddRequest 是否拒绝再次申请，默认为false
     * @param kickReason 踢出原因，可选
     * @returns 此接口的返回值不值得信任
     */
    groupKickMember(groupId: string, targetId: string, rejectAddRequest?: boolean, kickReason?: string): Promise<boolean>;
    /**
     * @deprecated 已废弃，请使用`groupKickMember`
     */
    KickMember(groupId: string, targetId: string, rejectAddRequest?: boolean, kickReason?: string): Promise<boolean>;
    /**
     * 禁言群成员
     * @param groupId 群ID
     * @param targetId 被禁言目标的ID 任选其一
     * @param duration 禁言时长 单位:秒
     * @returns 此接口的返回值不值得信任
     */
    setGroupMute(groupId: string, targetId: string, duration: number): Promise<boolean>;
    /**
     * @deprecated 已废弃，请使用`setGroupMute`
     */
    BanMember(groupId: string, targetId: string, duration: number): Promise<boolean>;
    /**
     * 群全员禁言
     * @param groupId 群ID
     * @param isBan 是否开启全员禁言
     * @returns 此接口的返回值不值得信任
     */
    setGroupAllMute(groupId: string, isBan: boolean): Promise<boolean>;
    /**
     * @deprecated 已废弃，请使用`setGroupAllMute`
     */
    SetGroupWholeBan(groupId: string, isBan?: boolean): Promise<boolean>;
    /**
     * 设置群管理员
     * @param groupId 群ID
     * @param targetId 目标用户的ID
     * @param isAdmin 是否设置为管理员
     * @returns 此接口的返回值不值得信任
     */
    setGroupAdmin(groupId: string, targetId: string, isAdmin: boolean): Promise<boolean>;
    /**
     * @deprecated 已废弃，请使用`setGroupAdmin`
     */
    SetGroupAdmin(groupId: string, targetId: string, isAdmin: boolean): Promise<boolean>;
    /**
     * 设置群名片
     * @param groupId 群ID
     * @param targetId 目标用户的ID
     * @param card 新的群名片
     * @returns 此接口的返回值不值得信任
     */
    setGroupMemberCard(groupId: string, targetId: string, card: string): Promise<boolean>;
    /**
     * @deprecated 已废弃，请使用`setGroupMemberCard`
     */
    ModifyMemberCard(groupId: string, targetId: string, card: string): Promise<boolean>;
    /**
     * 设置群名
     * @param groupId 群ID
     * @param groupName 新的群名
     * @returns 此接口的返回值不值得信任
     */
    setGroupName(groupId: string, groupName: string): Promise<boolean>;
    /**
     * @deprecated 已废弃，请使用`setGroupName`
     */
    ModifyGroupName(groupId: string, groupName: string): Promise<boolean>;
    /**
     * 退出群组
     * @param groupId 群ID
     * @param isDismiss 如果Bot是群主，是否解散群
     * @returns 此接口的返回值不值得信任
     */
    setGroupQuit(groupId: string, isDismiss: boolean): Promise<boolean>;
    /**
     * @deprecated 已废弃，请使用`setGroupQuit`
     */
    LeaveGroup(groupId: string, isDismiss?: boolean): Promise<boolean>;
    /**
     * 设置群专属头衔 仅群主可用
     * @param groupId 群ID
     * @param targetId 目标用户的ID
     * @param title 新的专属头衔
     * @returns 此接口的返回值不值得信任
     */
    setGroupMemberTitle(groupId: string, targetId: string, title: string): Promise<boolean>;
    /**
     * @deprecated 已废弃，请使用`setGroupMemberTitle`
     */
    SetGroupUniqueTitle(groupId: string, targetId: string, uniqueTitle: string): Promise<boolean>;
    /**
     * 获取登录号信息
     * @deprecated 已废弃，请直接使用`this.account`
     */
    GetCurrentAccount(): Promise<{
        account_uid: string;
        account_uin: string;
        account_name: string;
    }>;
    /**
     * 获取陌生人信息
     * @param targetId 用户ID 任选其一
     * @returns 陌生人信息数组
     */
    getStrangerInfo(targetId: string): Promise<{
        userId: string;
        user_id: string;
        /** 用户UID */
        uid: string;
        /** 用户UIN */
        uin: string;
        /** qid */
        qid: string;
        /** 名称 */
        nick: string;
        /** 备注 */
        remark: string;
        /** 用户等级 */
        level: number;
        /** 生日 */
        birthday: string;
        /** 登录天数 */
        login_day: number;
        /** 点赞数 */
        vote_cnt: number;
        /** 学校是否已核实 */
        is_school_verified: undefined;
        /**
       * 年龄
       * 拓展字段
       */
        age: number | undefined;
        /**
       * 性别
       * 拓展字段
       */
        sex: "unknown" | "male" | "female";
        /** 大会员 */
        big_vip: undefined;
        /** 好莱坞/腾讯视频会员 */
        hollywood_vip: undefined;
        /** QQ会员 */
        qq_vip: boolean | undefined;
        /** QQ超级会员 */
        super_vip: undefined;
        /** 是否已经赞过 */
        voted: undefined;
        nickname: string;
        constellation?: number;
        shengXiao?: number;
        kBloodType?: number;
        homeTown?: string;
        makeFriendCareer?: number;
        pos?: string;
        college?: string;
        country?: string;
        province?: string;
        city?: string;
        postCode?: string;
        address?: string;
        regTime?: number;
        reg_time?: number;
        interest?: string;
        labels?: string[];
        qqLevel?: number;
        longNick?: string;
        long_nick?: string;
        birthday_year?: number;
        birthday_month?: number;
        birthday_day?: number;
        eMail?: string;
        phoneNum?: string;
        categoryId?: number;
        richTime?: number;
        richBuffer?: Record<number, number>;
        status?: number;
        extStatus?: number;
        batteryStatus?: number;
        termType?: number;
        netType?: number;
        iconType?: number;
        customStatus?: string | null;
        setTime?: string;
        specialFlag?: number;
        abiFlag?: number;
        eNetworkType?: number;
        showName?: string;
        termDesc?: string;
        musicInfo?: {
            buf?: Record<string, unknown>;
        };
        extOnlineBusinessInfo?: {
            buf?: Record<string, unknown>;
            customStatus?: string | null;
            videoBizInfo?: {
                cid?: string;
                tvUrl?: string;
                synchType?: string;
            };
            videoInfo?: {
                name?: string;
            };
        };
        extBuffer?: {
            buf?: Record<string, unknown>;
        };
        is_vip?: boolean;
        is_years_vip?: boolean;
        vip_level?: number;
        login_days?: number;
    }>;
    /**
     * 获取好友列表
     * @param refresh 是否刷新好友列表
     * @returns 好友列表数组
     */
    getFriendList(refresh?: boolean): Promise<{
        userId: string;
        user_id: string;
        /** 用户UID */
        uid: string;
        /** 用户UIN */
        uin: string;
        /** qid */
        qid: string;
        /** 名称 */
        nick: string;
        /** 备注 */
        remark: string;
        /** 用户等级 */
        level: number;
        /** 生日 */
        birthday: string;
        /** 登录天数 */
        login_day: number;
        /** 点赞数 */
        vote_cnt: number;
        /** 学校是否已核实 */
        is_school_verified: undefined;
        /**
         * 年龄
         * 拓展字段
         */
        age: number | undefined;
        /**
         * 性别
         * 拓展字段
         */
        sex: "unknown" | "male" | "female";
        /** 大会员 */
        big_vip: undefined;
        /** 好莱坞/腾讯视频会员 */
        hollywood_vip: undefined;
        /** QQ会员 */
        qq_vip: boolean | undefined;
        /** QQ超级会员 */
        super_vip: undefined;
        /** 是否已经赞过 */
        voted: undefined;
        nickname: string;
        constellation?: number;
        shengXiao?: number;
        kBloodType?: number;
        homeTown?: string;
        makeFriendCareer?: number;
        pos?: string;
        college?: string;
        country?: string;
        province?: string;
        city?: string;
        postCode?: string;
        address?: string;
        regTime?: number;
        reg_time?: number;
        interest?: string;
        labels?: string[];
        qqLevel?: number;
        longNick?: string;
        long_nick?: string;
        birthday_year?: number;
        birthday_month?: number;
        birthday_day?: number;
        eMail?: string;
        phoneNum?: string;
        categoryId?: number;
        richTime?: number;
        richBuffer?: Record<number, number>;
        status?: number;
        extStatus?: number;
        batteryStatus?: number;
        termType?: number;
        netType?: number;
        iconType?: number;
        customStatus?: string | null;
        setTime?: string;
        specialFlag?: number;
        abiFlag?: number;
        eNetworkType?: number;
        showName?: string;
        termDesc?: string;
        musicInfo?: {
            buf?: Record<string, unknown>;
        };
        extOnlineBusinessInfo?: {
            buf?: Record<string, unknown>;
            customStatus?: string | null;
            videoBizInfo?: {
                cid?: string;
                tvUrl?: string;
                synchType?: string;
            };
            videoInfo?: {
                name?: string;
            };
        };
        extBuffer?: {
            buf?: Record<string, unknown>;
        };
        is_vip?: boolean;
        is_years_vip?: boolean;
        vip_level?: number;
        login_days?: number;
    }[]>;
    /**
     * @deprecated 已废弃，请使用`getStrangerInfo`
     */
    GetStrangerProfileCard(targetId: Array<string>): Promise<{
        userId: string;
        user_id: string;
        /** 用户UID */
        uid: string;
        /** 用户UIN */
        uin: string;
        /** qid */
        qid: string;
        /** 名称 */
        nick: string;
        /** 备注 */
        remark: string;
        /** 用户等级 */
        level: number;
        /** 生日 */
        birthday: string;
        /** 登录天数 */
        login_day: number;
        /** 点赞数 */
        vote_cnt: number;
        /** 学校是否已核实 */
        is_school_verified: undefined;
        /**
       * 年龄
       * 拓展字段
       */
        age: number | undefined;
        /**
       * 性别
       * 拓展字段
       */
        sex: "unknown" | "male" | "female";
        /** 大会员 */
        big_vip: undefined;
        /** 好莱坞/腾讯视频会员 */
        hollywood_vip: undefined;
        /** QQ会员 */
        qq_vip: boolean | undefined;
        /** QQ超级会员 */
        super_vip: undefined;
        /** 是否已经赞过 */
        voted: undefined;
        nickname: string;
        constellation?: number;
        shengXiao?: number;
        kBloodType?: number;
        homeTown?: string;
        makeFriendCareer?: number;
        pos?: string;
        college?: string;
        country?: string;
        province?: string;
        city?: string;
        postCode?: string;
        address?: string;
        regTime?: number;
        reg_time?: number;
        interest?: string;
        labels?: string[];
        qqLevel?: number;
        longNick?: string;
        long_nick?: string;
        birthday_year?: number;
        birthday_month?: number;
        birthday_day?: number;
        eMail?: string;
        phoneNum?: string;
        categoryId?: number;
        richTime?: number;
        richBuffer?: Record<number, number>;
        status?: number;
        extStatus?: number;
        batteryStatus?: number;
        termType?: number;
        netType?: number;
        iconType?: number;
        customStatus?: string | null;
        setTime?: string;
        specialFlag?: number;
        abiFlag?: number;
        eNetworkType?: number;
        showName?: string;
        termDesc?: string;
        musicInfo?: {
            buf?: Record<string, unknown>;
        };
        extOnlineBusinessInfo?: {
            buf?: Record<string, unknown>;
            customStatus?: string | null;
            videoBizInfo?: {
                cid?: string;
                tvUrl?: string;
                synchType?: string;
            };
            videoInfo?: {
                name?: string;
            };
        };
        extBuffer?: {
            buf?: Record<string, unknown>;
        };
        is_vip?: boolean;
        is_years_vip?: boolean;
        vip_level?: number;
        login_days?: number;
    }>;
    /** 获取好友列表 */
    GetFriendList(): Promise<{
        userId: string;
        user_id: string;
        /** 用户UID */
        uid: string;
        /** 用户UIN */
        uin: string;
        /** qid */
        qid: string;
        /** 名称 */
        nick: string;
        /** 备注 */
        remark: string;
        /** 用户等级 */
        level: number;
        /** 生日 */
        birthday: string;
        /** 登录天数 */
        login_day: number;
        /** 点赞数 */
        vote_cnt: number;
        /** 学校是否已核实 */
        is_school_verified: undefined;
        /**
         * 年龄
         * 拓展字段
         */
        age: number | undefined;
        /**
         * 性别
         * 拓展字段
         */
        sex: "unknown" | "male" | "female";
        /** 大会员 */
        big_vip: undefined;
        /** 好莱坞/腾讯视频会员 */
        hollywood_vip: undefined;
        /** QQ会员 */
        qq_vip: boolean | undefined;
        /** QQ超级会员 */
        super_vip: undefined;
        /** 是否已经赞过 */
        voted: undefined;
        nickname: string;
        constellation?: number;
        shengXiao?: number;
        kBloodType?: number;
        homeTown?: string;
        makeFriendCareer?: number;
        pos?: string;
        college?: string;
        country?: string;
        province?: string;
        city?: string;
        postCode?: string;
        address?: string;
        regTime?: number;
        reg_time?: number;
        interest?: string;
        labels?: string[];
        qqLevel?: number;
        longNick?: string;
        long_nick?: string;
        birthday_year?: number;
        birthday_month?: number;
        birthday_day?: number;
        eMail?: string;
        phoneNum?: string;
        categoryId?: number;
        richTime?: number;
        richBuffer?: Record<number, number>;
        status?: number;
        extStatus?: number;
        batteryStatus?: number;
        termType?: number;
        netType?: number;
        iconType?: number;
        customStatus?: string | null;
        setTime?: string;
        specialFlag?: number;
        abiFlag?: number;
        eNetworkType?: number;
        showName?: string;
        termDesc?: string;
        musicInfo?: {
            buf?: Record<string, unknown>;
        };
        extOnlineBusinessInfo?: {
            buf?: Record<string, unknown>;
            customStatus?: string | null;
            videoBizInfo?: {
                cid?: string;
                tvUrl?: string;
                synchType?: string;
            };
            videoInfo?: {
                name?: string;
            };
        };
        extBuffer?: {
            buf?: Record<string, unknown>;
        };
        is_vip?: boolean;
        is_years_vip?: boolean;
        vip_level?: number;
        login_days?: number;
    }[]>;
    /**
     * 获取群信息
     * @param groupId 群ID
     * @param noCache 是否刷新缓存
     * @returns 群信息
     */
    getGroupInfo(groupId: string, noCache?: boolean): Promise<{
        groupId: string;
        groupName: string;
        groupRemark: string;
        maxMemberCount: number;
        memberCount: number;
        groupDesc: string;
        group_name: string;
        group_remark: string;
        max_member_count: number;
        member_count: number;
        group_uin: string;
        admins: never[];
        owner: string;
    }>;
    /**
     * @deprecated 已废弃，请使用`getGroupInfo`
     */
    GetGroupInfo(_groupId: string, noCache?: boolean): Promise<{
        groupId: string;
        groupName: string;
        groupRemark: string;
        maxMemberCount: number;
        memberCount: number;
        groupDesc: string;
        group_name: string;
        group_remark: string;
        max_member_count: number;
        member_count: number;
        group_uin: string;
        admins: never[];
        owner: string;
    }>;
    /**
     * 获取群列表
     * @param refresh 是否刷新好友列表
     * @returns 群列表数组
     */
    getGroupList(refresh?: boolean): Promise<{
        groupId: string;
        groupName: string;
        groupRemark: string;
        maxMemberCount: number;
        memberCount: number;
        groupDesc: string;
        group_name: string;
        group_remark: string;
        max_member_count: number;
        member_count: number;
        group_uin: string;
        admins: never[];
        owner: string;
    }[]>;
    /**
     * 获取群列表
     * @deprecated 已废弃，请使用`getGroupList`
     */
    GetGroupList(): Promise<{
        groupId: string;
        groupName: string;
        groupRemark: string;
        maxMemberCount: number;
        memberCount: number;
        groupDesc: string;
        group_name: string;
        group_remark: string;
        max_member_count: number;
        member_count: number;
        group_uin: string;
        admins: never[];
        owner: string;
    }[]>;
    /**
     * 获取群成员信息
     * 此接口在非QQ平台上很难获取到标准信息，因此返回的数据可能会有所不同
     * @param groupId 群ID
     * @param targetId 目标用户的ID
     * @param refresh 是否刷新缓存
     * @returns 群成员信息
     */
    getGroupMemberInfo(groupId: string, targetId: string, refresh?: boolean): Promise<{
        userId: string;
        uid: string;
        uin: string;
        nick: string;
        role: "unknown" | "admin" | "owner" | "member";
        age: number;
        uniqueTitle: string;
        card: string;
        joinTime: number;
        lastActiveTime: number;
        level: number;
        shutUpTime: number;
        distance: undefined;
        honors: never[];
        unfriendly: boolean;
        sex: "unknown" | "male" | "female";
        sender: GroupSender;
        group_id: number;
        user_id: number;
        nickname: string;
        area: string;
        join_time: number;
        last_sent_time: number;
        title: string;
        title_expire_time: number;
        card_changeable: boolean;
    }>;
    /**
     * @deprecated 已废弃，请使用`getGroupMemberInfo`
     */
    GetGroupMemberInfo(groupId: string, targetId: string, refresh?: boolean): Promise<{
        userId: string;
        uid: string;
        uin: string;
        nick: string;
        role: "unknown" | "admin" | "owner" | "member";
        age: number;
        uniqueTitle: string;
        card: string;
        joinTime: number;
        lastActiveTime: number;
        level: number;
        shutUpTime: number;
        distance: undefined;
        honors: never[];
        unfriendly: boolean;
        sex: "unknown" | "male" | "female";
        sender: GroupSender;
        group_id: number;
        user_id: number;
        nickname: string;
        area: string;
        join_time: number;
        last_sent_time: number;
        title: string;
        title_expire_time: number;
        card_changeable: boolean;
    }>;
    /**
     * 获取群成员列表
     * @param groupId 群ID
     * @param refresh 是否刷新缓存
     * @returns 群成员列表数组
     */
    getGroupMemberList(groupId: string, refresh?: boolean): Promise<{
        userId: string;
        uid: string;
        uin: string;
        nick: string;
        role: "unknown" | "admin" | "owner" | "member";
        age: number;
        uniqueTitle: string;
        card: string;
        joinTime: number;
        lastActiveTime: number;
        level: number;
        shutUpTime: number;
        distance: undefined;
        honors: never[];
        unfriendly: boolean;
        sex: "unknown" | "male" | "female";
        sender: GroupSender;
        group_id: number;
        user_id: number;
        nickname: string;
        area: string;
        join_time: number;
        last_sent_time: number;
        title: string;
        title_expire_time: number;
        card_changeable: boolean;
    }[]>;
    /**
     * @deprecated 已废弃，请使用`getGroupMemberList`
     */
    GetGroupMemberList(groupId: string, refresh?: boolean): Promise<{
        userId: string;
        uid: string;
        uin: string;
        nick: string;
        role: "unknown" | "admin" | "owner" | "member";
        age: number;
        uniqueTitle: string;
        card: string;
        joinTime: number;
        lastActiveTime: number;
        level: number;
        shutUpTime: number;
        distance: undefined;
        honors: never[];
        unfriendly: boolean;
        sex: "unknown" | "male" | "female";
        sender: GroupSender;
        group_id: number;
        user_id: number;
        nickname: string;
        area: string;
        join_time: number;
        last_sent_time: number;
        title: string;
        title_expire_time: number;
        card_changeable: boolean;
    }[]>;
    /**
     * 获取群荣誉信息
     * @param groupId 群ID
     * @param refresh 是否刷新缓存
     * @returns 群荣誉信息数组
     */
    getGroupHonor(groupId: string): Promise<QQGroupHonorInfo[]>;
    /**
     * @deprecated 已废弃，请使用`getGroupHonor`
     */
    GetGroupHonor(groupId: string, refresh?: boolean): Promise<QQGroupHonorInfo[]>;
    /**
     * 设置消息表情回应
     * @param contact 目标信息
     * @param messageId 消息ID
     * @param faceId 表情ID
     * @returns 此接口的返回值不值得信任
     */
    setMsgReaction(contact: Contact, messageId: string, faceId: number, isSet: boolean): Promise<boolean>;
    /**
     * @deprecated 已废弃，请使用`setMsgReaction`
     */
    ReactMessageWithEmoji(contact: Contact, messageId: string, faceId: number, isSet?: boolean): Promise<boolean>;
    /**
     * 获取版本信息
     * @deprecated 已废弃，请使用`setMsgReaction`
     */
    GetVersion(): Promise<{
        name: string;
        app_name: string;
        version: string;
        protocol: string;
    }>;
    DownloadForwardMessage(resId: string): Promise<any>;
    /**
     * 获取精华消息
     * @param groupId 群ID
     * @param page 页码
     * @param pageSize 每页数量
     * @returns EssenceMessageBody对象
     */
    getGroupHighlights(groupId: string, page: number, pageSize: number): Promise<(GetGroupHighlightsResponse & {
        group_id: string;
        sender_uid: string;
        sender_uin: string;
        sender_nick: string;
        operator_uid: string;
        operator_uin: string;
        operator_nick: string;
        operation_time: number;
        message_time: number;
        message_id: string;
        message_seq: number;
        json_elements: string;
    })[]>;
    /**
     * 精华消息
     * @deprecated 已废弃，请使用`getGroupHighlights`
     */
    GetEssenceMessageList(groupId: string, page: number, pageSize: number): Promise<(GetGroupHighlightsResponse & {
        group_id: string;
        sender_uid: string;
        sender_uin: string;
        sender_nick: string;
        operator_uid: string;
        operator_uin: string;
        operator_nick: string;
        operation_time: number;
        message_time: number;
        message_id: string;
        message_seq: number;
        json_elements: string;
    })[]>;
    /**
     * 上传群文件、私聊文件
     * @param contact 目标信息
     * @param file 本地文件绝对路径
     * @param name 文件名称 必须提供
     * @param folder 父目录ID 不提供则上传到根目录 仅在群聊时有效
     * @returns 此接口的返回值不值得信任
     */
    uploadFile(contact: Contact, file: string, name: string, folder?: string): Promise<boolean>;
    /**
     * @deprecated 已废弃，请使用`uploadFile`
     */
    UploadGroupFile(groupId: string, file: string, name: string, folder?: string): Promise<boolean>;
    /**
     * @deprecated 已废弃，请使用`uploadFile`
     */
    UploadPrivateFile(userId: string, file: string, name: string): Promise<boolean>;
    /**
     * 设置、取消群精华消息
     * @param groupId 群ID
     * @param messageId 群消息ID
     * @param create true为添加精华消息，false为删除精华消息 默认为true
     */
    setGgroupHighlights(groupId: string, messageId: string, create: boolean): Promise<boolean>;
    /**
     * @deprecated 已废弃，请使用`setGgroupHighlights`
     */
    SetEssenceMessage(_groupId: string, messageId: string): Promise<boolean>;
    /**
     * @deprecated 已废弃，请使用`setGgroupHighlights`
     */
    DeleteEssenceMessage(_groupId: string, messageId: string): Promise<boolean>;
    PokeMember(groupId: string, targetId: string): Promise<void>;
    /**
     * 设置好友请求结果
     * @param requestId 请求事件ID
     * @param isApprove 是否同意
     * @param remark 好友备注 同意时有效
     * @returns 设置结果
     */
    setFriendApplyResult(requestId: string, isApprove: boolean, remark?: string): Promise<boolean>;
    /**
     * @deprecated 已废弃，请使用`setFriendApplyResult`
     */
    SetFriendApplyResult(requestId: string, isApprove: boolean, remark?: string): Promise<boolean>;
    /**
     * 设置申请加入群请求结果
     * @param requestId 请求事件ID
     * @param isApprove 是否同意
     * @param denyReason 拒绝理由 拒绝时有效
     * @returns 此接口的返回值不值得信任
     */
    setGroupApplyResult(requestId: string, isApprove: boolean, denyReason?: string): Promise<boolean>;
    /**
     * @deprecated 已废弃，请使用`setGroupApplyResult`
     */
    SetGroupApplyResult(requestId: string, isApprove: boolean, denyReason?: string): Promise<boolean>;
    /**
     * 设置邀请加入群请求结果
     * @param requestId 请求事件ID
     * @param isApprove 是否同意
     * @returns 此接口的返回值不值得信任
     */
    setInvitedJoinGroupResult(requestId: string, isApprove: boolean): Promise<boolean>;
    /**
     * @deprecated 已废弃，请使用`setInvitedJoinGroupResult`
     */
    SetInvitedJoinGroupResult(requestId: string, isApprove: boolean, denyReason?: string): Promise<boolean>;
    /**
     * 合并转发 karin -> adapter
     * @param elements 消息元素
     * @returns 适配器消息元素
     */
    forwardKarinConvertAdapter(elements: Array<NodeElement>): Array<OB11NodeSegment>;
    /**
     * 发送合并转发消息
     * @param contact 目标信息
     * @param elements 消息元素
     * @param options 首层小卡片外显参数
     */
    sendForwardMsg(contact: Contact, elements: NodeElement[], options?: ForwardOptions): Promise<{
        messageId: string;
        forwardId: string;
        message_id: string;
    }>;
    /**
     * @deprecated 已废弃，请使用`sendForwardMsg`
     */
    sendForwardMessage(contact: Contact, elements: NodeElement[]): Promise<{
        messageId: string;
        forwardId: string;
        message_id: string;
    }>;
    /**
     * 发送API请求
     * @param action API端点
     * @param params API参数
     */
    sendApi<T extends keyof Params>(action: T | `${T}`, params: Params[T], time?: number): Promise<Request[T]>;
    /**
     * 发送API请求
     * @deprecated 已废弃，请使用`sendApi`
     */
    SendApi<T extends keyof Params>(action: T, params: Params[T], time?: number): Promise<Request[T]>;
}
