import CommonMenu from '@/components/common/commonMenu'

interface IProps {
  initialWidth: number
}

export function SummarizeMenu(props: IProps) {
  const { initialWidth } = props

  return (
    <>
      <CommonMenu initialWidth={initialWidth}/>
    </>
  )
}
