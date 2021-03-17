export function isDefined(v: any): boolean {
  return !!(v !== null && v !== undefined)
}

export function stringLimit(str: string, limit: number): string {
  return str && str.length > limit ? str.substring(0, limit) : str
}

export function validPixTxid(txid: string): boolean {
  return !!(typeof txid === 'string' && /^[a-zA-Z0-9]{26,35}$/.test(txid))
}

export function validPixValor(valor: string): boolean {
  return !!(typeof valor === 'string' && /\d{1,10}\.\d{2}$/.test(valor))
}

export function replaceAll(str: string, needle?: string | string[], replacement?: string): string {
  if (!str) return ''
  if (Array.isArray(needle)) {
    let rtn = `${str}`
    for (let i = 0; i < needle.length; i++) {
      rtn = replaceAll(rtn, needle[i], replacement)
    }
    return rtn
  }
  return str.split(needle).join(replacement)
}

export function isObject(value: any): boolean {
  return (
    typeof value === 'object' &&
    value !== null &&
    !(value instanceof RegExp) &&
    !(value instanceof Error) &&
    !(value instanceof Date) &&
    !Array.isArray(value)
  )
}

/**
 * Calcula CRC conforme instruções do BACEN. Video do canal WDEV em PHP
 * @function getCRC16WDEV
 * @see https://www.github.com/william-costa/wdev-qrcode-pix-estatico-php
 * @see https://www.youtube.com/watch?v=eO11iFgrdCA
 */
export function getCRC16WDEV(payload: string): string {
  // Dados definidos pelo BACEN
  const polinomio = 0x1021
  let resultado = 0xffff

  // checksum
  const len = String(payload).length
  // if (len > 0) {
  for (let offset = 0; offset < len; offset++) {
    resultado ^= ord(payload[offset]) << 8
    for (let bitwise = 0; bitwise < 8; bitwise++) {
      if ((resultado <<= 1) & 0x10000) resultado ^= polinomio
      resultado &= 0xffff
    }
  }
  // }
  return strtoupper(dechex(resultado))
}
/**
 * Similar ao ```strtoupper``` do PHP. Convert string em caixa alta
 * @function strtoupper
 */
export function strtoupper(str: string): string {
  return `${str}`.toLocaleUpperCase()
}

/**
 * Similar a ```dechex``` do PHP. Converte Decimal para hexadecimal
 * @function dechex
 */
export function dechex(n: number | string): string {
  if (typeof n === 'string') return parseInt(n, 10).toString(16)
  return n.toString(16)
}

/**
 * Similar a ```ord``` do PHP. Converte primeiro char da string em ASCII code
 * @function ord
 * @implements
 * ```str.charCodeAt(0)```
 */
export function ord(str: string): number {
  return `${str}`.charCodeAt(0)
}

/**
 * Converte numero decimal em hexadecimal
 * @function numToHex
 * @see https://github.com/NascentSecureTech/pix-qrcode-utils/blob/master/packages/pix-qrcode/test/web-test/js/pix-qrcode-wrapper.js
 * @implements
 * ```n.toString(16).toUpperCase()```
 */
// export function numToHex(n: number, digits?: number): string {
//   const hex = n.toString(16).toUpperCase()
//   if (digits) {
//     return ('0'.repeat(digits) + hex).slice(-digits)
//   }
//   return hex.length % 2 === 0 ? hex : '0' + hex
// }

/**
 * Gerar CRC a partir de string conforme documentação BACEN
 * @function computeCRC
 * @see https://github.com/bacen/pix-api
 * @see https://github.com/NascentSecureTech/pix-qrcode-utils/blob/master/packages/pix-qrcode/test/web-test/js/pix-qrcode-wrapper.js
 */
// export function computeCRC(str: string, invert = false): string {
//   const bytes = new TextEncoder().encode(str)

//   // prettier-ignore
//   const crcTable = [
//     0, 4129, 8258, 12387, 16516, 20645, 24774, 28903, 33032, 37161, 41290, 45419, 49548, 53677,
//     57806, 61935, 4657, 528, 12915, 8786, 21173, 17044, 29431, 25302, 37689, 33560, 45947, 41818,
//     54205, 50076, 62463, 58334, 9314, 13379, 1056, 5121, 25830, 29895, 17572, 21637, 42346, 46411,
//     34088, 38153, 58862, 62927, 50604, 54669, 13907, 9842, 5649, 1584, 30423, 26358, 22165, 18100,
//     46939, 42874, 38681, 34616, 63455, 59390, 55197, 51132, 18628, 22757, 26758, 30887, 2112, 6241,
//     10242, 14371, 51660, 55789, 59790, 63919, 35144, 39273, 43274, 47403, 23285, 19156, 31415,
//     27286, 6769, 2640, 14899, 10770, 56317, 52188, 64447, 60318, 39801, 35672, 47931, 43802, 27814,
//     31879, 19684, 23749, 11298, 15363, 3168, 7233, 60846, 64911, 52716, 56781, 44330, 48395, 36200,
//     40265, 32407, 28342, 24277, 20212, 15891, 11826, 7761, 3696, 65439, 61374, 57309, 53244, 48923,
//     44858, 40793, 36728, 37256, 33193, 45514, 41451, 53516, 49453, 61774, 57711, 4224, 161, 12482,
//     8419, 20484, 16421, 28742, 24679, 33721, 37784, 41979, 46042, 49981, 54044, 58239, 62302, 689,
//     4752, 8947, 13010, 16949, 21012, 25207, 29270, 46570, 42443, 38312, 34185, 62830, 58703, 54572,
//     50445, 13538, 9411, 5280, 1153, 29798, 25671, 21540, 17413, 42971, 47098, 34713, 38840, 59231,
//     63358, 50973, 55100, 9939, 14066, 1681, 5808, 26199, 30326, 17941, 22068, 55628, 51565, 63758,
//     59695, 39368, 35305, 47498, 43435, 22596, 18533, 30726, 26663, 6336, 2273, 14466, 10403, 52093,
//     56156, 60223, 64286, 35833, 39896, 43963, 48026, 19061, 23124, 27191, 31254, 2801, 6864, 10931,
//     14994, 64814, 60687, 56684, 52557, 48554, 44427, 40424, 36297, 31782, 27655, 23652, 19525,
//     15522, 11395, 7392, 3265, 61215, 65342, 53085, 57212, 44955, 49082, 36825, 40952, 28183, 32310,
//     20053, 24180, 11923, 16050, 3793, 7920
//   ]
//   let crc = 65535
//   for (let i1 = 0; i1 < bytes.length; i1++) {
//     const c = bytes[i1]
//     const j = (c ^ (crc >> 8)) & 255
//     crc = crcTable[j] ^ (crc << 8)
//   }
//   const answer = (crc ^ 0) & 65535
//   const hex = numToHex(answer, 4)
//   if (invert) return hex.slice(2) + hex.slice(0, 2)
//   return hex
// }
