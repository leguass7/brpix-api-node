import { apiConfig, configTest } from './config'
import {
  ApiPix,
  IRequestCreateImmediateCharge,
  QRCodePayload,
  validPixTxid,
  IQRCodePayload,
  IResponseCob
} from '../src'

const request: IRequestCreateImmediateCharge = {
  calendario: {
    expiracao: 3600
  },
  chave: '12345678900',
  devedor: {
    cpf: '98765432100',
    nome: 'Fulano de Tal'
  },
  solicitacaoPagador: 'Pagamento de teste 1',
  valor: {
    original: '0.10'
  }
}

describe('Test endpoints', () => {
  const pix = new ApiPix(apiConfig)
  let txid: string
  let cob: IResponseCob

  beforeAll(async () => {
    await pix.init()
    return true
  })

  it('Deveria gerar txid', done => {
    txid = pix.txidGenerate()
    expect(!!(typeof txid === 'string')).toBe(true)
    expect(validPixTxid(txid)).toBe(true)
    expect(txid.length).toBeGreaterThanOrEqual(25)
    expect(txid.length).toBeLessThanOrEqual(35)

    done()
  })

  it('Deveria instanciar ApiPix', done => {
    expect(pix).toBeInstanceOf(ApiPix)
    expect(!!(typeof pix.token === 'string' && pix.token.length > 1)).toBe(true)
    done()
  })

  it('Deveria criar uma cobrança', async done => {
    const response = await pix.createCob(request, txid)
    expect(response).toHaveProperty('location')
    done()
  })

  it('Deveria consultar uma cobrança', async done => {
    cob = await pix.consultCob(txid)
    expect(cob).toHaveProperty('location')
    expect(cob).toHaveProperty('status')
    expect(cob.status).toEqual('ATIVA')
    done()
  })

  it('Deveria adquirir qrcode de uma cobrança', async done => {
    const response = await pix.qrcodeByLocation(cob.loc.id)
    expect(response).toHaveProperty('imagemQrcode')
    expect(response).toHaveProperty('qrcode')
    done()
  })

  it('Deveria criar uma string base64 de QRCode de cobrança', async done => {
    expect(cob.status).toEqual('ATIVA')

    const payload: IQRCodePayload = {
      amount: cob.valor.original,
      merchantCity: 'Fortaleza',
      merchantName: 'Test ApiPix',
      pixKey: configTest.pixKey,
      txid: cob.txid,
      uniquePayment: true,
      url: cob.location
    }
    const qrcode = new QRCodePayload(payload)
    const qr = await qrcode.getQRCode()
    expect(typeof qr === 'string').toBe(true)
    // console.log('string base64', qr)

    done()
  })
})
