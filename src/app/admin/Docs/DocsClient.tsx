'use client'
import Image from 'next/image'
import ClientSyntaxHighlighter from './ClientSyntaxHighlighter'
import FinanceStruture from './mdx/finance-structure.mdx'
import Test from './mdx/test.mdx'
import Router from './mdx/useRoute.mdx'
import Nodemailer from './mdx/nodemailer.mdx'
import type { ReactNode, ComponentType } from 'react'

type MDXComponentsType = {
  [key: string]: ComponentType<{ className?: string; children?: ReactNode }>
}

const mdxComponents: MDXComponentsType = {
  code: ({ className, children }: { className?: string; children?: ReactNode }) => {
    const match = /language-(\w+)/.exec(className || '')
    return (
      <ClientSyntaxHighlighter
        language={match ? match[1] : 'text'}
        code={String(children || '').trim()}
      />
    )
  },
}

export default function DocsClient() {
  return (
    <div className="gap-6 flex flex-col">
      <h1>Csmju Finance Structure</h1>
      <FinanceStruture components={mdxComponents} />
      <Image src="/financeFlow.png" alt="FinanceFlow" width={800} height={1000} />
      <div>
        <h1 className='text-4xl'>เทคนิคที่ใช้</h1>
            <Test components={mdxComponents} />
            <Router components={mdxComponents}/>
            <Nodemailer components={mdxComponents}/>
      </div>

    </div>
  )
}
