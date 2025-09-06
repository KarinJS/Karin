// import Editor, { loader, OnMount, useMonaco } from '@monaco-editor/react'
// import React, { useEffect } from 'react'
// import { useTheme } from '@/hooks/use-theme'

// /**
//  * 编辑器配置，使用懒加载方式
//  * 将monaco相关依赖从主包中分离出来
//  */
// loader.config({
//   paths: {
//     vs: '/web/monaco-editor/min/vs',
//   },
//   'vs/nls': {
//     availableLanguages: { '*': 'zh-cn' },
//   },
// })

// export interface CodeEditorProps extends React.ComponentProps<typeof Editor> {
//   test?: string
// }

// export type CodeEditorRef = Parameters<OnMount>[0]

// /**
//  * Monaco编辑器组件
//  * 支持TypeScript、JavaScript等多种语言
//  * 主要功能：
//  * 1. 自动适应主题
//  * 2. 支持外部引用编辑器实例
//  * 3. 按需加载worker
//  */
// const CodeEditor = React.forwardRef<CodeEditorRef, CodeEditorProps>((props, ref) => {
//   const { isDark } = useTheme()
//   const monaco = useMonaco()

//   // 仅在monaco实例初始化后配置TypeScript
//   useEffect(() => {
//     if (monaco) {
//       // 配置TypeScript编译选项
//       monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true)
//       monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
//         target: monaco.languages.typescript.ScriptTarget.ESNext,
//         allowNonTsExtensions: true,
//         moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
//         module: monaco.languages.typescript.ModuleKind.CommonJS,
//         noEmit: true,
//         typeRoots: ['node_modules/@types'],
//       })

//       // 这里可以添加自定义语言支持或主题
//     }
//   }, [monaco])

//   // 处理编辑器挂载事件，转发ref和onMount回调
//   const handleEditorDidMount: OnMount = (editor, monaco) => {
//     if (ref) {
//       if (typeof ref === 'function') {
//         ref(editor)
//       } else {
//         ; (ref as React.RefObject<CodeEditorRef>).current = editor
//       }
//     }
//     if (props.onMount) {
//       props.onMount(editor, monaco)
//     }
//   }

//   return (
//     <Editor
//       {...props}
//       onMount={handleEditorDidMount}
//       theme={isDark ? 'vs-dark' : 'light'}
//       loading={<div className='flex items-center justify-center h-full'>编辑器加载中...</div>}
//       options={{
//         minimap: { enabled: false },
//         scrollBeyondLastLine: false,
//         automaticLayout: true,
//         ...props.options,
//       }}
//     />
//   )
// })

// export default CodeEditor
