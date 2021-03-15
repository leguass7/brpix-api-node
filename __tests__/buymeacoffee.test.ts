import fs from 'fs'
import { QRCodePayload } from '../src'
import { resolve } from 'path'
import { baseDir } from './config'

describe('Me pague um café', () => {
  const codePayload = new QRCodePayload()
  beforeAll(() => {
    codePayload.set({
      txid: 'GITBUYMEACOFFEEAPIPIXV011',
      merchantCity: 'Fortaleza',
      merchantName: 'Leandro Sbrissa',
      pixKey: 'leandro.sbrissa@hotmail.com',
      uniquePayment: false,
      isStatic: true,
      description: 'Cafe para o DEV',
      amount: '3.50'
    })
  })

  it('Deveria gerar qrcode estático', async () => {
    const strCode = codePayload.getPayload()
    const savePath = resolve(baseDir, '.github', 'qrcode.png')

    expect(typeof strCode === 'string').toBe(true)
    await codePayload.save(savePath, {
      width: 400,
      type: 'png',
      errorCorrectionLevel: 'H',
      margin: 1
    })
    expect(fs.existsSync(savePath)).toBe(true)
  })
})
