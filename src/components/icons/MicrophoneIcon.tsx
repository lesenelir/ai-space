interface IProps {
  width: number
  height: number
  className?: string
  onClick?: () => void
}

export default function MicrophoneIcon(props: IProps) {
  const {width, height, className, onClick} = props

  return (
    <div className={className} onClick={onClick}>
      <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-microphone" width={width} height={height}
           viewBox="0 0 24 24" strokeWidth="1.7" stroke="currentColor" fill="none" strokeLinecap="round"
           strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M9 2m0 3a3 3 0 0 1 3 -3h0a3 3 0 0 1 3 3v5a3 3 0 0 1 -3 3h0a3 3 0 0 1 -3 -3z"/>
        <path d="M5 10a7 7 0 0 0 14 0"/>
        <path d="M8 21l8 0"/>
        <path d="M12 17l0 4"/>
      </svg>
    </div>
  )
}
