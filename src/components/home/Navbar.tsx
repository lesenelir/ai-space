import { useEffect, useState } from 'react'
import { useAuth, UserButton } from '@clerk/nextjs'

import LZIcon from '@/components/icons/LZIcon'
import NavbarLi from '@/components/home/NavbarLi'

export default function Navbar() {
  const {userId} = useAuth()
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
          h-22 md:px-32 px-8 py-4 max-sm:px-4 flex flex-row justify-between
          ${isScrolled ? 'bg-black text-white fixed right-0 left-0 top-0 z-50' : ''}
        `}
      >
        {/* left: main content + icon */}
        <div className={'flex flex-row'}>
          <LZIcon width={52} height={52}/>
          <p className={'text-xl font-medium flex flex-row items-center'}>AI Space</p>
        </div>

        {/* middle */}
        <ul className={'md:flex flex-row gap-4 max-md:hidden'}>
          <NavbarLi text={'Research'}/>
          <NavbarLi text={'Safety'}/>
          <NavbarLi text={'Pricing'}/>
        </ul>

        {/* right */}
        <ul className={'md:flex flex-row max-md:hidden gap-4'}>
          {
            userId ? (
              <div className={'flex flex-col justify-center'}>
                <UserButton afterSignOutUrl={'/'}/>
              </div>
            ) : (
              <NavbarLi text={'Login'} href={'/sign-in'}/>
            )
          }
        </ul>

        {/* mobile icon, right menu icon */}
        <ul className={'md:hidden max-md:flex justify-center items-center'}>
          {/*<NavbarLi text={'Menu'}/>*/}
          <UserButton afterSignOutUrl={'/'}/>
        </ul>
      </nav>
    </>
  )
}
