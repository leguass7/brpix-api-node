import { CancelToken, CancelTokenSource } from 'axios'

export interface IApiResult {
  success: boolean
  message?: string
}

export interface IApiPixConfig {
  clientId: string
  clientSecret: string
  baseURL?: string
  /** default pixKey */
  pixKey?: string
  dev?: boolean
  timeout?: number
  debug?: boolean
  certificate?: {
    path: string | Buffer
    passphrase: string
  }
}

export type Values = string | boolean
export type Props<T> = keyof T
// export type Props = keyof IApiPixConfig

export type ApiMethod = 'post' | 'get' | 'put' | 'patch'

export interface ICancelSource {
  idToken: CancelToken | string
  source: CancelTokenSource
}

export interface IGenTxidOptions {
  useMD5Timestamp?: boolean
  namespace?: string
}
