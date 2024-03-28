interface IProps {
  width: number
  height: number
  className?: string
  onClick?: () => void
}

export default function MusicIcon(props: IProps) {
  const {width, height, className, onClick} = props

  return (
    <div className={className} onClick={onClick}>
      <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24" fill="none"
           stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
           className="icon icon-tabler icons-tabler-outline icon-tabler-music">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M3 17a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"/>
        <path d="M13 17a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"/>
        <path d="M9 17v-13h10v13"/>
        <path d="M9 8h10"/>
      </svg>
    </div>
  )
}
