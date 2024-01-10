interface IProps {
  width: number
  height: number
  className?: string
  onClick?: () => void
}

export default function CirclePlusIcon(props: IProps) {
  const {width, height, className, onClick} = props

  return (
    <div className={className} onClick={onClick}>
      <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-circle-plus" width={width}
           height={height} viewBox="0 0 24 24" strokeWidth="1.7" stroke="currentColor" fill="none" strokeLinecap="round"
           strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"/>
        <path d="M9 12h6"/>
        <path d="M12 9v6"/>
      </svg>
    </div>
  )
}
