import Image from 'next/image'

interface IProps {
  imageSrc: string
  imageAlt: string
  text: string
}

export const userData = [
  {id: 1, text: 'My Plan', imageSrc: '/user.svg', imageAlt: 'user'},
  {id: 2, text: 'Settings', imageSrc: '/settings.svg', imageAlt: 'settings'},
]

export default function UserCard(props: IProps) {
  const {imageSrc, imageAlt, text} = props

  return (
    <>
      <div className={'flex items-center gap-4 p-3 rounded-md cursor-pointer hover:bg-gray-200 transition-change'}>
        <Image
          width={20}
          height={20}
          src={imageSrc}
          alt={imageAlt}
        />
        <p className={'text-sm'}>{text}</p>
      </div>
    </>
  )
}
