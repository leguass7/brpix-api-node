import { QRCodeToFileOptions } from 'qrcode';
import { Values } from '../types/apipix-types';
import { IQRCodePayload, PropsIQRCodePayload } from './payload-types';
declare class QRCodePayload {
    payload: IQRCodePayload;
    constructor(payload?: IQRCodePayload);
    set(prop: IQRCodePayload | PropsIQRCodePayload, value?: Values): this;
    private getValue;
    private getMerchantAccountInformation;
    private getUniquePayment;
    private getAdditionalDataFieldTemplate;
    private getCRC16;
    /**
     * Adquiri string para gerar QRCode
     * @method getPayload
     */
    getPayload(): string;
    /**
     * Retorna string base64 do QRCode
     * @method getQRCode
     */
    getQRCode(width?: number): Promise<string>;
    /**
     * Salva arquivo qrcode
     * @method save
     */
    save(path: string, options: QRCodeToFileOptions): Promise<this>;
}
export default QRCodePayload;
//# sourceMappingURL=index.d.ts.map