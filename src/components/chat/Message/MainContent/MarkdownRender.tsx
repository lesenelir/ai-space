import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import Markdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { nord } from 'react-syntax-highlighter/dist/cjs/styles/prism'

interface IProps {
  markdown: string
}

export default function MarkdownRender(props: IProps) {
  const { markdown } = props

  return (
    <Markdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={{
        code({ node, inline, className, children, ...props }: any) {
          const match = /language-(\w+)/.exec(className || '');

          return !inline && match ? (
            <SyntaxHighlighter style={nord} PreTag="div" language={match[1]} {...props}>
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
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
