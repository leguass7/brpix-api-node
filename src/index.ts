export { default as ApiPix } from './ApiPix'

export type {
  ApiMethod,
  IApiPixConfig,
  IApiResult,
  ICancelSource,
  Props
} from './ApiPix/types/apipix-types'
export type {
  CustomAxiosRequestConfig,
  IRequestCreateImmediateCharge
} from './ApiPix/types/requests-types'
export type {
  IApiResponseError,
  IResponseAccessToken,
  IResponseCob,
  IResponseQrcode
} from './ApiPix/types/responses-types'

export { default as QRCodePayload } from './ApiPix/QRCodePayload'
export type { IQRCodePayload, IdKeys } from './ApiPix/QRCodePayload/payload-types'

export { validPixTxid, validPixValor, replaceAll, dechex, stringLimit } from './helpers'

export { default as decamelcase } from './helpers/decamelcase'

// verificar erros na versão 12.14.0 do nodejs
