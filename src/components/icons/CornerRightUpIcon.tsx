interface IProps {
  width: number
  height: number
  className?: string
}

export default function CornerRightUpIcon(props: IProps) {
  const {width, height, className} = props

  return (
    <div className={className}>
      <svg
        xmlns="http://www.w3.org/2000/svg" width={width} height={height}
        viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        className="feather feather-corner-right-up"
      >
        <polyline points="10 9 15 4 20 9"/>
        <path d="M4 20h7a4 4 0 0 0 4-4V4"/>
      </svg>
    </div>
  )
}
