import { InstagramPost } from 'app/models/InstagramPost'
import { CanvasFont, RGBColor } from 'app/models/interfaces'

const BLOG_POST_IMG_WIDTH = 440 * 1.4
const BLOG_POST_IMG_HEIGHT = 220 * 1.4

function hslToString(color: RGBColor | string): string {
  if (typeof color === 'string') {
    return color as string
  }
  const { r, g, b, a } = color as RGBColor
  return `rgba(${r}, ${g}, ${b}, ${a})`
}

function getImageSize(
  canvasWidth: number,
  canvasHeight: number,
  imgWidth: number = BLOG_POST_IMG_WIDTH,
  imgHeight: number = BLOG_POST_IMG_HEIGHT
) {
  //     const BLOG_POST_IMG_WIDTH = 440;
  // const BLOG_POST_IMG_HEIGHT = 220;

  if (canvasWidth > imgWidth) {
    return { width: imgWidth, height: imgHeight }
  }

  const width = imgWidth * (100 / canvasWidth)
  const height = imgHeight * (100 / canvasHeight)
  return { width, height }
}

export default class CanvasManager {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  em: number
  currentConfig: InstagramPost
  footerStart: number

  constructor(canvas: HTMLCanvasElement, currentConfig: InstagramPost) {
    this.canvas = canvas
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.ctx = canvas.getContext('2d')!
    this.em = parseFloat(getComputedStyle(canvas).fontSize)
    this.currentConfig = currentConfig
    const { height } = this.getScaledSize()
    this.footerStart = height - 4 * this.em
  }

  get footerTextStart() {
    return this.footerStart / this.em + 2
  }

  drawBackground() {
    const { ctx } = this
    const { width, height } = this.getScaledSize()

    const rp = width / 100

    const x0 = width / 2
    const y0 = height / 2
    const r0 = rp * 37
    const x1 = x0
    const y1 = y0
    const r1 = rp * 80
    const grd = ctx.createRadialGradient(x0, y0, r0, x1, y1, r1)
    grd.addColorStop(0, 'rgba(149,239,255,1)')
    grd.addColorStop(1, 'rgba(0,239,255,1)')

    ctx.fillStyle = grd
    ctx.fillRect(0, 0, width, height)

    ctx.fillStyle = '#006377'
    ctx.fillRect(0, this.footerStart, width, height)

    ctx.fillRect(0, 0, width, 3 * this.em)
  }

  drawGrid({ rem, color }: { rem: number; color: string }) {
    const { ctx } = this
    const { width, height } = this.getScaledSize()

    for (let i = 0; i < height; i += 1) {
      //for (let j = 0; j < width; j++) {
      const w = width - rem * 2
      const xi = rem
      const yi = i * rem
      ctx.strokeStyle = color
      ctx.rect(xi, yi, w, rem)
      ctx.stroke()
      //}
    }

    for (let i = 0; i < height; i += 1) {
      //for (let j = 0; j < width; j++) {
      const h = height - rem * 2
      const xi = i * rem
      const yi = rem
      ctx.strokeStyle = color
      ctx.rect(xi, yi, rem, h)
      ctx.stroke()
      //}
    }
  }

  drawTopLink({
    xem,
    yem,
    heightEm,
    font,
    isOutlineVisible = false,
  }: {
    xem: number
    yem: number
    heightEm: number
    font: CanvasFont
    isOutlineVisible: boolean
  }) {
    const { ctx, em } = this
    const { width } = this.getScaledSize()

    const w = width - xem * em * 2
    const xi = xem * em
    const yi = yem * em

    ctx.strokeStyle = hslToString(font.color)
    if (isOutlineVisible) {
      ctx.strokeRect(xi, yi, w, heightEm * em)
    }

    ctx.fillStyle = hslToString(font.color)
    ctx.font = font.toString()

    ctx.fillText('pedromarquez.dev', xi, yi + em, width)
  }

  getLines({
    text,
    maxWidth,
    font,
  }: {
    text: string
    maxWidth: number
    font?: CanvasFont
  }) {
    const { ctx } = this

    const words = text.split(' ')
    const lines = []
    let currentLine = words[0]

    const preFont = ctx.font

    if (font != null) {
      ctx.font = font.toString()
    }

    for (let i = 1; i < words.length; i++) {
      const word = words[i]
      const width = ctx.measureText(currentLine + ' ' + word).width
      if (width < maxWidth) {
        currentLine += ' ' + word
      } else {
        lines.push(currentLine)
        currentLine = word
      }
    }
    lines.push(currentLine)
    ctx.font = preFont
    return lines
  }

  drawText({
    text,
    xem,
    yem,
    font,
    isOutlineVisible = false,
  }: {
    text: string
    xem: number
    yem: number
    font: CanvasFont
    isOutlineVisible: boolean
  }) {
    const { ctx, em } = this
    const { width } = this.getScaledSize()

    const xi = xem * em
    const yi = yem * em
    const w = width - xi * 2

    ctx.font = font.toString()

    if (font.toString().includes('[object]')) {
      throw Error('Font is not being correctly parsed')
    }
    const lines = this.getLines({ text, maxWidth: w })
    const { lineHeight = 1 } = font

    const h = lines.length * lineHeight * em

    ctx.textBaseline = 'middle'

    if (isOutlineVisible) {
      ctx.beginPath()
      ctx.strokeStyle = hslToString(font.color)
      ctx.strokeRect(xi, yi - (lineHeight / 2) * em, w, h)
      ctx.closePath()
    }

    lines.forEach((line, index) => {
      ctx.beginPath()
      ctx.fillStyle = hslToString(font.color)
      ctx.textAlign = 'center'
      ctx.fillText(line, width / 2, yi + index * lineHeight * em, width)
      ctx.strokeStyle = 'yellow'
      ctx.textAlign = 'start'
      ctx.closePath()
    })

    return yi / em + lines.length * lineHeight
  }

  getScaledImageSize({
    imgHeight,
    imgWidth,
  }: {
    imgHeight?: number
    imgWidth?: number
  }) {
    const { width, height } = this.getScaledSize()
    return getImageSize(width, height, imgWidth, imgHeight)
  }

  drawImage({
    imgRef,
    yem,
    imgWidth,
    imgHeight,
  }: {
    imgRef?: HTMLImageElement | null
    yem: number
    imgWidth?: number
    imgHeight?: number
  }) {
    const { ctx, em } = this
    const { width, height } = this.getScaledSize()
    const { width: imgW, height: imgH } = getImageSize(
      width,
      height,
      imgWidth,
      imgHeight
    )

    const xem = (width - imgW) / 2
    ctx.beginPath()
    if (imgRef) {
      ctx.drawImage(imgRef, xem, yem * em, imgWidth ?? imgW, imgHeight ?? imgH)
    }
    ctx.closePath()
    return yem + imgH / em
  }

  addShadow<T>(renderFn: () => T, styles?: Partial<CanvasShadowStyles>): T {
    const { ctx } = this
    ctx.beginPath()
    const sc = ctx.shadowColor
    const sb = ctx.shadowBlur
    const sox = ctx.shadowOffsetX
    const soy = ctx.shadowOffsetY
    ctx.shadowColor = styles?.shadowColor ?? 'black'
    ctx.shadowBlur = styles?.shadowBlur ?? 6
    ctx.shadowOffsetX = styles?.shadowOffsetX ?? 6
    ctx.shadowOffsetY = styles?.shadowOffsetY ?? 6
    const res = renderFn()
    ctx.shadowColor = sc
    ctx.shadowBlur = sb
    ctx.shadowOffsetX = sox
    ctx.shadowOffsetY = soy
    ctx.closePath()
    return res
  }

  getImage() {
    return this.canvas.toDataURL('image/png')
  }

  getScaledSize() {
    const { currentConfig } = this
    const { width, height } = currentConfig

    // if (window.devicePixelRatio) {
    //   const result = {
    //     width: width * window.devicePixelRatio,
    //     height: height * window.devicePixelRatio,
    //     styleWidth: width,
    //     styleHeight: height,
    //   };
    //   return result;
    // }

    return {
      width,
      height,
      styleWidth: width,
      styleHeight: height,
    }
  }
}
