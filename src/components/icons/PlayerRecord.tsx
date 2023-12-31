import { type MouseEvent } from 'react'

interface IProps {
  width: number
  height: number
  className?: string
  onClick?: (e: MouseEvent<HTMLElement, globalThis.MouseEvent>) => void
}

export default function PlayerRecordIcon(props: IProps) {
  const {width, height, className, onClick} = props

  return (
    <div className={className} onClick={onClick}>
      <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-player-record" width={width}
           height={height} viewBox="0 0 24 24" strokeWidth="1.7" stroke="currentColor" fill="none" strokeLinecap="round"
           strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M12 12m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"/>
      </svg>
    </div>
  )
}


