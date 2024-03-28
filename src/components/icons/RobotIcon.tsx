interface IProps {
  width: number
  height: number
  className?: string
  onClick?: () => void
}

export default function RobotIcon(props: IProps) {
  const {width, height, className, onClick} = props

  return (
    <div className={className} onClick={onClick}>
      <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24" fill="none"
           stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"
           className="icon icon-tabler icons-tabler-outline icon-tabler-robot-face">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M6 5h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2z"/>
        <path d="M9 16c1 .667 2 1 3 1s2 -.333 3 -1"/>
        <path d="M9 7l-1 -4"/>
        <path d="M15 7l1 -4"/>
        <path d="M9 12v-1"/>
        <path d="M15 12v-1"/>
      </svg>
    </div>
  )
}
