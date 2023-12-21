import OpenAIIcon from '@/components/icons/OpenAIICon'
import GoogleIcon from '@/components/icons/GoogleIcon'

export const GPT3 = () => {
  return (
    <>
      <OpenAIIcon width={16} height={16} className={'rounded-md bg-teal-600/80 text-white p-1 flex justify-center items-center'} />
    </>
  )
}

export const GPT4 = () => {
  return (
    <>
      <OpenAIIcon width={16} height={16} className={'rounded-md bg-black text-white p-1 flex justify-center items-center'} />
    </>
  )
}

export const Gemini = () => {
  return (
    <>
      <GoogleIcon width={16} height={16} className={'rounded-md bg-blue-400 text-gray-50 p-1 flex items-center justify-center'}/>
    </>
  )
}
