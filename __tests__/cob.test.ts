import { ApiPix, IRequestCreateImmediateCharge } from '../src'
import { apiConfig } from './config'

const request: IRequestCreateImmediateCharge = {
  calendario: {
    expiracao: 3600
  },
  devedor: {
    cpf: '98765432100',
    nome: 'Fulano de Tal'
  },
  solicitacaoPagador: 'Pagamento de teste 1',
  valor: {
    original: '0.10'
  }
}

describe('Teste nova feature cob', () => {
  it('Deveria gerar erro de chave pix na cobranca', async () => {
    const pix = new ApiPix({ ...apiConfig, dev: true })
    await expect(pix.createCob(request)).rejects.toThrow(TypeError)
  })

  it('Deveria criar cobranca "chave" padrão', async () => {
    delete apiConfig.baseURL
    const pix = new ApiPix({
      ...apiConfig,
      pixKey: 'leandro.sbrissa@hotmail.com'
    })
    const cob = await pix.createCob(request)
    const qrcode = await cob.useQRCode({ width: 254 })
    expect(qrcode).toHaveProperty('base64')
    expect(qrcode).toHaveProperty('payload')
    expect(qrcode.base64.startsWith('data:image/png;base64,')).toBe(true)
  })
})

export {}
