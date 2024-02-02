interface IProps {
  width: number
  height: number
  className?: string
  onClick?: () => void
}

export default function MessageChatIcon(props: IProps) {
  const {width, height, className, onClick} = props

  return (
    <div className={className} onClick={onClick}>
      <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-message-chatbot" width={width}
           height={height} viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round"
           strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M18 4a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-5l-5 3v-3h-2a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12z"/>
        <path d="M9.5 9h.01"/>
        <path d="M14.5 9h.01"/>
        <path d="M9.5 13a3.5 3.5 0 0 0 5 0"/>
      </svg>
    </div>
  )
}
