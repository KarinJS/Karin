/**
 * 液态玻璃效果
 * 基于 Shu Ding (https://github.com/shuding/liquid-glass) 的原始实现
 * 由 ikenxuan 进行修改和优化
 */

import { useRef, useEffect } from 'react'

interface LiquidGlassOptions {
  /** 背景模糊强度 */
  gaussianBlur?: number
  /** 折射强度 */
  scale?: number
  /** 透明度 */
  transparency?: number
  /** 色散强度 */
  dispersion?: number
}

// 工具函数
function smoothStep (a: number, b: number, t: number): number {
  t = Math.max(0, Math.min(1, (t - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

function length (x: number, y: number): number {
  return Math.sqrt(x * x + y * y)
}

function roundedRectSDF (x: number, y: number, width: number, height: number, radius: number): number {
  const qx = Math.abs(x) - width + radius
  const qy = Math.abs(y) - height + radius
  return Math.min(Math.max(qx, qy), 0) + length(Math.max(qx, 0), Math.max(qy, 0)) - radius
}

function texture (x: number, y: number): { x: number; y: number } {
  return { x, y }
}


// 为不同元素类型创建专门的hooks
export const useLiquidGlassButton = (options: LiquidGlassOptions = {}) => {
  return useLiquidGlassGeneric<HTMLButtonElement>(options)
}

export const useLiquidGlassDiv = (options: LiquidGlassOptions = {}) => {
  return useLiquidGlassGeneric<HTMLDivElement>(options)
}

export const useLiquidGlassCard = (options: LiquidGlassOptions = {}) => {
  return useLiquidGlassGeneric<HTMLDivElement>(options)
}

// 通用的液态玻璃hook
function useLiquidGlassGeneric<T extends HTMLElement> (options: LiquidGlassOptions = {}) {
  const elementRef = useRef<T>(null)
  const filterIdRef = useRef<string>('')

  const { gaussianBlur: blurRadius = 2, scale = 20, transparency = 0.1, dispersion = 1 } = options

  useEffect(() => {
    if (!elementRef.current) return

    const element = elementRef.current
    const filterId = `liquid-glass-${Math.random().toString(36).substr(2, 9)}`
    filterIdRef.current = filterId

    // 获取元素尺寸并确保是整数
    const rect = element.getBoundingClientRect()
    const width = Math.floor(Math.max(rect.width, 100))
    const height = Math.floor(Math.max(rect.height, 40))
    const canvasDPI = 1

    // 创建位移贴图的canvas
    const canvas = document.createElement('canvas')
    const canvasWidth = width * canvasDPI
    const canvasHeight = height * canvasDPI
    canvas.width = canvasWidth
    canvas.height = canvasHeight
    canvas.style.display = 'none'
    const context = canvas.getContext('2d')!

    // 生成位移贴图
    const w = canvasWidth
    const h = canvasHeight
    const totalPixels = w * h
    const data = new Uint8ClampedArray(totalPixels * 4)

    let maxScale = 0
    const rawValues: number[] = []

    // Fragment shader逻辑 - 创建四角折射效果
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const uv = { x: x / w, y: y / h }

        // 计算到中心的距离和角落效果
        const ix = uv.x - 0.5
        const iy = uv.y - 0.5

        // 使用roundedRectSDF创建圆角矩形的距离场
        const distanceToEdge = roundedRectSDF(
          ix,
          iy,
          0.35,  // 宽度
          0.25,  // 高度
          0.4    // 圆角半径
        )

        // 创建边缘折射效果 - 主要影响四个角
        const displacement = smoothStep(0.6, 0, distanceToEdge - 0.1)
        const scaled = smoothStep(0, 1, displacement)

        // 计算位移
        const pos = texture(ix * scaled + 0.5, iy * scaled + 0.5)
        const dx = pos.x * w - x
        const dy = pos.y * h - y

        maxScale = Math.max(maxScale, Math.abs(dx), Math.abs(dy))
        rawValues.push(dx, dy)
      }
    }

    maxScale *= 0.5

    // 将位移值转换为颜色数据
    let rawIndex = 0
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const dataIndex = (y * w + x) * 4
        const r = rawValues[rawIndex++] / maxScale + 0.5
        const g = rawValues[rawIndex++] / maxScale + 0.5

        data[dataIndex] = Math.max(0, Math.min(255, r * 255))      // R通道 - X位移
        data[dataIndex + 1] = Math.max(0, Math.min(255, g * 255))  // G通道 - Y位移
        data[dataIndex + 2] = 0        // B通道
        data[dataIndex + 3] = 255      // Alpha通道
      }
    }

    // 直接使用清晰的位移贴图，不进行模糊处理
    const imageData = new ImageData(data, w, h)
    context.putImageData(imageData, 0, 0)

    // 创建 SVG 滤镜 - 平衡的RGB三色色散效果
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
    svg.setAttribute('width', '0')
    svg.setAttribute('height', '0')
    svg.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      pointer-events: none;
      z-index: -1;
    `

    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs')
    const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter')
    filter.setAttribute('id', filterId)
    filter.setAttribute('filterUnits', 'userSpaceOnUse')
    filter.setAttribute('colorInterpolationFilters', 'sRGB')
    filter.setAttribute('x', '-50%')
    filter.setAttribute('y', '-50%')
    filter.setAttribute('width', '200%')
    filter.setAttribute('height', '200%')

    // 1. 首先对背景进行高斯模糊
    const feGaussianBlur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur')
    feGaussianBlur.setAttribute('in', 'BackgroundImage')
    feGaussianBlur.setAttribute('stdDeviation', blurRadius.toString())
    feGaussianBlur.setAttribute('result', 'blurred')

    // 2. 创建位移贴图
    const feImage = document.createElementNS('http://www.w3.org/2000/svg', 'feImage')
    feImage.setAttribute('id', `${filterId}_map`)
    feImage.setAttribute('width', width.toString())
    feImage.setAttribute('height', height.toString())
    feImage.setAttribute('result', 'displacementMap')
    feImage.setAttributeNS('http://www.w3.org/1999/xlink', 'href', canvas.toDataURL())

    // 3. 主要的位移效果（作为基准）
    const feDisplacementMap = document.createElementNS('http://www.w3.org/2000/svg', 'feDisplacementMap')
    feDisplacementMap.setAttribute('in', 'blurred')
    feDisplacementMap.setAttribute('in2', 'displacementMap')
    feDisplacementMap.setAttribute('xChannelSelector', 'R')
    feDisplacementMap.setAttribute('yChannelSelector', 'G')
    feDisplacementMap.setAttribute('scale', (maxScale / canvasDPI * scale / 20).toString())
    feDisplacementMap.setAttribute('result', 'mainEffect')

    // 4. 红色色散 - 向外扩展（中等强度）
    const feDisplacementMapR = document.createElementNS('http://www.w3.org/2000/svg', 'feDisplacementMap')
    feDisplacementMapR.setAttribute('in', 'blurred')
    feDisplacementMapR.setAttribute('in2', 'displacementMap')
    feDisplacementMapR.setAttribute('xChannelSelector', 'R')
    feDisplacementMapR.setAttribute('yChannelSelector', 'G')
    // 中等色散强度
    feDisplacementMapR.setAttribute('scale', (maxScale / canvasDPI * scale / 20 * (1 + dispersion * 0.15)).toString())
    feDisplacementMapR.setAttribute('result', 'redShift')

    // 5. 绿色色散 - 保持中性（轻微向上）
    const feDisplacementMapG = document.createElementNS('http://www.w3.org/2000/svg', 'feDisplacementMap')
    feDisplacementMapG.setAttribute('in', 'blurred')
    feDisplacementMapG.setAttribute('in2', 'displacementMap')
    feDisplacementMapG.setAttribute('xChannelSelector', 'R')
    feDisplacementMapG.setAttribute('yChannelSelector', 'G')
    // 绿色轻微向上位移
    feDisplacementMapG.setAttribute('scale', (maxScale / canvasDPI * scale / 20 * (1 + dispersion * 0.05)).toString())
    feDisplacementMapG.setAttribute('result', 'greenShift')

    // 6. 蓝色色散 - 向内收缩（中等强度）
    const feDisplacementMapB = document.createElementNS('http://www.w3.org/2000/svg', 'feDisplacementMap')
    feDisplacementMapB.setAttribute('in', 'blurred')
    feDisplacementMapB.setAttribute('in2', 'displacementMap')
    feDisplacementMapB.setAttribute('xChannelSelector', 'R')
    feDisplacementMapB.setAttribute('yChannelSelector', 'G')
    // 中等色散强度
    feDisplacementMapB.setAttribute('scale', (maxScale / canvasDPI * scale / 20 * (1 - dispersion * 0.15)).toString())
    feDisplacementMapB.setAttribute('result', 'blueShift')

    // 7. 对红色通道进行轻微模糊
    const feGaussianBlurR = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur')
    feGaussianBlurR.setAttribute('in', 'redShift')
    feGaussianBlurR.setAttribute('stdDeviation', (dispersion * 0.5).toString())
    feGaussianBlurR.setAttribute('result', 'redBlurred')

    // 8. 对绿色通道进行轻微模糊
    const feGaussianBlurG = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur')
    feGaussianBlurG.setAttribute('in', 'greenShift')
    feGaussianBlurG.setAttribute('stdDeviation', (dispersion * 0.4).toString())
    feGaussianBlurG.setAttribute('result', 'greenBlurred')

    // 9. 对蓝色通道进行轻微模糊
    const feGaussianBlurB = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur')
    feGaussianBlurB.setAttribute('in', 'blueShift')
    feGaussianBlurB.setAttribute('stdDeviation', (dispersion * 0.5).toString())
    feGaussianBlurB.setAttribute('result', 'blueBlurred')

    // 10. 提取红色通道
    const feComponentTransferR = document.createElementNS('http://www.w3.org/2000/svg', 'feComponentTransfer')
    feComponentTransferR.setAttribute('in', 'redBlurred')
    feComponentTransferR.setAttribute('result', 'redChannel')
    const feFuncRR = document.createElementNS('http://www.w3.org/2000/svg', 'feFuncR')
    feFuncRR.setAttribute('type', 'identity')
    const feFuncGR = document.createElementNS('http://www.w3.org/2000/svg', 'feFuncG')
    feFuncGR.setAttribute('type', 'discrete')
    feFuncGR.setAttribute('tableValues', '0')
    const feFuncBR = document.createElementNS('http://www.w3.org/2000/svg', 'feFuncB')
    feFuncBR.setAttribute('type', 'discrete')
    feFuncBR.setAttribute('tableValues', '0')
    const feFuncAR = document.createElementNS('http://www.w3.org/2000/svg', 'feFuncA')
    feFuncAR.setAttribute('type', 'discrete')
    // 适中的红色透明度
    feFuncAR.setAttribute('tableValues', `0 ${Math.min(0.56, dispersion * 0.56)}`)
    feComponentTransferR.appendChild(feFuncRR)
    feComponentTransferR.appendChild(feFuncGR)
    feComponentTransferR.appendChild(feFuncBR)
    feComponentTransferR.appendChild(feFuncAR)

    // 11. 提取绿色通道
    const feComponentTransferG = document.createElementNS('http://www.w3.org/2000/svg', 'feComponentTransfer')
    feComponentTransferG.setAttribute('in', 'greenBlurred')
    feComponentTransferG.setAttribute('result', 'greenChannel')
    const feFuncRG = document.createElementNS('http://www.w3.org/2000/svg', 'feFuncR')
    feFuncRG.setAttribute('type', 'discrete')
    feFuncRG.setAttribute('tableValues', '0')
    const feFuncGG = document.createElementNS('http://www.w3.org/2000/svg', 'feFuncG')
    feFuncGG.setAttribute('type', 'identity')
    const feFuncBG = document.createElementNS('http://www.w3.org/2000/svg', 'feFuncB')
    feFuncBG.setAttribute('type', 'discrete')
    feFuncBG.setAttribute('tableValues', '0')
    const feFuncAG = document.createElementNS('http://www.w3.org/2000/svg', 'feFuncA')
    feFuncAG.setAttribute('type', 'discrete')
    // 绿色作为平衡色，透明度适中
    feFuncAG.setAttribute('tableValues', `0 ${Math.min(0.375, dispersion * 0.375)}`)
    feComponentTransferG.appendChild(feFuncRG)
    feComponentTransferG.appendChild(feFuncGG)
    feComponentTransferG.appendChild(feFuncBG)
    feComponentTransferG.appendChild(feFuncAG)

    // 12. 提取蓝色通道
    const feComponentTransferB = document.createElementNS('http://www.w3.org/2000/svg', 'feComponentTransfer')
    feComponentTransferB.setAttribute('in', 'blueBlurred')
    feComponentTransferB.setAttribute('result', 'blueChannel')
    const feFuncRB = document.createElementNS('http://www.w3.org/2000/svg', 'feFuncR')
    feFuncRB.setAttribute('type', 'discrete')
    feFuncRB.setAttribute('tableValues', '0')
    const feFuncGB = document.createElementNS('http://www.w3.org/2000/svg', 'feFuncG')
    feFuncGB.setAttribute('type', 'discrete')
    feFuncGB.setAttribute('tableValues', '0')
    const feFuncBB = document.createElementNS('http://www.w3.org/2000/svg', 'feFuncB')
    feFuncBB.setAttribute('type', 'identity')
    const feFuncAB = document.createElementNS('http://www.w3.org/2000/svg', 'feFuncA')
    feFuncAB.setAttribute('type', 'discrete')
    // 蓝色透明度稍高，平衡红色
    feFuncAB.setAttribute('tableValues', `0 ${Math.min(0.285, dispersion * 0.285)}`)
    feComponentTransferB.appendChild(feFuncRB)
    feComponentTransferB.appendChild(feFuncGB)
    feComponentTransferB.appendChild(feFuncBB)
    feComponentTransferB.appendChild(feFuncAB)

    // 13. 逐步合并RGB三色色散效果
    const feComposite1 = document.createElementNS('http://www.w3.org/2000/svg', 'feComposite')
    feComposite1.setAttribute('in', 'redChannel')
    feComposite1.setAttribute('in2', 'mainEffect')
    feComposite1.setAttribute('operator', 'over')
    feComposite1.setAttribute('result', 'withRed')

    const feComposite2 = document.createElementNS('http://www.w3.org/2000/svg', 'feComposite')
    feComposite2.setAttribute('in', 'greenChannel')
    feComposite2.setAttribute('in2', 'withRed')
    feComposite2.setAttribute('operator', 'over')
    feComposite2.setAttribute('result', 'withGreen')

    const feComposite3 = document.createElementNS('http://www.w3.org/2000/svg', 'feComposite')
    feComposite3.setAttribute('in', 'blueChannel')
    feComposite3.setAttribute('in2', 'withGreen')
    feComposite3.setAttribute('operator', 'over')
    feComposite3.setAttribute('result', 'finalResult')

    // 添加所有滤镜元素到filter
    filter.appendChild(feGaussianBlur)
    filter.appendChild(feImage)
    filter.appendChild(feDisplacementMap)
    filter.appendChild(feDisplacementMapR)
    filter.appendChild(feDisplacementMapG)
    filter.appendChild(feDisplacementMapB)
    filter.appendChild(feGaussianBlurR)
    filter.appendChild(feGaussianBlurG)
    filter.appendChild(feGaussianBlurB)
    filter.appendChild(feComponentTransferR)
    filter.appendChild(feComponentTransferG)
    filter.appendChild(feComponentTransferB)
    filter.appendChild(feComposite1)
    filter.appendChild(feComposite2)
    filter.appendChild(feComposite3)

    defs.appendChild(filter)
    svg.appendChild(defs)

    // 添加到DOM
    document.body.appendChild(svg)

    // 应用样式到元素
    element.style.backdropFilter = `url(#${filterId}) contrast(1.1) brightness(2.5) saturate(1)`
    element.style.background = `rgba(255, 255, 255, ${transparency})`
    element.style.position = 'relative'
    element.style.overflow = 'hidden'

    // 清理函数
    return () => {
      element.style.backdropFilter = ''
      element.style.background = ''
      element.style.position = ''
      element.style.overflow = ''
      svg.remove()
      canvas.remove()
    }
  }, [blurRadius, scale, transparency, dispersion])

  return elementRef
}

// 保持向后兼容
export const useLiquidGlass = useLiquidGlassButton
