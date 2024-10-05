import {
  KarinNoticeType,
  KarinRequestType,
  NoticeEvent,
  NoticeSubType,
  RequestEvent,
  RequestSubType,
} from '../event'

export interface AcceptDict {
  ['request']: KarinRequestType
  ['request.private_apply']: RequestEvent<RequestSubType.PrivateApply>
  ['request.group_apply']: RequestEvent<RequestSubType.GroupApply>
  ['request.invited_group']: RequestEvent<RequestSubType.InvitedGroup>
  ['notice']: KarinNoticeType
  ['notice.private_poke']: NoticeEvent<NoticeSubType.PrivatePoke>
  ['notice.private_recall']: NoticeEvent<NoticeSubType.PrivateRecall>
  ['notice.private_file_uploaded']: NoticeEvent<NoticeSubType.PrivateFileUploaded>
  ['notice.group_poke']: NoticeEvent<NoticeSubType.GroupPoke>
  ['notice.group_recall']: NoticeEvent<NoticeSubType.GroupRecall>
  ['notice.group_file_uploaded']: NoticeEvent<NoticeSubType.GroupFileUploaded>
  ['notice.group_card_changed']: NoticeEvent<NoticeSubType.GroupCardChanged>
  ['notice.group_member_unique_title_changed']: NoticeEvent<NoticeSubType.GroupMemberUniqueTitleChanged>
  ['notice.group_essence_changed']: NoticeEvent<NoticeSubType.GroupEssenceChanged>
  ['notice.group_member_increase']: NoticeEvent<NoticeSubType.GroupMemberIncrease>
  ['notice.group_member_decrease']: NoticeEvent<NoticeSubType.GroupMemberDecrease>
  ['notice.group_admin_changed']: NoticeEvent<NoticeSubType.GroupAdminChanged>
  ['notice.group_sign_in']: NoticeEvent<NoticeSubType.GroupSignIn>
  ['notice.group_member_ban']: NoticeEvent<NoticeSubType.GroupMemberBan>
  ['notice.group_whole_ban']: NoticeEvent<NoticeSubType.GroupWholeBan>
  ['notice.group_message_reaction']: NoticeEvent<NoticeSubType.GroupMessageReaction>
}
