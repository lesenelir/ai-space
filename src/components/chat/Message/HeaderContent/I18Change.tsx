import { useRouter } from 'next/router'

import LanguageIcon from '@/components/icons/LanguageIcon'

export default function I18Change() {
  const router = useRouter()

  const handlerLanguageChange = async () => {
    const currentLocale = router.locale
    const newLocale = currentLocale === 'en' ? 'zh' : 'en'
    await router.push(router.pathname, router.asPath, { locale: newLocale })
  }

  return (
    <>
      <LanguageIcon
        width={24}
        height={24}
        className={'cursor-pointer hover:opacity-60 transition-opacity duration-300 ease-in-out'}
        onClick={handlerLanguageChange}
      />
    </>
  )
}
