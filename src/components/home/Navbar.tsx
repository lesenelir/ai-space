import { useEffect, useState } from 'react'
// import { UserButton } from '@clerk/nextjs'

import LZIcon from '@/components/icons/LZIcon'
import NavbarLi from '@/components/home/NavbarLi'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState<boolean>(false)

  const handlerScroll = () => {
    if (window.scrollY > 0) {
      setIsScrolled(true)
    } else {
      setIsScrolled(false)
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handlerScroll)

    return () => {
      window.removeEventListener('scroll', handlerScroll)
    }
  }, [])

  return (
    <>
      <nav
        className={`
          h-22 lg:px-32 px-8 py-4 max-sm:px-4 flex flex-row justify-between
          ${isScrolled ? 'bg-black text-white fixed right-0 left-0 top-0 z-50' : ''}
        `}
      >
        {/* left: main content + icon */}
        <div className={'flex flex-row'}>
          <LZIcon width={52} height={52}/>
          <p className={'text-xl font-medium flex flex-row items-center'}>AI Space</p>
        </div>

        {/* middle */}
        <ul className={'lg:flex flex-row gap-4 max-lg:hidden'}>
          <NavbarLi text={'Research'}/>
          <NavbarLi text={'Pricing'}/>
          <NavbarLi text={'About'}/>
          <NavbarLi text={'Docs'}/>
        </ul>

        {/* right */}
        <ul className={'lg:flex flex-row max-lg:hidden gap-4'}>
          <NavbarLi text={'Login'} href={'/sign-in'}/>
          <NavbarLi text={'User'}/>
        </ul>

        {/* mobile icon */}
        <ul className={'lg:hidden max-lg:flex'}>
          <NavbarLi text={'Menu'}/>
        </ul>
      </nav>
      {/*<header>*/}
      {/*  <UserButton afterSignOutUrl={'/'}/>*/}
      {/*</header>*/}
    </>
  )
}
