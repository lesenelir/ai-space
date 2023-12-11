interface IProps {
  width: number
  height: number
  className?: string
  onClick?: () => void
}

export default function ChevronUpIcon(props: IProps) {
  const {width, height, className, onClick} = props

  return (
    <div className={className} onClick={onClick}>
      <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24" fill="none"
           stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
           className="feather feather-chevron-up">
        <polyline points="18 15 12 9 6 15"/>
      </svg>

    </div>
  )
}
