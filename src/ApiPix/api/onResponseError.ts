import { IApiResponseError } from '../types/responses-types'

export function onResponseError(error: any): PromiseLike<{ data?: IApiResponseError }> {
  const response = error && error.response
  const statusHttp = response && parseInt(response.status, 10)

  const errorMesage = error ? `${error.code || error.message}` : 'Timeout'

  const data: IApiResponseError = {
    success: false,
    statusHttp: statusHttp || 0,
    messageError: errorMesage,
    responseError: response && response.data ? response.data : {},
    error: error
  }

  if (!response) return Promise.resolve({ data })

  data.messageError = `httpError ${statusHttp}`

  return Promise.resolve({ data })
}
