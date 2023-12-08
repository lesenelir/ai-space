import Image from 'next/image'

export const GPT3 = () => {
  return (
    <p className={'flex gap-2 items-center p-1'}>
      <Image width={18} height={18} alt={'GPT3.5 Icon'} src={'/gpt3.svg'}/>
      <span className={'text-sm'}>GPT-3.5 Turbo</span>
    </p>
  )
}

export const GPT4 = () => {
  return (
    <p className={'flex gap-2 items-center p-1'}>
      <Image width={18} height={18} alt={'GPT4 Icon'} src={'/gpt4.svg'}/>
      <span className={'text-sm'}>GPT-4 Turbo</span>
    </p>
  )
}
