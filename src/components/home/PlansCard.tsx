import Link from 'next/link'

import CheckIcon from '@/components/icons/CheckIcon'
import ArrowUpRightIcon from '@/components/icons/ArrowUpRightIcon'

interface IProps {
  main: string
  price: string
  buttonText: string
}

const freeCard: string[] = [
  'Access the GPT model in block area',
  'Access GPT with your own API_Key for free',
  'Access Not Only GPT, but also other models'
]

const plusCard: string[] = [
  'Use credit points to substitute API_Key',
  'Charge only 0.3 more than the official fee',
  'Get 100 credit points for free when you register'
]

export default function PlansCard(props: IProps) {
  const {main, price, buttonText} = props

  return (
    <>
      <div className={'border w-1/2 text-white p-4 pb-12 flex flex-col gap-4'}>
        <h1 className={'text-4xl'}>{main}</h1>
        <h2 className={'text-xl'}>{price}</h2>
        <div className={'border w-1/3 h-12 flex flex-row items-center justify-center cursor-pointer hover:bg-black hover:text-white'}>
          <Link href={'/chat'}>
            {buttonText}
          </Link>
          <ArrowUpRightIcon width={20} height={20}/>
        </div>

        <div className={'border'}/>

        {main === 'free' && freeCard.map((item: string, index: number) => (
          <div key={index} className={'flex flex-row border-b pb-2'}>
            <CheckIcon width={20} height={20}/>
            <p>{item}</p>
          </div>
        ))}

        {main === 'plus' && plusCard.map((item: string, index: number) => (
          <div key={index} className={'flex flex-row border-b pb-2'}>
            <CheckIcon width={20} height={20}/>
            <p>{item}</p>
          </div>
        ))}
      </div>
    </>
  )
}
