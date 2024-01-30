import clsx from 'clsx'
import { useTranslation } from 'next-i18next'
import {
  type Dispatch,
  type FormEvent,
  type SetStateAction,
  useRef
} from 'react'

interface IProps {
  setIsModalOpen: Dispatch<SetStateAction<boolean>>
}

export default function ModalUrl(props: IProps) {
  const { setIsModalOpen } = props
  const { t } = useTranslation('common')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    // TODO

  }

  return (
    <div className={'w-full h-full flex flex-col gap-5'}>
      <div className={'flex flex-col gap-2'}>
        <h1 className={'text-xl font-medium'}>
          {t('ttsPage.enterURL')}
        </h1>
        <p className={'text-sm text-gray-600 dark:text-gray-200'}>
          {t('ttsPage.urlModalText')}
        </p>
      </div>

      <form className={'flex flex-col gap-4'} onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          required={true}
          placeholder={t('ttsPage.urlModalInputPlaceholder')}
          className={clsx(
            'bg-transparent text-sm h-10 border p-1.5 rounded-lg dark:border-gray-500',
            'focus:outline-none focus:ring-2 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-blue-500'
          )}
        />

        <div className={'self-end flex gap-2'}>
          <button
            type={'button'}
            className={clsx(
              'w-20 border p-2 text-sm rounded-lg active:border-blue-500',
              'dark:border-gray-500 text-gray-800 dark:text-white',
              'hover:bg-gray-500/10 hover-transition-change'
            )}
            onClick={() => setIsModalOpen(false)}
          >
            {t('ttsPage.cancel')}
          </button>
          <button
            type={'submit'}
            className={clsx(
              'w-20 bg-blue-500 p-2 rounded-lg text-white',
              'shadow-md text-sm hover:bg-blue-500/90 hover-transition-change active:border-blue-500'
            )}
          >
            {t('ttsPage.confirm')}
          </button>
        </div>
      </form>

    </div>
  )
}
