import { type MouseEvent } from 'react'

interface IProps {
  width: number
  height: number
  className?: string
  onClick?: (e: MouseEvent<HTMLElement, globalThis.MouseEvent>) => void
}

export default function ArrowNarrowUpIcon(props: IProps) {
  const {width, height, className, onClick} = props

  return (
    <div className={className} onClick={onClick}>
      <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-arrow-narrow-up" width={width}
           height={height} viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round"
           strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M12 5l0 14"/>
        <path d="M16 9l-4 -4"/>
        <path d="M8 9l4 -4"/>
      </svg>
    </div>
  )
}

