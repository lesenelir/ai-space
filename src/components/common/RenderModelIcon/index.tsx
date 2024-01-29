import { Gemini, GPT3, GPT4 } from '@/components/chat/Message/HeaderContent/OptionData'

interface IProps {
  id: number
  width: number
  height: number
}

export default function RenderModelIcon(props: IProps) {
  const { id, width, height } = props

  switch (id) {
    case 1:
      return <GPT3 width={width} height={height} className={`rounded-full`} />
    case 2:
      return <GPT4 width={width} height={height} className={`rounded-full`} />
    case 3:
      return <GPT4 width={width} height={height} className={`rounded-full`} />
    case 4:
      return <Gemini width={width} height={height} className={`rounded-full`} />
    default:
      return null
  }
}
