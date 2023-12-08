import Image from 'next/image'

export default function I18Change() {
  return (
    <div className={''}>
      {/* black */}
      <Image
        width={24}
        height={24}
        alt={'I18 Icon'}
        src={'/language-translate-light.svg'}
        className={'cursor-pointer hover:opacity-60'}
      />
      {/*<Image*/}
      {/*  width={24}*/}
      {/*  height={24}*/}
      {/*  alt={'I18 Icon'}*/}
      {/*  src={'/language-translate-dark.svg'}*/}
      {/*  className={'cursor-pointer hover:opacity-60'}*/}
      {/*/>*/}
    </div>
  )
}
