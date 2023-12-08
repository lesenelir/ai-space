import Image from 'next/image'

export default function ThemeChange() {
  return (
    <div>
      <Image
        src={'/sun.svg'}
        alt={'sun icon'}
        width={24}
        height={24}
        className={'cursor-pointer hover:opacity-60'}
      />
      {/*<Image*/}
      {/*  src={'/moon.svg'}*/}
      {/*  alt={'moon icon'}*/}
      {/*  width={24}*/}
      {/*  height={24}*/}
      {/*  className={'cursor-pointer hover:opacity-60'}*/}
      {/*/>*/}
    </div>
  )
}
