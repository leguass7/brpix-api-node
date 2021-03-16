export declare function stringLimit(str: string, limit: number): string;
export declare function validPixTxid(txid: string): boolean;
export declare function validPixValor(valor: string): boolean;
export declare function replaceAll(str: string, needle?: string | string[], replacement?: string): string;
export declare function isObject(value: any): boolean;
/**
 * Calcula CRC conforme instruções do BACEN. Video do canal WDEV em PHP
 * @function getCRC16WDEV
 * @see https://www.github.com/william-costa/wdev-qrcode-pix-estatico-php
 * @see https://www.youtube.com/watch?v=eO11iFgrdCA
 */
export declare function getCRC16WDEV(payload: string): string;
/**
 * Similar ao ```strtoupper``` do PHP. Convert string em caixa alta
 * @function strtoupper
 */
export declare function strtoupper(str: string): string;
/**
 * Similar a ```dechex``` do PHP. Converte Decimal para hexadecimal
 * @function dechex
 */
export declare function dechex(n: number | string): string;
/**
 * Similar a ```ord``` do PHP. Converte primeiro char da string em ASCII code
 * @function ord
 * @implements
 * ```str.charCodeAt(0)```
 */
export declare function ord(str: string): number;
/**
 * Converte numero decimal em hexadecimal
 * @function numToHex
 * @see https://github.com/NascentSecureTech/pix-qrcode-utils/blob/master/packages/pix-qrcode/test/web-test/js/pix-qrcode-wrapper.js
 * @implements
 * ```n.toString(16).toUpperCase()```
 */
/**
 * Gerar CRC a partir de string conforme documentação BACEN
 * @function computeCRC
 * @see https://github.com/bacen/pix-api
 * @see https://github.com/NascentSecureTech/pix-qrcode-utils/blob/master/packages/pix-qrcode/test/web-test/js/pix-qrcode-wrapper.js
 */
//# sourceMappingURL=index.d.ts.map