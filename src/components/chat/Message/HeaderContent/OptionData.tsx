import OpenAIIcon from '@/components/icons/OpenAIICon'
import GoogleIcon from '@/components/icons/GoogleIcon'

export const GPT3 = ({width, height, className}: {width: number, height: number, className?: string}) => {
  return (
    <>
      <OpenAIIcon width={width} height={height} className={`bg-teal-600/80 text-white p-1 flex justify-center items-center ${className}`} />
    </>
  )
}

export const GPT4 = ({width, height, className}: {width: number, height: number, className?: string}) => {
  return (
    <>
      <OpenAIIcon width={width} height={height} className={`bg-black text-white p-1 flex justify-center items-center ${className}`} />
    </>
  )
}

export const Gemini = ({width, height, className}: {width: number, height: number, className?: string}) => {
  return (
    <>
      <GoogleIcon width={width} height={height} className={`bg-blue-400 text-gray-50 p-1 flex items-center justify-center ${className}`}/>
    </>
  )
}
