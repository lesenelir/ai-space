import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

interface IProps {
  image: {
    src: string
    alt: string
  }
  title: string
  text: string
  href: string
}

export default function Card(props: IProps) {
  const { image, title, text, href } = props

  return (
    <motion.div
      className={`
        w-1/3 md:w-2/5 max-md:w-full
      `}
      initial={{ opacity: 0, y: -40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 1.6 }}
      viewport={{ once: true }}
    >
      <Image src={image.src} width={800} height={800} alt={image.alt}/>

      <div className={'flex flex-col justify-between mt-2'}>
        <div>
          <h1 className={'font-bold text-xl'}>{title}</h1>
          <p className={'text-justify'}>{text}</p>
        </div>

        <Link
          href={href}
          className={`
            underline underline-offset-4 cursor-pointer
            transition duration-300 ease-in-out hover:decoration-slate-400
          `}
        >
          Learn more
        </Link>
      </div>
    </motion.div>
  )
}
