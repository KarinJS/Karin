import type { QQBotButton } from './types';
import type { ButtonElement, KeyboardElement } from '@/types/segment';
/**
 * 将karin标准格式的按钮转换为QQ官方按钮
 * @param button karin按钮
 * @returns QQ按钮数组
 */
export declare const karinToQQBot: (button: ButtonElement | KeyboardElement) => Array<{
    buttons: Array<QQBotButton>;
}>;
/**
 * 将QQ官方按钮转换为karin标准格式的按钮
 * @param button QQ按钮 传`content.rows`
 * @returns karin按钮
 */
export declare const qqbotToKarin: (button: Array<{
    buttons: Array<QQBotButton>;
}>) => string;
