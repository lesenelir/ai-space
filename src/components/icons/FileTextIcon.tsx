interface IProps {
  width: number
  height: number
  className?: string
  onClick?: () => void
}

export default function FileTextIcon(props: IProps) {
  const {width, height, className, onClick} = props

  return (
    <div className={className} onClick={onClick}>
      <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-file-text" width={width}
           height={height} viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round"
           strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M14 3v4a1 1 0 0 0 1 1h4"/>
        <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"/>
        <path d="M9 9l1 0"/>
        <path d="M9 13l6 0"/>
        <path d="M9 17l6 0"/>
      </svg>
    </div>
  )
}
