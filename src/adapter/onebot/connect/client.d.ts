import WebSocket from 'ws';
import { WsAdapterOneBot11 } from './ws';
export declare class AdapterClientOneBot11 extends WsAdapterOneBot11 {
    token?: string;
    constructor(socket: WebSocket, token?: string);
    static init(url: string, token?: string): Promise<void>;
}
export declare const createClient: () => void;
