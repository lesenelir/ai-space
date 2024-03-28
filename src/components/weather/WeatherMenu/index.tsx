import CommonMenu from '@/components/common/commonMenu'

interface IProps {
  initialWidth: number
}

export default function WeatherMenu(props: IProps) {
  const { initialWidth } = props

  return (
    <>
      <CommonMenu initialWidth={initialWidth}/>
    </>
  )
}
