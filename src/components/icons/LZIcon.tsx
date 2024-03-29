interface IProps {
  width: number
  height: number
  className?: string
  onClick?: () => void
}

export default function LZIcon(props: IProps) {
  const {width, height, className, onClick} = props

  return (
    <div className={className} onClick={onClick}>
      <svg width={width} height={height} viewBox="0 0 512 512" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M273 417C281.612 419.918 289.012 421.382 298 423" strokeWidth="20"
              strokeLinecap="round"/>
        <path
          d="M223.751 177.126C276.136 177.126 296.525 119.906 301.532 93.6533C304.809 76.4671 310.184 31.1557 290.42 15.2481C281.685 8.21707 283.144 32.7847 282.55 41.7806C280.905 66.6659 282.087 91.7073 282.087 116.608C282.087 185.145 275.806 248.994 255.234 316.646C239.58 368.123 208.872 417.661 169.12 463.32C166.225 466.645 128.048 509.207 117.266 496.71C83.7565 457.871 193.981 428.756 227.455 413.236C240.918 406.995 278.471 383.824 294.124 386.704C323.126 392.04 253.275 439.081 250.604 444.241C235.432 473.549 330.244 434.701 315.421 434.701"
          fill="none" stroke="currentColor" strokeWidth="20" strokeLinecap="round"/>
      </svg>
    </div>
  )
}
