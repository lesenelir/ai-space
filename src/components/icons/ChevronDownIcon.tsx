interface IProps {
  width: number
  height: number
  strokeWidth: number
  className?: string
  onClick?: () => void
}

export default function ChevronDownIcon(props: IProps) {
  const {width, height, className, strokeWidth, onClick} = props

  return (
    <div className={className} onClick={onClick}>
      <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24" fill="none"
           stroke="currentColor" strokeWidth={String(strokeWidth)} strokeLinecap="round" strokeLinejoin="round"
           className="feather feather-chevron-down">
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    </div>
  )
}
