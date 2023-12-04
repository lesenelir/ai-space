


export default function ThirdContentArea() {
  return (
    <div
      className={`
        w-full min-h-[40vh] lg:px-32 px-8 py-4 max-sm:px-4
        bg-homepage-third-background text-homepage-third-text
      `}
    >

      <div className={'border mt-12'}/>

      <h1 className={'text-5xl font-semibold mb-6'}>Safety</h1>

      <blockquote className={'text-justify'}>
        <p className={'text-4xl font-serif'}>
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
          “AI Space ensures the stability of the system and the security of the data. We will not use your data for any other purpose and will never steal your api key. You can use our platform with confidence.”
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
