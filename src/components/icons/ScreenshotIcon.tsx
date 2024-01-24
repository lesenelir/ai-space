interface IProps {
  width: number
  height: number
  className?: string
  onClick?: () => void
}

export default function ScreenshotIcon(props: IProps) {
  const {width, height, className, onClick} = props

  return (
    <div className={className} onClick={onClick}>
      <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-screenshot" width={width}
           height={height} viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round"
           strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M7 19a2 2 0 0 1 -2 -2"/>
        <path d="M5 13v-2"/>
        <path d="M5 7a2 2 0 0 1 2 -2"/>
        <path d="M11 5h2"/>
        <path d="M17 5a2 2 0 0 1 2 2"/>
        <path d="M19 11v2"/>
        <path d="M19 17v4"/>
        <path d="M21 19h-4"/>
        <path d="M13 19h-2"/>
      </svg>
    </div>
  )
}
