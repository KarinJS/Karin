/**
 * @description 键类型枚举
 */
export enum Key {
  /** 字符串 */
  STR = 'str',
  /** 数字 */
  NUM = 'num',
  /** 哈希表 */
  HASH = 'hash',
  /** 列表 */
  LIST = 'list',
  /** 集合 */
  SET = 'set',
  /** 有序集合 */
  ZSET = 'zset',
  /** HyperLogLog */
  PF = 'pf',
  /** 位图 */
  BIT = 'bit',
}
