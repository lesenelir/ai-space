interface IProps {
  width: number
  height: number
  className?: string
}

export default function FolderPlusIcon(props: IProps) {
  const {width, height, className} = props

  return (
    <div className={className}>
      <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24" fill="none"
           stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round"
           className="feather feather-folder-plus">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
        <line x1="12" y1="11" x2="12" y2="17"/>
        <line x1="9" y1="14" x2="15" y2="14"/>
      </svg>
    </div>
  )
}
