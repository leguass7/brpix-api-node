import md5 from 'md5'
import { v4 as uuidV4, v5 as uuidV5 } from 'uuid'
import { apiConfig } from './config'
import { dechex, validPixValor, validPixTxid, replaceAll, decamelcase, stringLimit } from '../src'

describe('Test helpers', () => {
  it('Deveria substituir strings', done => {
    expect(replaceAll('primeiro segundo', ' ')).toEqual('primeiro,segundo')
    expect(replaceAll('primeiro segundo', ' ', '')).toEqual('primeirosegundo')
    expect(replaceAll('primeiro segundo', [' ', 'e'], '')).toEqual('primirosgundo')
    expect(replaceAll('')).toEqual('')
    done()
  })

  it('Deveria validar valor do PIX', done => {
    expect(validPixValor('1.00')).toBe(true)
    expect(validPixValor('1,00')).toBe(false)
    expect(validPixValor('0.45')).toBe(true)
    // @ts-ignore
    expect(validPixValor(0.45)).toBe(false)
    done()
  })

  it('Deveria validar exemplo de ixid', done => {
    const txidMD5 = md5('TESTE')
    const uxidV4 = uuidV4()
    const txidV5 = uuidV5(apiConfig.baseURL, uxidV4)
    expect(validPixTxid(replaceAll(txidMD5, '-', ''))).toBe(true)
    expect(validPixTxid(txidMD5)).toBe(true)

    expect(validPixTxid(uxidV4)).toBe(false)
    expect(validPixTxid(replaceAll(uxidV4, '-', ''))).toBe(true)

    expect(validPixTxid(txidV5)).toBe(false)
    expect(validPixTxid(replaceAll(txidV5, '-', ''))).toBe(true)

    expect(validPixTxid(uxidV4)).toBe(false)

    done()
  })

  it('Deveria descamelizar strings', done => {
    const expected = { test_one: 'test' }
    const expected2 = [{ test_one: 'test1' }, { test_two: 'test2' }]
    const decamelized = decamelcase({ testOne: 'test' }) as {}
    expect(decamelized).toEqual(expect.objectContaining(expected))
    const arr = decamelcase([{ testOne: 'test1' }, { testTwo: 'test2' }]) as typeof expected2

    arr.forEach((obj, i) => {
      expect(obj).toEqual(expect.objectContaining(expected2[i]))
    })

    expect({ ...decamelized, test_one: 'test_one', 1: 'test1' }).toEqual(
      expect.objectContaining({
        test_one: 'test_one',
        1: 'test1'
      })
    )

    done()
  })

  it('Deveria obter hexadecimal de numero', () => {
    expect(dechex('10')).toEqual('a')
    expect(dechex(10)).toEqual('a')
  })

  it('Deveria limitar tamanho da string', () => {
    expect(stringLimit('123456789', 8)).toEqual('12345678')
    expect(stringLimit(uuidV4(), 25).length).toEqual(25)
    expect(stringLimit('', 25)).toEqual('')
  })
})

export {}
