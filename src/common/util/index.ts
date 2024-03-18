import { CSSProperties } from 'react'
import * as d3 from 'd3'

/**
 * @param num 需要补零的数字
 * @param n 需要的长度
 * @returns 补零后的字符串
 */
export function PrefixZero(num: number, n: number) {
  return (Array(n).join('0') + num).slice(-n)
}

/**
 * 数值四舍五入
 * @param number 值
 * @param decimal 保留位数
 * @returns
 */
export function numberRound(number: number, decimal: number) {
  let f = parseFloat(String(number))
  if (isNaN(f)) {
    return f
  }
  f = Math.round(number * Math.pow(10, decimal)) / Math.pow(10, decimal) // n幂
  let s = f.toString()
  let rs = s.indexOf('.')
  //判定如果是整数，增加小数点再补0
  if (rs < 0) {
    rs = s.length
    s += '.'
  }
  while (s.length <= rs + decimal) {
    s += '0'
  }

  if (s.indexOf('.') === s.length - 1) {
    s = s.slice(0, -1)
  }

  return s
}

/**
 * 将数值格式化成金额形式
 * @param num 数值(Number或者String)
 * @param precision 精度，默认不变
 * @param separator 分隔符，默认为逗号
 * @param numberbits 数据位数
 * @param rounding 是否开启四舍五入
 * @return 金额格式的字符串,如'1,234,567'，默认返回NaN
 * @type String
 */
export function formatNumber(
  num: any | string,
  precision?: number,
  separator?: string,
  digit?: number,
  numberbits?: number,
  rounding?: boolean
): string {
  num = Math.abs(num)
  let parts: any[] = []
  digit = (digit || 0) < 0 ? 0 : digit
  numberbits = numberbits || 0

  // 判断是否为数字
  if (!isNaN(parseFloat(num)) && isFinite(num)) {
    num = Number(num)

    if (typeof precision !== 'undefined') {
      if (rounding) {
        num = numberRound(num, precision)
      } else {
        num = parseFloat(((num * Math.pow(10, precision)) / Math.pow(10, precision)).toString())
          .toFixed(precision + 1)
          .slice(0, -1)
        if (precision === 0) num = String(Number(num))
      }
    }

    parts = num.split('.')

    const regExp = new RegExp(`(\\d)(?=(\\d{${digit}})+(?!\\d))`, 'g')
    const regExp2 = new RegExp(`\\${separator}` || ',', 'g')

    // 补零操作
    if (numberbits > 0) {
      const numStr = parts[0].replace(regExp2, '')
      if (numStr.length > numberbits) {
        parts[0] = parts[0].slice(-numberbits)
        parts[0] = digit === 0 ? parts[0] : parts[0].toString().replace(regExp, '$1' + (separator || ','))
      } else {
        parts[0] = digit === 0 ? parts[0] : parts[0].toString().replace(regExp, '$1' + (separator || ','))
        const patch = parts[0].match(regExp2)
        parts[0] =
          patch && patch.length > 0 ? PrefixZero(parts[0], numberbits + patch.length) : PrefixZero(parts[0], numberbits)
      }
    } else {
      parts[0] = digit === 0 ? parts[0] : parts[0].toString().replace(regExp, '$1' + (separator || ','))
    }
    return parts.join('.')
  }

  return num + ''
}

// 将rgb表示方式转换为hex表示方式
export const colorHex = function (rgb) {
  const _this = rgb
  const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6}|[0-9a-fA-f]{8})$/
  if (/^(rgb|RGB|rgba|RGBA)/.test(_this)) {
    const aColor = _this.replace(/(?:\(|\)|rgb|RGB|a|A)*/g, '').split(',')

    let strHex = '#'
    for (let i = 0; i < aColor.length; i++) {
      let hex
      if (i <= 2) {
        hex = Number(aColor[i]).toString(16)
      } else {
        hex = (aColor[i] * 255).toString(16).split('.')[0]
      }

      hex = +hex < 10 ? 0 + '' + hex : hex // 保证每个rgb的值为2位
      if (hex === '0') {
        hex += hex
      }
      strHex += hex
    }

    if (strHex.length !== 9) {
      strHex = _this
    }
    return strHex
  } else if (reg.test(_this)) {
    const aNum = _this.replace(/#/, '').split('')
    if (aNum.length === 6) {
      return _this
    } else if (aNum.length === 3) {
      let numHex = '#'
      for (let i = 0; i < aNum.length; i += 1) {
        numHex += aNum[i] + aNum[i]
      }
      return numHex
    }
  } else {
    return _this
  }
}

/**
 * 颜色格式 hex 转 rgba
 * @param bgColor
 * @returns rgba(....)
 */
export const hexToRgba = (bgColor: string, opacity?: number): string => {
  const color = bgColor.slice(1)
  opacity = opacity?.toString() ? opacity : 0.85
  const rgba = [
    parseInt('0x' + color.slice(0, 2)),
    parseInt('0x' + color.slice(2, 4)),
    parseInt('0x' + color.slice(4, 6)),
    opacity
  ]
  return 'rgba(' + rgba.toString() + ')'
}

export const rgbaRegX = (bgColor: string, opacity?: number) => {
  opacity = opacity?.toString() ? opacity : 0.85

  if (bgColor[0] === '#') bgColor = hexToRgba(bgColor, 1)

  const rgbRegex = /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/
  const matchArr = bgColor.match(rgbRegex)
  if (matchArr) {
    return `rgba(${matchArr[1]},${matchArr[2]},${matchArr[3]},${opacity})`
  }

  return `rgba(255,255,255,${opacity})`
}

/**
 *
 * @param obj rgba{}
 * @returns rgba(0,0,0,1)
 */
export const forMatRgba = (obj: any): string => {
  const { r, g, b, a } = obj
  return `rgba(${r},${g},${b},${a})`
}

/**
 *
 * @param colorObj 颜色对象
 * @param colorType 颜色类型
 * @returns {color:'rgba()',colorType:xxxx}
 */
export const getColorObj = (
  colorObj: any
): {
  color: string
  colorType: 'single' | 'gradient'
} => {
  try {
    const { selected, gradient, single } = colorObj
    const newObj = { color: '', colorType: selected }
    if (selected === 'gradient') {
      if (gradient?.colors?.length > 1) {
        const colorstr = gradient.colors.map(v => v.value + `${v.begins > 0 ? ' ' + v.begins + '%' : ''}`).join(',')
        newObj['color'] = `${gradient.gradualAngle}deg,  ${colorstr}`
      } else {
        newObj.colorType = 'single'
        newObj['color'] = gradient.colors.map(v => v.value).join(',')
      }
    } else {
      newObj['color'] = single
    }

    return newObj
  } catch (error) {
    return { color: '#3d99fc', colorType: 'single' }
  }
}

/**
 * @param name 随机字符串前缀
 * @returns
 */
export const randomChar = (name?: string): string => {
  const randomStr = Math.random().toString(32).slice(2)
  return (name || '') + randomStr
}

// flex 对齐方式
export const alignType = {
  top: 'flex-start',
  center: 'center',
  bottom: 'flex-end',
  left: 'flex-start',
  right: 'flex-end'
}

// 时间格式化 Monday
export const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
export const abridgeDayName = ['Sun', 'Mon', 'Tues', 'Wed', 'Thur', 'Fri', 'Sat']
export const monName = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
]

/**
 * 解析表达式  '{c1} > 0'
 * @param str 表达式字符串
 * @param target 对象
 * @returns 解析后的得到的值
 */
export const analysisExpression = (
  str: string | boolean | undefined,
  target: any,
  id: string,
  detailType: {
    name: string
    pathArr?: string[]
  }
): any => {
  try {
    const { name = '', pathArr = [] } = detailType || {},
      comType = id.split('_')[0],
      comExpFieldPath = window.configExpressionFields || {},
      currentPaths = comExpFieldPath[comType] || []

    let path = currentPaths.find(item => {
      let _path = item
      if (typeof item !== 'string') _path = item.path
      return _path.includes(name)
    })
    path = (typeof path === 'string' ? path : path?.path) || name

    pathArr.forEach(item => {
      const name = item.split('[')[0]
      path = path.replace(`${name}[]`, item)
    })

    const special = new RegExp('[{}]')
    const FUNC_REGEX = /([A-Za-z0-9_]+[\s]*)[(]/g

    let findFn = false
    if (!special.test(String(str))) {
      String(str).replace(FUNC_REGEX, (match, name) => {
        window.helpFn[name] && (findFn = true)
        return ''
      })
      if (!findFn) return str
    }

    const flag = window.handleExpression(str, target, id, `config/${path}`)
    if (flag === 'Execute Expression Error') return false
    return flag
  } catch (error) {
    console.error(error)
  }
}

/**
 * 动态加载js文件
 * @param scriptArr
 */
export const loadScript = function (scriptArr: any) {
  for (const key in scriptArr) {
    if (Object.prototype.hasOwnProperty.call(scriptArr, key)) {
      if (!document.getElementById(key)) {
        const _script = document.createElement('script')
        _script.setAttribute('id', key)
        _script.setAttribute('defer', 'defer')
        _script.setAttribute('type', 'text/javascript')
        _script.setAttribute('src', scriptArr[key])
        document.getElementsByTagName('head')[0].appendChild(_script)
      }
    }
  }
}

/**
 * 检查当前设备是否是移动端
 * @param set 传入当前
 * @returns
 */
export const resMobile = (set?: any) => {
  if (navigator.userAgent.match(/(iPhone|iPod|Android|ios|iPad)/i)) {
    set && set('mobile')
    return 'mobile'
  } else {
    set && set('pc')
    return 'pc'
  }
}

/**
 * 获取渐变色 css值
 * @param colorObj
 * @returns string
 */
export const colorFunc = colorObj => {
  let color = '#fff',
    colorType: 'single' | 'gradient' = 'single'
  try {
    if (typeof colorObj === 'string') {
      color = colorObj
    } else {
      ;({ color, colorType } = getColorObj(colorObj))
      if (colorType !== 'single') color = `linear-gradient(${color})`
    }
  } catch (error) {
    console.warn(error)
  }
  return { color, colorType }
}

/**
 * 单选设置选中
 * @param data 数据
 * @param type 'index' or 'id
 * @param index
 * @param defaultId
 * @returns
 */

export const checkOption = (
  data: any[],
  type: 'index' | 'id',
  index: { value: number | null },
  defaultId: { value: number | string | null }
) => {
  const _len = data.length
  if (_len === 0) return null
  switch (type) {
    case 'index': {
      const _val: any = index.value
      const _index = isNaN(_val) ? null : _val !== 0 && !_val ? null : _val >= _len ? null : _val
      return _index || _index === 0 ? data[_index]?.id : null
    }
    case 'id': {
      const _find = data.filter(v => v.id == defaultId.value)
      return _find.length > 0 ? String(defaultId.value) : null
    }
    default:
      return null
  }
}

/**
 * 多选选中
 */
export const multipleselec = (
  data: any[],
  type: 'index' | 'id',
  index: { value: string | null },
  defaultId: { value: string | null }
): any[] => {
  if (data.length === 0) return []
  switch (type) {
    case 'index': {
      let _indexArr = String(index.value) ? String(index.value).split(',').map(Number) : []
      _indexArr = _indexArr.filter(v => !isNaN(v))
      const selectIds = data.filter((v, i) => _indexArr.includes(i)).map(_v => _v.id)
      return selectIds
    }
    case 'id': {
      const _idArr = String(defaultId.value) ? String(defaultId.value).split(',') : []
      const selectIds = data.filter(v => _idArr.includes(v.id)).map(_v => _v.id)
      return selectIds
    }
    default:
      return []
  }
}

// 轮播组件 选中id
export const carouselActive = (
  data: any[],
  type: 'index' | 'id',
  index: { value: number },
  defaultId: { value: number | string }
) => {
  let _index = 0
  if (!data?.length) return _index

  switch (type) {
    case 'index': {
      const _val = index.value
      _index = isNaN(_val) ? 0 : _val < 0 ? 0 : _val > data.length - 1 ? data.length - 1 : _val
      break
    }
    case 'id': {
      const _i = data.findIndex(item => item.id == defaultId.value)
      _index = _i >= 0 ? _i : 0
      break
    }
  }
  return _index
}

/**
 * @param props mian
 * @param path string 'xxxx.xxxx.xxx'
 * @returns any
 */
export const getComStyle = (props: any, path: string) => {
  const pathList = path.split('.')
  let obj: any = props
  if (pathList.length === 0) throw new Error('')

  for (let i = 0; i < pathList.length; i++) {
    const p = pathList[i]
    obj = obj?.[p]
  }

  return obj
}

export const loadCompletelyScript = (path: string) => {
  if (!path) return Promise.resolve('not')
  if (document.getElementById('path')) return Promise.resolve('ok')
  return new Promise(resolve => {
    const _script = document.createElement('script') as any
    _script.setAttribute('id', path)
    _script.setAttribute('async', 'async')
    _script.setAttribute('type', 'text/javascript')
    _script.setAttribute('src', path)
    document.getElementsByTagName('head')[0].appendChild(_script)
    _script.onload = _script.onreadystatechange = function () {
      if (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete') {
        resolve('ok')
      } else {
        resolve('not')
      }
    }
    _script.onerror = function () {
      resolve('not')
    }
  })
}

// 格式化子组件 (数组)
export const getChildCompArr = (
  target: any,
  type: string,
  other?: { dataTypes?: any; type?: 'lcz-amap' | 'lcz-3d-area-map' | 'lcz-earth'; filter?: boolean }
) => {
  if (!target?.length) return []

  const filterArr = target.filter(child => {
    const { type: itemType = '', config } = child,
      { show = true, condition = '' } = config || {}
    return itemType === type && show && (condition || condition === '')
  })

  return filterArr.map(v => {
    let vdata = v.data || []
    if (other?.type && ['lcz-amap', 'lcz-3d-area-map', 'lcz-earth'].includes(other.type) && other.filter) {
      vdata = vdata.filter(v => !isNaN(v.lat) && !isNaN(v.lng))
    }
    const data = other?.dataTypes ? conversionData(vdata, other.dataTypes) : vdata
    return Object.assign({ show: true, data, ...v.event, id: v.id, type: v.type }, v.config)
  })
}

//格式化子组件 (单个)
export const getChildComItem = (childComponents, _type) => {
  if (!childComponents?.length) return {}
  const _findempty = childComponents.find(({ type, config }) => {
    const { show = true, condition = '' } = config || {}
    return type === _type && show && condition === ''
  })
  const _find = childComponents.find(({ type, config }) => {
    const { show = true, condition = '' } = config || {}
    return type === _type && show && condition
  })
  const find = _find || _findempty
  if (!find) return {}
  return Object.assign({ show: true, data: find.data, ...find.event, id: find.id, type: find.type }, find.config)
}

export const myiterator = (target: any[]) => {
  if (Array.isArray(target)) {
    return {
      i: function* () {
        for (let i = 0; i < target.length; i++) {
          yield target[i]
        }
      },
      its: function () {
        return this.i()
      }
    }
  }
}

export const replaceStr = (target: string, symbol: string, rep = '') => {
  if (!target) return target
  const strArr = target.split('')
  strArr.forEach((v, i) => {
    if (v === symbol) strArr[i] = rep
  })
  return strArr.join('')
}

/**
 * 检测val的值是否有意义
 * @param val
 * @returns boolean
 */
export const isEmpty = (value: any): boolean => {
  return value !== undefined && value !== null && value !== ''
}

export const isEmptyData = (data: any[]): boolean => {
  let isEmpty = true
  if (data.length === 0) return isEmpty
  if (data.length === 1) {
    const obj = data[0]
    if (obj) isEmpty = !obj.value || isNaN(obj.value)
  } else {
    isEmpty = data.every(item => !item.value || isNaN(item.value))
  }
  return isEmpty
}

/**
 *
 * @param target 原数据
 * @param types 数据类型  {name:'string',value:'number'}
 * @returns 转换后的数据
 */
export const conversionData = (target: any[], types: any) => {
  const fn = {
    string: s => {
      return String(s)
    },
    number: s => {
      return isNaN(s) ? undefined : Number(s)
    },
    boolean: s => {
      return Boolean(s)
    },
    num: s => {
      return isNaN(s) ? 0 : Number(s)
    }
  }
  const data = target.map(item => {
    const _item = { ...item }
    for (const key in types) {
      const type = types[key]
      if (fn[type] && item[key] !== undefined) {
        _item[key] = fn[type](_item[key])
      }
    }
    return _item
  })
  return data
}

/**
 * 获取值在数据范围和尺寸范围的大小
 * @param dataRange 数据范围
 * @param size 尺寸范围
 * @param value 当前的值
 * @returns value 在数据范围中的尺寸大小
 */
export const getSize = (
  dataRange: { min: number; max: number },
  size: { min: number; max: number },
  value: number
): number => {
  if (isNaN(dataRange.min) || isNaN(dataRange.max) || isNaN(size.min) || isNaN(size.max) || isNaN(value)) return 0
  if (+size.min === +size.max || +dataRange.min === +dataRange.max) return size.max
  const step = (+size.max - +size.min) / (+dataRange.max - +dataRange.min)
  return +size.min + step * (+value - +dataRange.min)
}

/**
 * 防抖函数
 * @param fn 函数
 * @param delay 延时时间
 */
export function debounce(fn: any, delay: number) {
  let timeId: NodeJS.Timeout | null = null
  delay = delay || 1000
  return function (this: any, ...args: any) {
    if (timeId) clearTimeout(timeId)
    timeId = setTimeout(() => {
      timeId = null
      fn.apply(this, args)
    }, delay)
  }
}

/**
 * 深克隆
 * @param obj
 * @returns
 */
export function deepClone(obj) {
  const _obj = JSON.stringify(obj),
    objClone = JSON.parse(_obj)
  return objClone
}

/**
 * 比较两个数值的大小
 * @param num1 num1
 * @param num2 num2
 * @returns {min:xxx,max:xxx}
 */
export const compareSize = (num1 = 0, num2 = 0) => {
  return { min: num1 >= num2 ? num2 : num1, max: num1 >= num2 ? num1 : num2 }
}

/**
 * 查询同类型子组件数组  用于监听同种子组件 防止其他类型组件渲染
 * @param comps 子组件列表
 * @param type 子组件类型
 * @returns
 */
export const findChildCom = (childComs, type) => {
  const arr = childComs.filter(item => item.type === type)
  return JSON.stringify(arr)
}

/**
 * 数组去重函数
 * @param target 原数组
 * @param fields 字段数组
 */
export const arrDuplicateRemove = (target: any[], fields: string[] | string) => {
  const fieldArr: string[] = [],
    resolve: any[] = []

  for (let i = 0; i < target.length; i++) {
    const item = target[i]
    let name = ''
    if (Array.isArray(fields)) {
      fields.forEach(v => item[v] && (name += item[v]))
    } else {
      name = item[fields]
    }

    if (!fieldArr.includes(name)) {
      resolve.push(item)
      fieldArr.push(name)
    }
  }

  return resolve
}

/**
 * 匹配换行字符
 */
export const lineFeedReg = new RegExp(/\n|<br\s*\/>/, 'ig')

/**
 * 数值是否为空
 * @param val
 * @returns
 */
export const numberIsEmpty = val => {
  return val !== null && !isNaN(val)
}

/**
 * 判断对象是否为空对象
 */
export const objectIsEmpty = obj => {
  return Object.keys(obj).length === 0
}

// 页面显示隐藏
export const getVisibilityChangeEvent = () => {
  let hiddenProperty = ''
  if ('hidden' in document) {
    hiddenProperty = 'hidden'
  }
  if ('webkitHidden' in document) {
    hiddenProperty = 'webkitHidden'
  }
  if ('mozHidden' in document) {
    hiddenProperty = 'mozHidden'
  }

  return { hiddenProperty, visibilitychange: hiddenProperty.replace(/hidden/i, 'visibilitychange') }
}

/**
 * 为元素添加样式
 * @param target htmlelement
 * @param style style
 */
export const setStyle = (target: HTMLElement, style: CSSProperties = {}) => {
  if (target.nodeType === 1) {
    for (const name in style) {
      target.style[name] = style[name]
    }
  }
}

/**
 * 将字符串以指定长度分割成数组 与指定字符拼接 并返回
 * @param str 字符串
 * @param charts 长度
 * @param separator 连接符
 * @param truncate 是否截断
 * @returns 格式化后的字符串
 */
export const formatStr = (str: string, charts: number, separator = '', truncate = false): string => {
  if (charts > 0) {
    if (!truncate) {
      const len = Math.ceil(str.length / charts),
        res: string[] = []
      for (let i = 0; i < len; i++) {
        res.push(str.slice(i * charts, (i + 1) * charts))
      }
      str = res.join(separator)
    } else {
      str = str.slice(0, charts)
    }
  }
  return str
}

/**
 * 获取单个区间颜色
 * @param start
 * @param end
 * @param value
 * @param param3
 * @returns
 */
export function getSingleSectionColor(start: string, end: string, value = 0, [min, max] = [0, 100]) {
  const computeColor = d3.interpolate(start, end)
  const linear = d3.scale.linear().domain([min, max])
  return computeColor(linear(value))
}

/**
 * 获取区间颜色值
 * @param colors 颜色列表
 * @param section 值的区间
 * @param step  分成多少份
 */
export const getSectionColors = (colors: { begins: number; value: string }[], maxSection = 100, step = 10) => {
  const multiple = maxSection / step
  colors = colors.sort((a, b) => a.begins - b.begins)

  const colorArr: any = []

  for (let i = 0; i < step; i++) {
    const val = i * multiple

    for (let j = 0; j < colors.length - 1; j++) {
      const color = colors[j + 1]
      if (val <= color.begins) {
        const startColor = colors[j].value
        const endColor = color.value
        const min = colors[j].begins
        const max = color.begins

        colorArr.push(getSingleSectionColor(startColor, endColor, val, [min, max]))
        break
      }
    }
  }

  return colorArr
}

/**
 * 兼容小眼睛
 * @param config 眼睛控制所在obj
 * @param code 原来的属性名
 * @param fill 填充的值
 * @returns
 */
export const configDisplayCompatible = (config: any, code = '', fill = false) => {
  config = config || {}
  if (config.display !== undefined) return config.display || false
  return config[code] === undefined ? fill : config[code]
}

/**
 * 比较组件版本
 * @param targetV 当前版本
 * @param nowV 新的版本
 * @returns  是否更新
 */
export function compareVersion(targetV: string, nowV = '1.0') {
  const tv = targetV.split('.')
  const nv = nowV.split('.')
  let up = false
  if (tv[0] > nv[0]) up = true
  if (!up && tv[1] > nv[1]) up = true
  if (!up && (tv[2] || 0) > (nv[2] || 0)) up = true
  return up
}

export function getTextStyle(textStyle?: TextStyle) {
  const { italic = false, ...oStyle } = textStyle || {}
  const style: CSSProperties = oStyle

  italic && (style.fontStyle = 'italic')
  numberIsEmpty(oStyle.lineHeight) && (style.lineHeight = oStyle.lineHeight + 'px')

  return style
}

// 获取数组内的值的最大和最小值
export function getMaxOrMin(data: any[], type = 'value') {
  const v = data.map(v => v[type])
  return { min: Math.min(...v), max: Math.max(...v) }
}
