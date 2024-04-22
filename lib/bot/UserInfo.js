/**
 * 通知事件联系人
 * @param {string} scene - 场景
 * @param {string} peer - 群号或用户id
 * @param {string} sub_peer - 子群号或用户id
 * @returns {Object}
 */
export function Contacts (scene, peer, sub_peer = '') {
  return { scene, peer, sub_peer }
}

/**
 * 发送者
 * @param {string} operator_uid - 操作者uid
 * @param {string} operator_uin - 操作者uin
 * @param {string} target_uid - 目标者uid
 * @param {string} target_uin - 目标者uin
 * @returns {Object}
 */
export function SendersNotice (operator_uid = '', operator_uin = '', target_uid = '', target_uin = '') {
  return { operator_uid, operator_uin, target_uid, target_uin }
}
