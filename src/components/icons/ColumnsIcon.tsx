interface IProps {
  width: number
  height: number
  className?: string
  onClick?: () => void
}

export default function ColumnsIcon(props: IProps) {
  const {width, height, className, onClick} = props

  return (
    <div className={className} onClick={onClick}>
      <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24" fill="none"
           stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round"
           className="feather feather-columns">
        <path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7m0-18H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7m0-18v18"/>
      </svg>
    </div>
  )
}
