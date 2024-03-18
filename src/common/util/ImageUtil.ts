export type ImageInfo = {
  w: number
  h: number
  w_h: number
  h_w: number
}

type imageMapType = ImageInfo | 'loading'
const defaultResolve = { w: 100, h: 100 }
export default class ImageUtil {
  private static imagesMap = new Map<string, imageMapType>()

  static getImageInfo(url: string): Promise<ImageInfo> {
    return new Promise(resolve => {
      try {
        if (this.has(url)) {
          this.loadImageInfo(url, resolve)
        } else {
          this.imagesMap.set(url, 'loading')

          const image = new Image()
          image.src = url
          image.onload = () => {
            this.setMapInfos(url, { w: image.width, h: image.height }, resolve)
          }
          image.onerror = () => {
            this.setMapInfos(url, defaultResolve, resolve)
          }
        }
      } catch {
        this.setMapInfos(url, defaultResolve, resolve)
      }
    })
  }

  private static setMapInfos(url: string, info: { w: number; h: number }, resolve) {
    const { w, h } = info,
      w_h = +(w / h).toFixed(2),
      h_w = +(h / w).toFixed(2),
      res = { w, h, w_h, h_w }
    this.imagesMap.set(url, res)
    resolve(res)
  }

  static getCurrentImageInfo(url: string) {
    return this.imagesMap.get(url) as ImageInfo
  }

  private static loadImageInfo(url: string, resolve: (value: ImageInfo) => void) {
    requestIdleCallback(() => {
      const info = this.imagesMap.get(url) as imageMapType
      if (!this.isLoading(info)) {
        resolve(info as ImageInfo)
      } else {
        this.loadImageInfo(url, resolve)
      }
    })
  }

  private static isLoading(info: imageMapType) {
    return info === 'loading'
  }

  private static has(url) {
    return this.imagesMap.has(url)
  }
}
