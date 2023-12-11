import Image from 'next/image'

interface IProps {
  imageSrc: string
  imageAlt: string
  text: string
  onClick: () => void
}

export const userData = [
  {id: 1, textKey: 'chatPage.menu.plan', imageSrc: '/user.svg', imageAlt: 'user'},
  {id: 2, textKey: 'chatPage.menu.settings', imageSrc: '/settings.svg', imageAlt: 'settings'},
]

export default function UserCard(props: IProps) {
  const {imageSrc, imageAlt, text, onClick} = props

  return (
    <>
      <div
        className={'flex items-center gap-4 p-3 rounded-md cursor-pointer hover:bg-gray-200 transition-change'}
        onClick={onClick}
      >
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
