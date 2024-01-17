import clsx from 'clsx'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'

export default function LanguageSwitch() {
  const router = useRouter()
  const { t } = useTranslation('common')

  const handlerLanguageChange = async () => {
    const currentLocale = router.locale
    const newLocale = currentLocale === 'en' ? 'zh' : 'en'
    await router.push(router.pathname, router.asPath, { locale: newLocale })
  }

  return (
    <div
      className={clsx(
        'w-40 h-7 p-1 rounded-3xl bg-gray-200 flex justify-between items-center gap-2',
        'group-hover/theme:bg-gray-200',
        'dark:bg-neutral-800'
      )}
    >
      <span
        className={clsx(
          'p-1 text-xs cursor-pointer',
          router.locale === 'en' && 'rounded-full bg-gray-50 dark:text-black',
        )}
        onClick={handlerLanguageChange}
      >
        {t('dallPage.en')}
      </span>

      <span
        className={clsx(
          'p-1 text-xs cursor-pointer',
          router.locale === 'zh' && 'rounded-full bg-gray-50 dark:text-black',
        )}
        onClick={handlerLanguageChange}
      >
        {t('dallPage.zh')}
      </span>
    </div>
  )
}
