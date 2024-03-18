import { message } from 'antd'
import { parse } from 'opentype.js'

const LczSystemIconUrlList = window?.systemIconUrlList || {
  'lcz-system-icon': 'HappyServer/lczCommon/matrix/icon/lcz-system-icon.woff',
  'lcz-arrow-icon': 'HappyServer/lczCommon/matrix/icon/lcz-select-icon.woff',
  'lcz-state-card-icon': 'HappyServer/lczCommon/matrix/icon/lcz-state-card-icon.woff'
}

type IconConfigType = {
  value?: string
  iconType?: 'system' | 'custom'
  systemfontFamily?: string
  customUrl?: string
}

export default class IconUtils {
  static iconListCache = new Map<string, { family: string; list: any[] } | 'loading'>()
  static accordWithFileType = ['.ttf', '.woff']

  static async getURLFile(iconConfig: IconConfigType): Promise<{ family: string } | undefined> {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this
    const fileUrl = this.getIconFileUrl(iconConfig)

    return new Promise(resolve => {
      ;(async () => {
        let data: any = null

        function runGetData() {
          const data = self.iconListCache.get(fileUrl) || undefined
          if (data === 'loading') {
            requestIdleCallback(runGetData)
          } else {
            resolve(data)
          }
        }

        if (this.iconListCache.has(fileUrl)) {
          runGetData()
        } else {
          this.iconListCache.set(fileUrl, 'loading')
          try {
            const lowUrl = fileUrl.toLowerCase(),
              accordWith = this.accordWithFileType.some(item => lowUrl.includes(item))

            if (accordWith) {
              data = await this.loadFileData(fileUrl)
            } else {
              this.iconListCache.delete(fileUrl)
              throw new Error('无效的图标链接')
            }

            if (data) {
              this.setIconStyle(fileUrl, data)
              this.iconListCache.set(fileUrl, data)
              resolve(data)
            }
          } catch (error) {
            this.iconListCache.delete(fileUrl)
            this.warnMessage()
          }
        }
      })()
    })
  }

  static getIconInfo(iconConfig: IconConfigType) {
    const fileUrl = this.getIconFileUrl(iconConfig)
    const info = this.iconListCache.get(fileUrl)
    return info && info !== 'loading' ? info : { family: 'lcz-system-icon' }
  }

  private static getIconFileUrl(iconConfig: IconConfigType) {
    const { iconType = 'system', systemfontFamily = 'lcz-system-icon', customUrl } = iconConfig
    const sysUrl = LczSystemIconUrlList[systemfontFamily]
    return iconType === 'system' ? sysUrl : customUrl || sysUrl
  }

  private static async loadFileData(fileUrl: string) {
    const res = await this.ajax(fileUrl)
    return this.parseIcon(res)
  }

  private static parseIcon(bufferStr: any) {
    const result = parse(bufferStr),
      family = result?.names?.fontFamily?.en || ''

    return { family }
  }

  private static setIconStyle(fileUrl: string, { family = '' }: any) {
    const nodeId = `lcz-icon-${fileUrl}`
    let $style = document.getElementById(nodeId)
    if ($style) return true
    $style = document.getElementById(nodeId) || document.createElement('style')
    $style.setAttribute('id', nodeId)
    $style.innerHTML = `
        @font-face {
          font-family: '${family}';
          src: url('${fileUrl}') format('truetype');
        }
        .${family} {
          font-family: "${family}" !important;
          font-size: 24px;font-style: normal;
          -webkit-font-smoothing: antialiased;
          -webkit-text-stroke-width: 0.2px;
          -moz-osx-font-smoothing: grayscale;
        }`

    document.body.append($style)
  }

  private static ajax(fileUrl: string) {
    return new Promise((resolve, reject) => {
      fetch(fileUrl)
        .then((response: any) => {
          if (response.status === 200) {
            return response.arrayBuffer()
          } else {
            return response.json()
          }
        })
        .then(content => {
          resolve(content)
        })
        .catch(err => {
          reject(err)
        })
    })
  }

  private static warnMessage() {
    message.warning({ content: '无效的图标链接', className: 'lcz-com-dark-message' })
  }
}
