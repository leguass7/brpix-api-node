import { AxiosRequestConfig } from 'axios'

export interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  decamelcase?: boolean
}

export interface IRequestCreateImmediateCharge {
  calendario: {
    expiracao: number
  }
  devedor: {
    cpf?: string
    cnpj?: string
    nome?: string
  }
  valor: {
    original: string
  }
  /** chave PIX do recebedor */
  chave?: string
  /** max 140 characters */
  solicitacaoPagador: string
  infoAdicionais?: { name: string; valor: string }[]
}
