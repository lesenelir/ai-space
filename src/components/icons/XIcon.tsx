import { type MouseEvent } from 'react'

interface IProps {
  width: number
  height: number
  className?: string
  onClick?: (e: MouseEvent<HTMLElement, globalThis.MouseEvent>) => void
}

export default function XIcon(props: IProps) {
  const {width, height, className, onClick} = props

  return (
    <div className={className} onClick={onClick}>
      <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24" fill="none"
           stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
           className="feather feather-x">
        <line x1="18" y1="6" x2="6" y2="18"/>
        <line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </div>
  )
}
