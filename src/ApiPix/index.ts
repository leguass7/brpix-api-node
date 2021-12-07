import axios, { AxiosInstance, CancelToken, CancelTokenSource, CancelTokenStatic } from 'axios'
import https from 'https'
import fs from 'fs'
import { v4 as uuidV4, v5 as uuidV5 } from 'uuid'
import { createHash } from 'crypto'
// import md5 from 'md5'

import camelcaseKeys from 'camelcase-keys'
import adapter from 'axios/lib/adapters/http' // important
import { onResponseError } from './api/onResponseError'

import decamelcase from '../helpers/decamelcase'
import {
  ApiMethod,
  IApiPixConfig,
  ICancelSource,
  IGenTxidOptions,
  Props,
  Values
} from './types/apipix-types'
import type {
  ApiResult,
  IResponseAccessToken,
  IResponseCob,
  IResponseQrcode,
  IUseQRCode,
  UseQRCodeParams
} from './types/responses-types'
import { CustomAxiosRequestConfig, IRequestCreateImmediateCharge } from './types/requests-types'
import { isDefined, isObject, replaceAll } from '../helpers'
import QRCodePayload from './QRCodePayload'

function getDefaultBaseURL(dev: boolean, baseURL: string): string {
  if (baseURL) return baseURL
  const isDev = isDefined(dev) ? !!dev : false
  return isDev ? 'https://api-pix-h.gerencianet.com.br' : 'https://api-pix.gerencianet.com.br'
}

class ApiPix {
  private config: IApiPixConfig
  private logPrefix: string
  private Api: AxiosInstance
  private cancelSources: ICancelSource[]
  private Agent: https.Agent
  public token: string

  constructor(config: IApiPixConfig) {
    this.logPrefix = 'ApiPix'
    this.Api = null
    this.cancelSources = []
    this.Agent = null
    this.token = ''

    const { dev, baseURL } = config
    this.config = {
      timeout: 3000,
      debug: false,
      baseURL: getDefaultBaseURL(dev, baseURL)
    } as IApiPixConfig

    this.set({ ...config, baseURL: getDefaultBaseURL(dev, baseURL) }).configureAxios()
  }

  public logging(...args: any[]): void {
    // eslint-disable-next-line no-console
    if (this.config.debug) console.log(this.logPrefix, ...args)
  }

  private configureAxios(): this {
    this.Api = axios.create({
      baseURL: this.config.baseURL,
      timeout: this.config.timeout || 10000,
      adapter // important
    })

    this.Api.defaults.headers = {
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      Expires: '0',
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
    return this.configureRequests().configureResponses().setAgentSSL()
  }

  private configureRequests(): this {
    this.Api.interceptors.request.use((config: CustomAxiosRequestConfig) => {
      if (config.data && config.decamelcase) config.data = decamelcase(config.data)
      this.logging(`REQUEST ${config.method}: (${config.baseURL}${config.url})`, config.data)
      return config
    })
    return this
  }

  private configureResponses(): this {
    this.Api.interceptors.response.use(response => {
      const data = response && response.data
      const payload = {
        status: response.status || response.data.status,
        success: !!(response.status && !response.data.error),
        data: data ? camelcaseKeys(data, { deep: true }) : {}
      }

      this.logging(`RESPONSE: (${response.config.baseURL}${response.config.url})`, data)
      return { ...response, ...payload }
    }, onResponseError)
    return this
  }

  private loadCertificate(options?: https.AgentOptions): https.Agent {
    const createAgent = (config: https.AgentOptions): https.Agent => {
      try {
        const agent = new https.Agent(config)
        return agent
      } catch (error) {
        throw new TypeError(`Erro de certificado: ${error}`)
      }
    }

    if (options) {
      return createAgent(options)
    } else if (this.config.certificate) {
      const { path, passphrase } = this.config.certificate
      if (fs.existsSync(path)) {
        return createAgent({ passphrase, pfx: fs.readFileSync(path) })
      }
      throw new TypeError(`Caminho do certificado: ${path}`)
    }
    return null
  }

  private setAgentSSL(options?: https.AgentOptions): this {
    if (this.config.certificate) {
      const agent = this.loadCertificate(options)
      if (agent) {
        this.Agent = agent
        this.Api.defaults.httpsAgent = agent
        return this
      }
    }
    return this
  }

  /**
   * Adquiri token de acesso na API
   * @method getAccessToken
   */
  public async getAccessToken(): Promise<IResponseAccessToken> {
    const { clientId, clientSecret } = this.config

    const data = { grantType: 'client_credentials' }
    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

    const source = this.getCancelToken().source()
    const cancelToken = source.token
    this.addCancelSource(source)

    const config: CustomAxiosRequestConfig = {
      cancelToken,
      headers: { Authorization: `Basic ${auth}` },
      httpsAgent: this.Agent, // important
      decamelcase: true
    }

    const result = await this.Api.post<IResponseAccessToken>('/oauth/token', data, config)

    this.removeCancelSource(cancelToken)

    if (result && result.data) {
      const token = result.data.accessToken || ''
      this.token = token
      return result && result.data
    }

    throw new TypeError('Erro ao adquirir token de acesso')
  }

  private getCancelToken(): CancelTokenStatic {
    return axios.CancelToken
  }

  private removeCancelSource(idTokenSource?: CancelToken): this {
    if (idTokenSource) {
      const newList = this.cancelSources.filter(({ idToken }) => idToken !== idTokenSource)
      this.cancelSources = newList || []
      return this
    }
    this.cancelSources = []
    return this
  }

  private addCancelSource(source: CancelTokenSource): this {
    this.cancelSources.push({
      idToken: source.token,
      source
    })
    return this
  }

  /**
   * Configura classe ApiPix
   * @method set
   */
  public set(prop: IApiPixConfig | Props<IApiPixConfig>, value?: Values): this {
    if (isObject(prop)) Object.keys(prop).forEach(k => (this.config[k] = prop[k]))
    else this.config[prop as string] = value
    return this
  }

  /**
   * Inicia classe adquirindo token de acesso na API
   * @method init
   */
  public async init(): Promise<IResponseAccessToken> {
    const response = await this.getAccessToken()
    return response
  }

  /**
   * Cancela todas as requisições em andamento
   * @method cancel
   */
  public cancel(): this {
    this.cancelSources.forEach(({ source }) => {
      source && source.cancel('canceled')
    })
    this.removeCancelSource()
    return this
  }

  /**
   * Realiza uma requisição na API
   * @method requestApi
   */
  public async requestApi<TReturn = { data: any }>(
    method: ApiMethod,
    endpoint: string,
    payload?: {},
    options?: CustomAxiosRequestConfig
  ): Promise<TReturn> {
    const source = this.getCancelToken().source()
    const cancelToken = source.token
    this.addCancelSource(source)

    if (!this.token) await this.getAccessToken()
    const { decamelcase, ...restOptions } = options || {}
    const requestOptions: CustomAxiosRequestConfig =
      options && restOptions
        ? { ...options, cancelToken }
        : {
            cancelToken,
            headers: { Authorization: `Bearer ${this.token}` },
            decamelcase: !!decamelcase
          }

    const requestArgs = [endpoint, payload, requestOptions].filter(f => !!f)
    const result = await this.Api[method.toLocaleLowerCase()](...requestArgs)

    this.removeCancelSource(cancelToken)
    return result
  }

  /**
   * Gerar txid automatico
   * - baseado em ```uuid``` or ```md5```
   * @method txidGenerate
   */
  public txidGenerate(options?: IGenTxidOptions): string {
    if (options && options.useMD5Timestamp) {
      const timestamp = (+new Date()).toString(16)
      return createHash('md5').update(`${this.config.baseURL}${timestamp}`).digest('hex')
    }
    const namespace = (options && options.namespace) || uuidV4()
    return replaceAll(uuidV5(this.config.baseURL, namespace), '-', '')
  }

  /**
   * Cria uma instancia de QRCodePayload da cobrança
   * @method createQRCodePayload
   */
  public createQRCodePayload(
    cob: IResponseCob,
    adicionalData?: Omit<UseQRCodeParams, 'width'>
  ): QRCodePayload {
    const { pixKey, merchantName, merchantCity, isStatic } = adicionalData
    const pix = cob.chave || pixKey || this.config?.pixKey
    return new QRCodePayload({
      pixKey: pix,
      amount: cob.valor.original,
      txid: cob.txid,
      uniquePayment: true,
      url: cob.location,
      merchantName,
      merchantCity,
      isStatic: !!(pixKey && isStatic)
    })
  }

  /**
   * Cria uma cobrança PIX
   * - Se ```txid``` não informado, gera automaticamente (uuid)
   * @method createCob
   */
  public async createCob(
    payload: IRequestCreateImmediateCharge,
    txid?: string
  ): Promise<IResponseCob> {
    const id = txid || this.txidGenerate()
    const chave = payload.chave || this.config.pixKey

    if (!chave) throw new TypeError('chave pix n\u00e3o est\u00e1 presente')

    const response = await this.requestApi<ApiResult>('put', `/v2/cob/${id}`, { ...payload, chave })

    const data = response && (response.data as IResponseCob)

    if (data && !data.error) {
      data.useQRCode = async (config = {}): Promise<IUseQRCode> => {
        const { width, ...rest } = config
        const qrcode = this.createQRCodePayload(data, { ...rest })
        return {
          base64: await qrcode.getQRCode(width),
          payload: qrcode.getPayload()
        }
      }
    }

    return data
  }

  /**
   * Requisitar Qrcode por Location
   * @method qrcodeByLocation
   */
  public async qrcodeByLocation(locationId: string | number): Promise<IResponseQrcode> {
    const response = await this.requestApi<ApiResult>('get', `/v2/loc/${locationId}/qrcode`)
    return response && response.data
  }

  /**
   * Consulta uma cobrança PIX
   * @method consultCob
   */
  public async consultCob(txid: string): Promise<IResponseCob> {
    const response = await this.requestApi('get', `/v2/cob/${txid}`)
    return response && response.data
  }
}

export default ApiPix
