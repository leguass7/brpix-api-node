import { CancelToken, CancelTokenSource } from 'axios';
export interface IApiResult {
    success: boolean;
    message?: string;
}
export interface IApiPixConfig {
    baseURL?: string;
    clientId: string;
    clientSecret: string;
    timeout?: number;
    debug?: boolean;
    certificate?: {
        path: string;
        passphrase: string;
    };
}
export declare type Values = string | boolean;
export declare type Props<T> = keyof T;
export declare type ApiMethod = 'post' | 'get' | 'put';
export interface ICancelSource {
    idToken: CancelToken | string;
    source: CancelTokenSource;
}
export interface IGenTxidOptions {
    useMD5Timestamp?: boolean;
    namespace?: string;
}
//# sourceMappingURL=apipix-types.d.ts.map