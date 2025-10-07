'use client'

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface Props {
  language: string
  code: string
}

export default function ClientSyntaxHighlighter({ language, code }: Props) {
  return (
    <SyntaxHighlighter language={language} style={atomDark} showLineNumbers>
      {code}
    </SyntaxHighlighter>
  )
}