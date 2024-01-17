import clsx from 'clsx'
import { motion } from 'framer-motion'
import { Ephesis } from 'next/font/google'

const ephesis = Ephesis({ subsets: ['latin'], weight: '400' })

export default function ThirdContentArea() {
  return (
    <div
      id={'safety'}
      className={clsx(
        'w-full min-h-[40vh] lg:px-32 px-8 py-4 max-sm:px-4',
        'bg-homepage-third-background text-homepage-third-text'
      )}
    >

      <div className={'border border-homepage-third-text mt-12 mb-6'}/>

      <h1 className={`text-6xl font-semibold mb-6 ${ephesis.className}`}>Safety</h1>

      <motion.div
        initial={{ opacity: 0, x: -100 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4, duration: 1.6 }}
        viewport={{ once: true }}
      >
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
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -100 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4, duration: 1.6 }}
        viewport={{ once: true }}
      >
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
      </motion.div>
    </div>
  )
}
