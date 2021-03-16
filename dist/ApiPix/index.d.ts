import { ApiMethod, IApiPixConfig, IGenTxidOptions, Props, Values } from './types/apipix-types';
import { IResponseAccessToken, IResponseCob } from './types/responses-types';
import { CustomAxiosRequestConfig, IRequestCreateImmediateCharge } from './types/requests-types';
declare class ApiPix {
    private config;
    private logPrefix;
    private Api;
    private cancelSources;
    private Agent;
    token: string;
    constructor(config: IApiPixConfig);
    logging(...args: any[]): void;
    private configureAxios;
    private configureRequests;
    private configureResponses;
    private loadCertificate;
    private setAgentSSL;
    /**
     * Adquiri token de acesso na API
     * @method getAccessToken
     */
    getAccessToken(): Promise<IResponseAccessToken>;
    private getCancelToken;
    private removeCancelSource;
    private addCancelSource;
    /**
     * Configura classe ApiPix
     * @method set
     */
    set(prop: IApiPixConfig | Props<IApiPixConfig>, value?: Values): this;
    /**
     * Inicia classe adquirindo token de acesso na API
     * @method init
     */
    init(): Promise<IResponseAccessToken>;
    /**
     * Cancela todas as requisições em andamento
     * @method cancel
     */
    cancel(): this;
    /**
     * Realiza uma requisição na API
     * @method requestApi
     */
    requestApi<TReturn = {
        data: any;
    }>(method: ApiMethod, endpoint: string, payload?: {}, options?: CustomAxiosRequestConfig): Promise<TReturn>;
    /**
     * Gerar txid automatico
     * - baseado em ```uuid``` or ```md5```
     * @method txidGenerate
     */
    txidGenerate(options?: IGenTxidOptions): string;
    /**
     * Cria uma cobrança PIX
     * - Se ```txid``` não informado, gera automaticamente (uuid)
     * @method createCob
     */
    createCob(payload: IRequestCreateImmediateCharge, txid?: string): Promise<IResponseCob>;
    /**
     * Consulta uma cobrança PIX
     * @method consultCob
     */
    consultCob(txid: string): Promise<IResponseCob>;
}
export default ApiPix;
//# sourceMappingURL=index.d.ts.map