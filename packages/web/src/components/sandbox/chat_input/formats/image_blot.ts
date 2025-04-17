import Quill from 'quill'

const Embed = Quill.import('blots/embed') as any
export interface ImageValue {
  alt: string
  src: string
}
class ImageBlot extends Embed {
  static blotName = 'image'
  static tagName = 'img'
  static classNames: string[] = ['max-w-48', 'max-h-48', 'align-bottom']

  static create (value: ImageValue) {
    const node = super.create()
    node.setAttribute('alt', value.alt)
    node.setAttribute('src', value.src)
    node.classList.add(...ImageBlot.classNames)
    return node
  }

  static value (node: HTMLImageElement): ImageValue {
    return {
      alt: node.getAttribute('alt') ?? '',
      src: node.getAttribute('src') ?? '',
    }
  }
}

export default ImageBlot
