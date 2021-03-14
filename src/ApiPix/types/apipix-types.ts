import { CancelToken, CancelTokenSource } from 'axios'

export interface IApiResult {
  success: boolean
  message?: string
}

export interface IApiPixConfig {
  baseURL?: string
  clientId: string
  clientSecret: string
  timeout?: number
  debug?: boolean
  certificate?: {
    path: string
    passphrase: string
  }
}

export type Values = string | boolean
export type Props<T> = keyof T
// export type Props = keyof IApiPixConfig

export type ApiMethod = 'post' | 'get' | 'put'

export interface ICancelSource {
  idToken: CancelToken | string
  source: CancelTokenSource
}

export interface IGenTxidOptions {
  useMD5Timestamp?: boolean
  namespace?: string
}
