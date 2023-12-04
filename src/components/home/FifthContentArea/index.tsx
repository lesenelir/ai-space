import CornerRightUpIcon from '@/components/icons/CornerRightUpIcon'
import StripePattern from '@/components/home/FifthContentArea/StripePattern'

export default function FifthContentArea() {
  const handleBackToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <div className={'min-h-[70vh] bg-black text-white md:px-32 px-8 py-4 max-sm:px-4'}>
      {/* Line */}
      <div className={'border-b mt-16 mb-8'}/>

      {/* Content */}
      <div className={'flex flex-row sm:gap-60 max-sm:justify-between mb-10'}>
        <div className={'flex flex-col gap-2'}>
          <p>AI Space © 2023-Present</p>
          <p>Terms & policies</p>
          <p>Privacy policy</p>
          <p>Brand guidelines</p>
        </div>

        <div className={'flex flex-col justify-between'}>
          <ul className={'flex flex-row sm:gap-8 max-sm:gap-2'}>
            <li className={'line'}>
              <a href={'https://github.com/lesenelir'} target={'_blank'}>Github</a>
            </li>
            <li className={'line'}>
              <a href={'https://twitter.com/lesenelir'} target={'_blank'}>Twitter</a>
            </li>
          </ul>

          <div
            className={'line flex flex-row gap-1'}
            onClick={handleBackToTop}
          >
            Back to top
            <CornerRightUpIcon width={20} height={20}/>
          </div>
        </div>
      </div>

      {/* FooterLine */}
      <StripePattern/>
    </div>
  )
}
