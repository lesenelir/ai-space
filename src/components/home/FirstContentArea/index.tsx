import clsx from 'clsx'
import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import Typewriter, { TypewriterClass } from 'typewriter-effect'

import Navbar from '@/components/home/FirstContentArea/Navbar'
import ArrowUpRightIcon from '@/components/icons/ArrowUpRightIcon'
import FirstFooter from '@/components/home/FirstContentArea/FirstFooter'

const textList: string[] = [
  "Let's go",
  "Let's design",
  "Let's build",
  "Let's discover",
  "Let's explore",
  "Let's innovate",
]

export default function FirstContentArea() {
  const [textIndex, setTextIndex] = useState<number>(0)
  const [colorIndex, setColorIndex] = useState<number>(0)
  // Save typewriter instance
  const typewriterRef = useRef<TypewriterClass | null>(null)

  // When textIndex changed, start typewriter
  useEffect(() => {
    if (typewriterRef.current) {
      const cursorElement = document.querySelector('.Typewriter__cursor--main')
      if (cursorElement) {
        (cursorElement as HTMLElement).style.opacity = '1'
      }

      typewriterRef.current
        .typeString(`<span class='mr-0.5 text-4xl'>${textList[textIndex]}</span>`)
        .pauseFor(1500)
        .callFunction(() => {
          // Before delete start, change colorIndex
          setColorIndex((prevState: number) => (prevState + 1) % textList.length)
        })
        .deleteAll(20)
        .pauseFor(1500)
        .callFunction(() => {
          setTextIndex((prevState: number) => (prevState + 1) % textList.length)
        })
        .start()
    }
  }, [textIndex])

  const cliClassName = useMemo(() => (
    clsx(
      'w-[100px] p-2 rounded-lg border flex justify-between items-center',
      'transition duration-300 ease-in-out',
      'hover:bg-black hover:text-white hover:cursor-pointer',
      `bg-canvas-b-${colorIndex}`,
      `text-canvas-t-${colorIndex}`
    )
  ), [colorIndex])

  return (
    <>
      <div
        className={clsx(
          'w-full min-h-screen flex flex-col',
          `bg-openai-b-${colorIndex}`,
          `text-openai-t-${colorIndex}`
        )}
      >
        {/* Navbar */}
        <Navbar/>

        {/* Content */}
        <main className={'flex-1 flex flex-col justify-center items-center lg:px-32 px-8 py-4 max-sm:px-4'}>
          <Typewriter
            options={{
              delay: 40,
              cursor: '',
              cursorClassName: 'Typewriter__cursor--main'
            }}
            onInit={(typewriter: TypewriterClass) => {
              typewriterRef.current = typewriter
              typewriter
                .pauseFor(2500)
                .callFunction(() => {
                  const cursorElement = document.querySelector('.Typewriter__cursor--main')
                  if (cursorElement) {
                    (cursorElement as HTMLElement).style.opacity = '1'
                  }
                })
                .pauseFor(1000)
                .typeString(`<span class='mr-0.5 text-4xl'>${textList[textIndex]}</span>`)
                .pauseFor(1500)
                .callFunction(() => {
                  // Before delete start, change colorIndex
                  setColorIndex((prevState: number) => (prevState + 1) % textList.length)
                })
                .deleteAll(20)
                .pauseFor(1500)
                .callFunction(() => {
                  setTextIndex((prevState: number) => (prevState + 1) % textList.length)
                })
                .start()
            }}
          />

          {/* Entry */}
          <ul className={'list-none flex flex-row gap-4 m-6'}>
            <Link className={cliClassName} href={'/chat'}>
              <span>ChatGPT</span>
              <ArrowUpRightIcon width={20} height={20}/>
            </Link>

            <Link className={cliClassName} href={'/dall'}>
              <span>DALL-E</span>
              <ArrowUpRightIcon width={20} height={20}/>
            </Link>
          </ul>
        </main>

        {/* FirstFooter */}
        <FirstFooter/>
      </div>
    </>
  )
}
