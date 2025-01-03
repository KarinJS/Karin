/**
 * 权限类型
 * - `all`: 所有人
 * - `master`: 所有者
 * - `admin`: 管理员
 * - `group.owner`: 群主
 * - `group.admin`: 群管理
 * - `guild.owner`: 频道主
 * - `guild.admin`: 频道管理
 */
export type Permission = 'all' | 'master' | 'admin' | 'group.owner' | 'group.admin' | 'guild.owner' | 'guild.admin';
