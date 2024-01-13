interface IProps {
  width: number
  height: number
  className?: string
  onClick?: () => void
}

export default function TIcon(props: IProps) {
  const {width, height, className, onClick} = props

  return (
    <div className={className} onClick={onClick}>
      <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-letter-t" width={width} height={height}
           viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round"
           strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M6 4l12 0"/>
        <path d="M12 4l0 16"/>
      </svg>
    </div>
  )
}
