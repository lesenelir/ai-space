import Image from 'next/image'

interface IProps {
  urls: string[]
}

export default function ShowImages(props: IProps) {
  const { urls } = props

  return (
    <div className={'flex flex-wrap gap-2'}>
      {
        urls.map((url, index) => (
          <Image
            key={index}
            src={url}
            alt={'dall image'}
            width={350}
            height={350}
          />
        ))
      }
    </div>
  )
}
