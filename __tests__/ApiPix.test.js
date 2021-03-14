import { ApiPix } from '../src'
import { apiConfig } from './config'
import { v4 } from 'uuid'

describe('Teste de classe ApiPix', () => {
  it('Deveria instanciar a classe ApiPix', async done => {
    const apipix = new ApiPix(apiConfig)
    apipix.logging('TEST')
    expect(apipix).toBeInstanceOf(ApiPix)
    done()
  })

  it('Deveria gerar txid valido', done => {
    const apipix = new ApiPix(apiConfig)
    const txidMd5 = apipix.txidGenerate({ useMD5Timestamp: true })
    const txidUUID = apipix.txidGenerate({ namespace: v4() })
    expect(typeof txidMd5 === 'string').toBe(true)
    expect(txidMd5.length).toBe(32)

    expect(typeof txidUUID === 'string').toBe(true)
    expect(txidUUID.length).toBe(32)

    done()
  })

  // - it('Deveria retornar erro de senha de certificado', done => {
  //   const cfg = { ...apiConfig, certificate: { path: './assinado.pfx', passphrase: '123456' } }
  //   expect(() => new ApiPix(cfg)).toThrow(TypeError)
  //   done()
  // })

  it('Deveria iniciar e adquirir token de acesso', async done => {
    const apipix = new ApiPix(apiConfig)
    const response = await apipix.init()
    expect(response).toHaveProperty('accessToken')
    expect(typeof response.accessToken === 'string').toBe(true)
    expect(response.accessToken.length).toBeGreaterThan(16)
    expect(response.tokenType).toEqual('Bearer')
    done()
  })

  it('Deveria adquirir token de acesso', async done => {
    const apipix = new ApiPix(apiConfig)
    const response = await apipix.getAccessToken()

    expect(response).toHaveProperty('accessToken')
    expect(response.accessToken.length).toBeGreaterThan(16)
    expect(typeof response.accessToken === 'string').toBe(true)

    expect(response.accessToken).toEqual(`${apipix.token}`)
    done()
  })

  it('Deveria retornar um erro', async done => {
    const apipix = new ApiPix(apiConfig)
    apipix.set('timeout', 4000)
    const response = await apipix.requestApi('get', '/v2/any_url')
    expect(apipix.token.length).toBeGreaterThan(16)
    expect(response.data.success).toBe(false)
    expect(response.data).toHaveProperty('messageError')

    done()
  })

  it('Deveria cancelar requisição', async done => {
    const apipix = new ApiPix(apiConfig)
    apipix.getAccessToken().then(response => {
      expect(response.success).toBe(false)
      expect(response).toHaveProperty('messageError')
      expect(response.messageError).toEqual('canceled')
      done()
    })
    apipix.cancel()
  })

  it('Deveria retornar erro de certificado', done => {
    const cfg = { ...apiConfig, certificate: { path: './any_path' } }
    expect(() => new ApiPix(cfg)).toThrow(TypeError)
    done()
  })
})
