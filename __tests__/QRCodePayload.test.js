import { QRCodePayload } from '../src'

/**
 * Exemplo do video
 * @see https://www.youtube.com/watch?v=eO11iFgrdCA
 */
const exampleWDEV = {
  payload: {
    isStatic: true,
    pixKey: '12345678900',
    description: 'Pagamento do pedido 123456',
    uniquePayment: false,
    amount: '100.00',
    merchantName: 'William Costa',
    merchantCity: 'SAO PAULO',
    txid: 'WDEV1234'
  },
  expected:
    '00020126630014br.gov.bcb.pix0111123456789000226Pagamento do pedido 1234565204000053039865406100.005802BR5913William Costa6009SAO PAULO62120508WDEV12346304E9BF'
}
describe('Teste de classe QRCodePayload', () => {
  it('Deveria instanciar QRCodePayload', done => {
    const payload = new QRCodePayload()
    expect(payload).toBeInstanceOf(QRCodePayload)
    done()
  })

  /**
   * @see https://www.youtube.com/watch?v=eO11iFgrdCA
   */
  it('Deveria gerar uma string para QRCode igual do WDEV', done => {
    const qrcode = new QRCodePayload(exampleWDEV.payload)
    expect(qrcode).toBeInstanceOf(QRCodePayload)
    const strQrCode = qrcode.getPayload()
    expect(typeof strQrCode === 'string').toBe(true)
    expect(strQrCode).toEqual(exampleWDEV.expected)
    done()
  })

  it('Deveria testar metodo "set" da classe', async done => {
    const {
      txid,
      pixKey,
      amount,
      description,
      merchantCity,
      merchantName,
      uniquePayment,
      isStatic
    } = exampleWDEV.payload
    const qrcode1 = new QRCodePayload()
    let strQrCode = qrcode1
      .set('txid', txid)
      .set('isStatic', isStatic)
      .set('pixKey', pixKey)
      .set('amount', amount)
      .set('description', description)
      .set('merchantCity', merchantCity)
      .set('merchantName', merchantName)
      .set('uniquePayment', uniquePayment)
      .set([], 'array') // test invalid prop
      .set('empty-prop', '') // test empty prop
      .getPayload()
    expect(strQrCode).toEqual(exampleWDEV.expected)

    const qrcode2 = new QRCodePayload()
    strQrCode = qrcode2
      .set(exampleWDEV.payload)
      .set({ url: 'https://example.com/qrcode', isStatic: false, empty: 'empty' })
      .set('merchantCity', '') // test empty city

      .getPayload()
    expect(strQrCode !== exampleWDEV.expected).toBe(true)

    done()
  })

  it('Deveria gerar um codigo qrcode valido', async () => {
    const qrPayload = new QRCodePayload({
      isStatic: true,
      txid: 'APIPIXTEST01',
      pixKey: 'leandro.sbrissa@hotmail.com',
      amount: '0.50',
      merchantCity: 'Fortaleza',
      merchantName: 'Leandro Sbrissa',
      uniquePayment: true,
      description: 'Teste de API'
    })

    const base64 = await qrPayload.getQRCode()
    // console.log('string payload', qrPayload.getPayload())
    // console.log('string payload', base64)
    expect(typeof base64 === 'string').toBe(true)
  })
})
