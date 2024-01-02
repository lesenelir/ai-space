interface IProps {
  width: number
  height: number
  className?: string
  onClick?: () => void
}

export default function MessageClearIcon(props: IProps) {
  const {width, height, className, onClick} = props

  return (
    <div className={className} onClick={onClick}>
      <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-message-2-x" width={width}
           height={height} viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round"
           strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M8 9h8"/>
        <path d="M8 13h6"/>
        <path d="M13.5 19.5l-1.5 1.5l-3 -3h-3a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v6"/>
        <path d="M22 22l-5 -5"/>
        <path d="M17 22l5 -5"/>
      </svg>
    </div>
  )
}
