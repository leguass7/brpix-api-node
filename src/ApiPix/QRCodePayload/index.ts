import qrcode, { QRCodeToFileOptions } from 'qrcode'
import { getCRC16WDEV, isObject, stringLimit } from '../../helpers'
import { Values } from '../types/apipix-types'
import { defaultPayload, Ids, IQRCodePayload, PropsIQRCodePayload } from './payload-types'

class QRCodePayload {
  payload: IQRCodePayload
  constructor(payload?: IQRCodePayload) {
    this.payload = defaultPayload

    if (payload) this.set(payload)
    return this
  }

  public set(prop: IQRCodePayload | PropsIQRCodePayload, value?: Values): this {
    if (isObject(prop)) {
      Object.keys(prop).forEach(k => {
        if (k in this.payload) this.payload[k] = prop[k]
      })
    } else if (typeof prop === 'string') {
      if (prop in this.payload) {
        // @ts-ignore
        this.payload[prop] = value
      }
    }
    return this
  }

  private getValue(id: string, valor: string): string {
    const size = `${`${valor}`.length}`.padStart(2, '0')
    return `${id}${size}${valor}`
  }

  private getMerchantAccountInformation(): string {
    const { url, pixKey, description, isStatic } = this.payload

    const scape = /^(https?|ftp):\/\//

    /**
     * O ```description``` disputa espaço com ```pixKey``` (max: 99 caracteres)
     */
    const limit = (textDescription: string): string => {
      const pixLen = isStatic ? pixKey.length : 0
      const size = 99 - (22 + pixLen)
      return stringLimit(textDescription, size)
    }

    const arr = [
      // domínio do banco (obrigatório)
      this.getValue(Ids.ID_MERCHANT_ACCOUNT_INFORMATION_GUI, 'br.gov.bcb.pix'),

      // Chave PIX (não precisa no PIX dinâmico)
      pixKey && isStatic ? this.getValue(Ids.ID_MERCHANT_ACCOUNT_INFORMATION_KEY, pixKey) : '',

      // descrição do pagamento
      description
        ? this.getValue(Ids.ID_MERCHANT_ACCOUNT_INFORMATION_DESCRIPTION, limit(description))
        : '',

      // URL do QRCODE dinâmico (não levar URL )
      url && !isStatic
        ? this.getValue(Ids.ID_MERCHANT_ACCOUNT_INFORMATION_URL, url.replace(scape, ''))
        : ''
    ].filter(f => !!f)

    // valor completo da conta
    return this.getValue(Ids.ID_MERCHANT_ACCOUNT_INFORMATION, `${arr.join('')}`)
  }

  private getUniquePayment(): string {
    return this.payload.uniquePayment ? this.getValue(Ids.ID_POINT_OF_INITIATION_METHOD, '12') : ''
  }

  private getAdditionalDataFieldTemplate(): string {
    const txid = this.payload.isStatic
      ? this.getValue(Ids.ID_ADDITIONAL_DATA_FIELD_TEMPLATE_TXID, this.payload.txid)
      : '***'
    return this.getValue(Ids.ID_ADDITIONAL_DATA_FIELD_TEMPLATE, txid)
  }

  private getCRC16(fullPayload: string): string {
    const payload = `${fullPayload}${Ids.ID_CRC16}04`
    return `${Ids.ID_CRC16}04${getCRC16WDEV(payload)}`
  }

  /**
   * Adquiri string para gerar QRCode
   * @method getPayload
   */
  public getPayload(): string {
    const { amount, merchantName, merchantCity, currency, countryCode, categoryCode } = this.payload
    const arrPayload = [
      this.getValue(Ids.ID_PAYLOAD_FORMAT_INDICATOR, '01'),
      this.getUniquePayment(),
      this.getMerchantAccountInformation(),
      this.getValue(Ids.ID_MERCHANT_CATEGORY_CODE, categoryCode),
      this.getValue(Ids.ID_TRANSACTION_CURRENCY, currency),
      this.getValue(Ids.ID_TRANSACTION_AMOUNT, amount),
      this.getValue(Ids.ID_COUNTRY_CODE, countryCode),
      this.getValue(Ids.ID_MERCHANT_NAME, merchantName),
      this.getValue(Ids.ID_MERCHANT_CITY, merchantCity || 'Cidade'),
      this.getAdditionalDataFieldTemplate()
    ]
    const payload = arrPayload.join('')
    return `${arrPayload.join('')}${this.getCRC16(payload)}`
  }

  /**
   * Retorna string base64 do QRCode
   * @method getQRCode
   */
  public async getQRCode(width = 512): Promise<string> {
    const base64 = await qrcode.toDataURL(this.getPayload(), { width })
    return base64
  }

  /**
   * Salva arquivo qrcode
   * @method save
   */
  public async save(path: string, options: QRCodeToFileOptions): Promise<this> {
    await qrcode.toFile(path, this.getPayload(), options)
    return this
  }
}

export default QRCodePayload
