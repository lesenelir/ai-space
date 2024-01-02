interface IProps {
  width: number
  height: number
  className?: string
  onClick?: () => void
}

export default function SeparatorIcon(props: IProps) {
  const {width, height, className, onClick} = props

  return (
    <div className={className} onClick={onClick}>
      <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-separator" width={width} height={height}
           viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round"
           strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M3 12l0 .01"/>
        <path d="M7 12l10 0"/>
        <path d="M21 12l0 .01"/>
      </svg>
    </div>
  )
}
