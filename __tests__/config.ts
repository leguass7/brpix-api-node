import { resolve } from 'path'
import { IApiPixConfig } from '../src'

export const baseDir = process.cwd()

export const configTest = {
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  baseURL: process.env.API_BASE_URL,
  certificate: resolve(baseDir, process.env.PATH_CERTIFICATE),
  pixKey: process.env.MY_PIXKEY
}

export const apiConfig: IApiPixConfig = {
  dev: true, // importante para testes
  clientId: configTest.clientId,
  clientSecret: configTest.clientSecret,
  baseURL: configTest.baseURL,
  // debug: true,
  certificate: {
    path: configTest.certificate,
    passphrase: ''
  }
}
