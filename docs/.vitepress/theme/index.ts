/* .vitepress\theme\index.ts */
import DefaultTheme from 'vitepress/theme'
import mediumZoom from 'medium-zoom'
import { onMounted, watch, nextTick } from 'vue'
import { useData, useRoute } from 'vitepress'
import 'vitepress-markdown-timeline/dist/theme/index.css'
import './style/index.css'

export default {
  extends: DefaultTheme,
  /** 响应式图片缩放 */
  setup () {
    const route = useRoute()
    const initZoom = () => {
      // 响应式的图片放大缩小
      // mediumZoom('[data-zoomable]', { background: 'var(--vp-c-bg)' }); // 默认
      mediumZoom('.main img', { background: 'var(--vp-c-bg)' }) // 不显式添加{data-zoomable}的情况下为所有图像启用此功能
    }
    onMounted(() => {
      initZoom()
    })
    watch(
      () => route.path,
      () => nextTick(() => initZoom())
    )
    const { frontmatter } = useData()
  },
}