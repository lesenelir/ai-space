interface IProps {
  width: number
  height: number
  className?: string
  onClick?: () => void
}

export default function CategoryIcon(props: IProps) {
  const {width, height, className, onClick} = props

  return (
    <div className={className} onClick={onClick}>
      <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-category-plus" width={width}
           height={height} viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round"
           strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M4 4h6v6h-6zm10 0h6v6h-6zm-10 10h6v6h-6zm10 3h6m-3 -3v6"/>
      </svg>
    </div>
  )
}
