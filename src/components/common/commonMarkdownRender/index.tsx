import { useState } from 'react'
import sdk from '@stackblitz/sdk'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import Markdown from 'react-markdown'
import { useTranslation } from 'next-i18next'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { nord } from 'react-syntax-highlighter/dist/cjs/styles/prism'

import CopyIcon from '@/components/icons/CopyIcon'
import CheckIcon from '@/components/icons/CheckIcon'
import EyeIcon from '@/components/icons/EyeIcon'

interface IProps {
  markdown: string
}

export default function CommonMarkdownRender(props: IProps) {
  const { markdown } = props
  const { t } = useTranslation('common')
  const [copy, setCopy] = useState<boolean>(false)

  const handleCopyClick = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {})
    setCopy(true)
    setTimeout(() => {
      setCopy(false)
    }, 1500)
  }

  const handlePreviewClick = (code: string, language: string) => {
    const openFileFn = (language: string) => {
      switch (language) {
        case 'javascript':
          return 'index.js'
        case 'html':
          return 'index.html'
        case 'css':
          return 'index.css'
        case 'typescript':
          return 'index.ts'
      }
    }

    sdk.openProject(
      {
        title: 'Chat App',
        description: 'preview code',
        template: 'node',
        files: {
          'index.js': language === 'javascript' ? code : `console.log('hello world')`,
          'index.html': language === 'html' ? code : `<html lang="en"><body><h1>hello world</h1></body></html>`,
          'index.css': language === 'css' ? code : `h1 { color: red; }`,
          'index.ts': language === 'typescript' ? code : `console.log('hello world')`,
          'index.jsx': language === 'jsx' ? code : `function App() { return <h1>hello world</h1> }`,
          'package.json': `{
  "name": "my-project",
  "scripts": { 
    "dev": "node index.js" 
  },
  "dependencies": {
    "react": "17.0.1",
    "react-dom": "17.0.1",
    "@babel/runtime": "7.12.5"
  }
}`      // To ensure correct formatting in StackBlitz, the code here needs to be written as follows.
        }
      },
      {
        openFile: openFileFn(language)
      }
    )
  }

  return (
    <Markdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={{
        code({ node, inline, className, children, ...props }: any) {
          const match = /language-(\w+)/.exec(className || '')
          const language = className?.split('-')[1] || ''
          const code =  String(children).replace(/\n$/, '')

          return !inline && match ? (
            <>
              <div className={'bg-gray-600 dark:bg-[#24242d] rounded-t-md h-[36px] flex justify-between'}>
                <p className={'p-2 text-sm'}>{language || 'Example code'}</p>

                <div>
                  <button
                    className={'p-2 inline-flex items-center gap-1 text-sm'}
                    onClick={() => handlePreviewClick(code, language)}
                  >
                    <EyeIcon width={16} height={16}/>
                    <span>{t('chatPage.message.preview')}</span>
                  </button>

                  {
                    copy ? (
                      <button className={'p-2 inline-flex items-center gap-1 text-sm'}>
                        <CheckIcon width={16} height={16}/>
                        <span>{t('chatPage.message.copied')}!</span>
                      </button>
                    ): (
                      <button
                        className={'p-2 inline-flex items-center gap-1 text-sm'}
                        onClick={() => handleCopyClick(String(children).replace(/\n$/, ''))}
                      >
                        <CopyIcon width={16} height={16}/>
                        <span>{t('chatPage.message.copy')}</span>
                      </button>
                    )
                  }
                </div>
              </div>
              <SyntaxHighlighter
                style={nord}
                PreTag="div"
                language={match[1]}
                customStyle={{
                  padding: '25px',
                  margin: '0',
                  borderRadius: '0 0 6px 6px',
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
