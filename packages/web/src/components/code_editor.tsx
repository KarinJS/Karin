import Editor, { loader, OnMount } from '@monaco-editor/react'
import React from 'react'
import { useTheme } from '@/hooks/use-theme'
import * as monaco from 'monaco-editor'
import TsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'

self.MonacoEnvironment = {
  getWorker (_: unknown, label: string) {
    if (label === 'typescript' || label === 'javascript') {
      return new TsWorker()
    }
    return new EditorWorker()
  }
}

monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true)

loader.config({
  monaco,
  paths: {
    vs: '/web/monaco-editor/min/vs'
  }
})

loader.config({
  'vs/nls': {
    availableLanguages: { '*': 'zh-cn' }
  }
})

export interface CodeEditorProps extends React.ComponentProps<typeof Editor> {
  test?: string
}

export type CodeEditorRef = monaco.editor.IStandaloneCodeEditor

/** @see https://github.com/NapNeko/NapCatQQ/blob/main/napcat.webui/src/components/code_editor.tsx */
const CodeEditor = React.forwardRef<CodeEditorRef, CodeEditorProps>((props, ref) => {
  const { isDark } = useTheme()

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    if (ref) {
      if (typeof ref === 'function') {
        ref(editor)
      } else {
        ; (ref as React.RefObject<CodeEditorRef>).current = editor
      }
    }
    if (props.onMount) {
      props.onMount(editor, monaco)
    }
  }

  return (
    <Editor
      {...props}
      onMount={handleEditorDidMount}
      theme={isDark ? 'vs-dark' : 'light'}
    />
  )
})

export default CodeEditor
