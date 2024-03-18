export interface IColorObj {
  r: number
  g: number
  b: number
  a?: number
}

export default class ColorUtil {
  /**
   * 255颜色值转16进制颜色值
   * @param n 255颜色值
   * @returns hex 16进制颜色值
   */
  static toHex(n: number) {
    return `${n > 15 ? '' : 0}${n.toString(16)}`
  }

  /**
   * 颜色对象转化为16进制颜色字符串
   * @param colorObj 颜色对象
   */
  static toHexString(colorObj: IColorObj) {
    const { r, g, b, a = 1 } = colorObj
    return `#${this.toHex(r)}${this.toHex(g)}${this.toHex(b)}${a === 1 ? '' : this.toHex(Math.floor(a * 255))}`
  }

  /**
   * 颜色对象转化为rgba颜色字符串
   * @param colorObj 颜色对象
   */
  static toRgbaString(colorObj: IColorObj, n = 10000) {
    const { r, g, b, a = 1 } = colorObj
    return `rgba(${r},${g},${b},${Math.floor(a * n) / n})`
  }

  /**
   * 颜色对象转化为rgb颜色字符串
   * @param colorObj 颜色对象
   */
  static toRgbString(colorObj: IColorObj) {
    const { r, g, b } = colorObj
    return `rgb(${r},${g},${b})`
  }

  /**
   * 16进制颜色字符串解析为颜色对象
   * @param color 颜色字符串
   * @returns IColorObj
   */
  static parseHexColor(color: string) {
    let hex = color.slice(1)
    let a = 1
    if (hex.length === 3) {
      hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`
    }
    if (hex.length === 8) {
      a = parseInt(hex.slice(6), 16) / 255
      hex = hex.slice(0, 6)
    }
    const bigint = parseInt(hex, 16)
    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255,
      a
    } as IColorObj
  }

  /**
   * rgba颜色字符串解析为颜色对象
   * @param color 颜色字符串
   * @returns IColorObj
   */
  static parseRgbaColor(color: string) {
    const arr = color.match(/(\d(\.\d+)?)+/g) || []
    const res = arr.map((s: string) => parseInt(s, 10))
    return {
      r: res[0],
      g: res[1],
      b: res[2],
      a: parseFloat(arr[3])
    } as IColorObj
  }

  /**
   * 颜色字符串解析为各种颜色表达方式
   * @param color 颜色字符串
   * @returns IColorObj
   */
  static parseColorString(color: string) {
    if (color.startsWith('#')) {
      return this.parseHexColor(color)
    } else if (color.startsWith('rgb')) {
      return this.parseRgbaColor(color)
    } else if (color === 'transparent') {
      return this.parseHexColor('#00000000')
    }
    throw new Error(`color string error: ${color}`)
  }

  /**
   * 颜色字符串解析为各种颜色表达方式
   * @param color 颜色字符串
   * @returns IColorObj
   */
  static getColorInfo(color: string) {
    const colorObj = this.parseColorString(color)
    const hex = this.toHexString(colorObj)
    const rgba = this.toRgbaString(colorObj)
    const rgb = this.toRgbString(colorObj)
    return {
      hex,
      rgba,
      rgb,
      rgbaObj: colorObj
    }
  }

  /**
   * 16进制颜色字符串转化为rgba颜色字符串
   * @param hex 16进制颜色字符串
   * @returns rgba颜色字符串
   */
  static hexToRgba(hex: string) {
    const colorObj = this.parseColorString(hex)
    return this.toRgbaString(colorObj)
  }

  /**
   * rgba颜色字符串转化为16进制颜色字符串
   * @param rgba rgba颜色字符串
   * @returns 16进制颜色字符串
   */
  static rgbaToHex(rgba: string) {
    const colorObj = this.parseColorString(rgba)
    return this.toHexString(colorObj)
  }
}
