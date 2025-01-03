#!/usr/bin/env node
/**
 * @description 入口函数
 * @param program
 */
declare function main(program: typeof import('commander').program, karin: typeof import('./main')): Promise<void>;
/**
 * @description 初始化基本配置
 */
declare function init(): Promise<void>;
/**
 * @description 更新插件
 */
declare function up(): Promise<void>;
