import { Ephesis } from 'next/font/google'

const ephesis = Ephesis({ subsets: ['latin'], weight: '400' })

export default function ThirdContentArea() {
  return (
    <div
      className={`
        w-full min-h-[40vh] lg:px-32 px-8 py-4 max-sm:px-4
        bg-homepage-third-background text-homepage-third-text
      `}
      id={'safety'}
    >

      <div className={'border border-homepage-third-text mt-12 mb-6'}/>

      <h1 className={`text-6xl font-semibold mb-6 ${ephesis.className}`}>Safety</h1>

      <blockquote className={'text-justify'}>
        <p className={`text-4xl font-serif`}>
          “AI systems are becoming a part of everyday life. The key is to
          ensure that these machines are aligned with human intentions
          and values.”
        </p>
        <cite className={'block mt-4 text-lg not-italic text-black'}>
          <span className={'font-medium'}>Mira Murati</span>
          <span className={'block'}>
            Chief Technology Officer at OpenAI
          </span>
        </cite>
      </blockquote>

      <blockquote className={'text-justify mt-16 mb-12'}>
        <p className={'text-4xl font-serif'}>
          “AI Space ensures the stability of the system and the security of the data. We will
          <span className={'text-red-800'}>{' '} not {' '}</span>
          use your data for any purpose and will
          <span className={'text-red-800'}>{' '} never {' '}</span>
          steal your api key. You can use our platform with confidence.”
        </p>
        <cite className={'block mt-4 text-lg not-italic text-black'}>
          <span className={'font-medium'}>Lesenelir Zhou</span>
          <span className={'block'}>
            AI Space Creator and Developer at Home University
          </span>
        </cite>
      </blockquote>
    </div>
  )
}
