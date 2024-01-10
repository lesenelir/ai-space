import { useEffect, useState } from 'react'
import { useAuth, UserButton } from '@clerk/nextjs'

import LZIcon from '@/components/icons/LZIcon'
import NavbarLi from '@/components/home/FirstContentArea/NavbarLi'

export default function Navbar() {
  const { userId } = useAuth()
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
          <ul className={'flex items-center'}>
            <NavbarLi
              text={'AI Space'}
              href={'#homepage'}
              className={`text-xl font-medium hover:no-underline`}
            />
          </ul>
        </div>

        {/* middle */}
        <ul className={'md:flex flex-row gap-4 max-md:hidden'}>
          <NavbarLi text={'Research'} href={'#research'}/>
          <NavbarLi text={'Safety'} href={'#safety'}/>
          <NavbarLi text={'Pricing'} href={'#pricing'}/>
        </ul>

        {/* pc icon, right menu icon */}
        <ul className={'md:flex max-md:hidden flex-row items-center'}>
          {
            userId ? (
              <UserButton afterSignOutUrl={'/'}/>
            ) : (
              <NavbarLi text={'Login'} href={'/sign-in'}/>
            )
          }
        </ul>

        {/* mobile icon, right menu icon */}
        <ul className={'md:hidden max-md:flex justify-center items-center'}>
          {
            userId ? (
              <UserButton afterSignOutUrl={'/'}/>
            ) : (
              <NavbarLi text={'Login'} href={'/sign-in'}/>
            )
          }
        </ul>
      </nav>
    </>
  )
}
