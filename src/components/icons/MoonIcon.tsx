interface IProps {
  width: number
  height: number
  className?: string
  onClick?: () => void
}

export default function MoonIcon(props: IProps) {
  const {width, height, className, onClick} = props

  return (
    <div className={className} onClick={onClick}>
      <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24" fill="none" stroke="currentColor"
           strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-moon">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
      </svg>

    </div>
  )
}
