import { Props } from '../types/apipix-types';
/**
 * IDs do Payload do Pix
 */
export declare const Ids: {
    readonly ID_PAYLOAD_FORMAT_INDICATOR: "00";
    readonly ID_POINT_OF_INITIATION_METHOD: "01";
    readonly ID_MERCHANT_ACCOUNT_INFORMATION: "26";
    readonly ID_MERCHANT_ACCOUNT_INFORMATION_GUI: "00";
    readonly ID_MERCHANT_ACCOUNT_INFORMATION_KEY: "01";
    readonly ID_MERCHANT_ACCOUNT_INFORMATION_DESCRIPTION: "02";
    readonly ID_MERCHANT_ACCOUNT_INFORMATION_URL: "25";
    readonly ID_MERCHANT_CATEGORY_CODE: "52";
    readonly ID_TRANSACTION_CURRENCY: "53";
    readonly ID_TRANSACTION_AMOUNT: "54";
    readonly ID_COUNTRY_CODE: "58";
    readonly ID_MERCHANT_NAME: "59";
    readonly ID_MERCHANT_CITY: "60";
    readonly ID_ADDITIONAL_DATA_FIELD_TEMPLATE: "62";
    readonly ID_ADDITIONAL_DATA_FIELD_TEMPLATE_TXID: "05";
    readonly ID_CRC16: "63";
};
export declare type IdKeys = keyof typeof Ids;
export interface IQRCodePayload {
    /** Chave pix */
    pixKey: string;
    /** Descrição do pagamento */
    description?: string;
    /** Nome do titular da conta */
    merchantName: string;
    /** Cidade do titular da conta */
    merchantCity: string;
    /** ID da transação pix */
    txid: string;
    /** Valor da transação */
    amount: string;
    /** Define se o pagamento deve ser feito apenas uma vez */
    uniquePayment: boolean;
    /** URL do payload dinâmico */
    url?: string;
    /** Tipo da moeda "mocado em Real brasileiro" */
    currency?: '986';
    /** código do país "mocado BR (Brasil)" */
    countryCode?: 'BR';
    /** Código da categoria "mocado em 0000" */
    categoryCode?: '0000';
    /** flag para determinar QRCode é statático ou dinâmico */
    isStatic?: boolean;
}
export declare const defaultPayload: IQRCodePayload;
export declare type PropsIQRCodePayload = Props<IQRCodePayload>;
//# sourceMappingURL=payload-types.d.ts.map