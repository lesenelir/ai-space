interface IProps {
  width: number
  height: number
  className?: string
  onClick?: () => void
}

export default function ConfettiIcon(props: IProps) {
  const {width, height, className, onClick} = props

  return (
    <div className={className} onClick={onClick}>
      <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-confetti" width={width} height={height}
           viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round"
           strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M4 5h2"/>
        <path d="M5 4v2"/>
        <path d="M11.5 4l-.5 2"/>
        <path d="M18 5h2"/>
        <path d="M19 4v2"/>
        <path d="M15 9l-1 1"/>
        <path d="M18 13l2 -.5"/>
        <path d="M18 19h2"/>
        <path d="M19 18v2"/>
        <path d="M14 16.518l-6.518 -6.518l-4.39 9.58a1 1 0 0 0 1.329 1.329l9.579 -4.39z"/>
      </svg>
    </div>
  )
}
