import type { Request } from 'express';
/**
 * http鉴权
 * @public
 */
export declare const auth: {
    /**
     * get请求鉴权
     * @description 支持请求头中携带`Authorization`字段
     * @description 支持请求参数中携带`token`字段
     */
    getAuth: (req: Request) => boolean;
    /**
     * post请求鉴权
     * @description 仅支持请求头中携带`Authorization`字段
     */
    postAuth: (req: Request) => boolean;
};
