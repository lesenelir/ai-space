interface IProps {
  width: number
  height: number
  className?: string
  onClick?: () => void
}

export default function PuzzleIcon(props: IProps) {
  const {width, height, className, onClick} = props

  return (
    <div className={className} onClick={onClick}>
      <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-puzzle-2" width={width} height={height}
           viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round"
           strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"/>
        <path d="M12 4v2.5a.5 .5 0 0 1 -.5 .5a1.5 1.5 0 0 0 0 3a.5 .5 0 0 1 .5 .5v1.5"/>
        <path d="M12 12v1.5a.5 .5 0 0 0 .5 .5a1.5 1.5 0 0 1 0 3a.5 .5 0 0 0 -.5 .5v2.5"/>
        <path d="M20 12h-2.5a.5 .5 0 0 1 -.5 -.5a1.5 1.5 0 0 0 -3 0a.5 .5 0 0 1 -.5 .5h-1.5"/>
        <path d="M12 12h-1.5a.5 .5 0 0 0 -.5 .5a1.5 1.5 0 0 1 -3 0a.5 .5 0 0 0 -.5 -.5h-2.5"/>
      </svg>
    </div>
  )
}
