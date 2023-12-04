import Card from '@/components/home/SecondContentArea/Card'

const cardData = [
  {
    image: {
      src: '/pictures/chat.png',
      alt: 'chat'
    },
    title: 'Chat with data',
    text: 'You can engage in conversations with a variety of LLM models, not limited to just OpenAI\'s GPT models. You can send your questions to different models to see their output, allowing for a more better solution to your problems.',
    href: '/chat'
  },
  {
    image: {
      src: '/pictures/dall.png',
      alt: 'dall'
    },
    title: 'Chat with image',
    text: 'Your uploaded image can be modified using GPT model, and our modification image services extend beyond basic adjustments to include advanced effects and creative transformations. Enjoy it now!',
    href: '/dall'
  },
  {
    image: {
      src: '/pictures/voice.png',
      alt: 'voice'
    },
    title: 'Chat with voice',
    text: 'We provide voice services. You can use voice to effortlessly convert spoken words into text. , which is particularly useful if typing is inconvenient or if you prefer a more natural, conversational input method.',
    href: '/chat'
  }
]

export default function SecondContentArea() {
  return (
    <div
      className={`
        w-full min-h-[90vh] lg:px-32 px-8 py-4 max-sm:px-4
        text-homepage-second-text bg-homepage-second-background
      `}
    >
      <div className={'border border-homepage-second-text mt-12 mb-6'}/>

      <h1 className={'text-xl'}>
        <span className={'font-bold text-2xl'}>AI Space {' '}</span>
        integrates AI applications,
      </h1>
      <h1 className={'text-xl mb-6'}>which can see, hear, and speak.</h1>

      <div className={'w-full flex lg:flex-nowrap max-lg:flex-wrap max-lg:justify-between max-md:flex-col gap-4 '}>
        {/*<Card*/}
        {/*  image={{src: '/pictures/chat.png', alt: 'chat'}}*/}
        {/*  href={'/chat'}*/}
        {/*/>*/}
        {/*<Card*/}
        {/*  image={{src: '/pictures/dall.png', alt: 'dall'}}*/}
        {/*  href={'/dall'}*/}
        {/*/>*/}
        {/*<Card*/}
        {/*  image={{src: '/pictures/voice.png', alt: 'voice'}}*/}
        {/*  href={'/chat'}*/}
        {/*/>*/}

        {
          cardData.map((data, index) => (
            <Card
              key={index}
              image={data.image}
              title={data.title}
              text={data.text}
              href={data.href}
            />
          ))
        }
      </div>

    </div>
  )
}
