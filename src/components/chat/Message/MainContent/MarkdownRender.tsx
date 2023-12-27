import { useState } from 'react'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import Markdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { nord } from 'react-syntax-highlighter/dist/cjs/styles/prism'

import CopyIcon from '@/components/icons/CopyIcon'
import CheckIcon from '@/components/icons/CheckIcon'

interface IProps {
  markdown: string
}

export default function MarkdownRender(props: IProps) {
  const { markdown } = props
  const [copy, setCopy] = useState<boolean>(false)

  const handleCopyClick = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {})
    setCopy(true)
    setTimeout(() => {
      setCopy(false)
    }, 1500)
  }

  return (
    <Markdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={{
        code({ node, inline, className, children, ...props }: any) {
          const match = /language-(\w+)/.exec(className || '');

          return !inline && match ? (
            <>
              <div className={'bg-gray-600 dark:bg-[#24242d] -mb-3 rounded-t-md h-[36px] flex justify-between'}>
                <p className={'p-2 text-sm'}>{className.split('-')[1] || 'Example code'}</p>
                {
                  copy ? (
                    <button className={'p-2 inline-flex items-center gap-1 text-sm'}>
                      <CheckIcon width={16} height={16}/>
                      <span>Copied!</span>
                    </button>
                  ): (
                    <button
                      className={'p-2 inline-flex items-center gap-1 text-sm'}
                      onClick={() => handleCopyClick(String(children).replace(/\n$/, ''))}
                    >
                      <CopyIcon width={16} height={16}/>
                      <span>Copy</span>
                    </button>
                  )
                }
              </div>
              <SyntaxHighlighter
                style={nord}
                PreTag="div"
                language={match[1]}
                customStyle={{
                  padding: '25px',
                }}
                wrapLongLines={true}
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            </>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          )
        },
      }}
    >
      {markdown}
    </Markdown>
  )
}
