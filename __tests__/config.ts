import { resolve } from 'path'

export const baseDir = process.cwd()

export const configTest = {
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  baseURL: process.env.API_BASE_URL || null,
  certificate: resolve(baseDir, process.env.PATH_CERTIFICATE || 'certificate.p12'),
  pixKey: process.env.MY_PIXKEY
}

export const apiConfig = {
  clientId: configTest.clientId,
  clientSecret: configTest.clientSecret,
  baseURL: configTest.baseURL,
  debug: true,
  certificate: {
    path: configTest.certificate,
    passphrase: ''
  }
}
