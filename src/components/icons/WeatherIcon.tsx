interface IProps {
  width: number
  height: number
  className?: string
  onClick?: () => void
}

export default function WeatherIcon(props: IProps) {
  const {width, height, className, onClick} = props

  return (
    <div className={className} onClick={onClick}>
      <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24" fill="none"
           stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
           className="icon icon-tabler icons-tabler-outline icon-tabler-haze">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M3 12h1"/>
        <path d="M12 3v1"/>
        <path d="M20 12h1"/>
        <path d="M5.6 5.6l.7 .7"/>
        <path d="M18.4 5.6l-.7 .7"/>
        <path d="M8 12a4 4 0 1 1 8 0"/>
        <path d="M3 16h18"/>
        <path d="M3 20h18"/>
      </svg>
    </div>
  )
}
