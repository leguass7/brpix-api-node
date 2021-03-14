import { isObject } from '.'

export function decamelcaseStr(text: string, separator = '_'): string {
  if (typeof text === 'string') {
    return text
      .replace(/([\p{Lowercase_Letter}\d])(\p{Uppercase_Letter})/gu, `$1${separator}$2`)
      .replace(
        /(\p{Uppercase_Letter}+)(\p{Uppercase_Letter}\p{Lowercase_Letter}+)/gu,
        `$1${separator}$2`
      )
      .toLowerCase()
  }
  return text
}

function mapObject<T>(obj: {}): T {
  const ret = {} as T
  Object.keys(obj).forEach(key => {
    const k = decamelcaseStr(key)
    ret[k] = isObject(obj[key]) ? mapObject(obj[key]) : obj[key]
  })
  return ret
}

export default function decamelcase<T>(input: any): T {
  if (Array.isArray(input)) {
    // @ts-ignore
    return input.map(obj => decamelcase(obj))
  }
  if (!isObject(input)) return decamelcaseStr(`${input}`) as T & string
  return mapObject(input)
}
