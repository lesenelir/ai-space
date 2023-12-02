interface IProps {
  width: number
  height: number
  className?: string
}

export default function CheckIcon(props: IProps) {
  const {width, height, className} = props

  return (
    <div className={className}>
      <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24" fill="none" stroke="currentColor"
           strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-check">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    </div>
  )
}
