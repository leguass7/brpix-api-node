export interface ApiResult {
  /** Status HTTP */
  statusHttp: number
  success: boolean
  data?: any
}

export interface IApiResponseError extends Omit<ApiResult, 'data'> {
  messageError?: string
  /** Resposta do servidor */
  responseError?: {} | { erros: any[] }
  error?: string
}

export interface IResponseAccessToken extends Omit<ApiResult, 'data'> {
  accessToken?: string
  tokenType?: string
  expiresIn?: number
  scope?: string
}

type CobStatus = 'ATIVA' | 'CONCLUIDA' | 'REMOVIDA_PELO_USUARIO_RECEBEDOR' | 'REMOVIDA_PELO_PSP'
export interface PayloadCob {
  txid: string
  calendario: {
    criacao: string
    apresentacao?: string
    dataDeVencimento?: string
    validadeAposVencimento?: string
    expiracao: number
  }
  revisao?: number
  location: string
  status: CobStatus
  devedor: {
    cpf?: string
    cnpj?: string
    nome?: string
  }
  valor: {
    original: string
    final?: string
    multa?: string
    abatimento?: string
    desconto?: string
    juros?: string
  }
  solicitacaoPagador: string
  infoAdicionais?: { nome: string; valor: string }[]
  recebedor?: {
    cpf?: string
    cnpj?: string
    nome?: string
    nomeFantasia?: string
    logradouro?: string
    cidade?: string
    uf?: string
    cep?: string
  }
  loc: {
    id: number
    location: string
    tipoCob: 'cob' | 'cobv'
    criacao: string
  }
}

export interface IResponseCob extends IApiResponseError {
  txid: string
  calendario: {
    criacao: string
    expiracao: number
  }
  revisao: number
  loc: {
    id: number
    location: string
    tipoCob: string
    criacao: string
  }
  status: CobStatus
  location: string
  devedor: {
    cpf?: string
    cnpj?: string
    nome?: string
  }
  valor: {
    original: string
  }
  chave: string
  solicitacaoPagador: string
  infoAdicionais?: { nome: string; valor: string }[]
}
