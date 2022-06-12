import { readFileSync } from 'fs'
import { ApiPix } from '../src'
import { apiConfig, configTest } from './config'

describe('Teste de classe ApiPix', () => {
  it('Deveria iniciar e adquirir token de acesso', async done => {
    const base64 = readFileSync(configTest.certificate, { encoding: 'base64' })
    const buffer = Buffer.from(base64, 'base64')

    const apipix = new ApiPix({ ...apiConfig, certificate: { path: buffer, passphrase: '' } })
    expect(apipix).toBeInstanceOf(ApiPix)

    const response = await apipix.init()
    expect(response).toHaveProperty('accessToken')
    expect(typeof response.accessToken === 'string').toBe(true)
    expect(response.accessToken.length).toBeGreaterThan(16)
    expect(response.tokenType).toEqual('Bearer')
    done()
  })
})
