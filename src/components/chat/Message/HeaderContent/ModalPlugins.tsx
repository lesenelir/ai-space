import clsx from 'clsx'
import { useRouter } from 'next/router'
import { toast, Toaster } from 'sonner'
import { useTranslation } from 'next-i18next'
import { useAtomValue, useSetAtom } from 'jotai'
import { type Dispatch, type SetStateAction } from 'react'

import { chatItemsAtom, selectedModelIdAtom } from '@/atoms'
import XIcon from '@/components/icons/XIcon'
import NewsIcon from '@/components/icons/NewsIcon'
import MusicIcon from '@/components/icons/MusicIcon'
import WeatherIcon from '@/components/icons/WeatherIcon'

interface IProps {
  setIsModalOpen: Dispatch<SetStateAction<boolean>>
}

export default function ModalPlugins(props: IProps) {
  const router = useRouter()
  const { setIsModalOpen } = props
  const { t } = useTranslation('common')
  const setChatItems = useSetAtom(chatItemsAtom)
  const selectedModelId = useAtomValue(selectedModelIdAtom)

  const pluginsArr = [
    {
      title: 'searchMusic',
      icon: <MusicIcon width={26} height={26}/>
    },
    {
      title: 'searchWeather',
      icon: <WeatherIcon width={26} height={26}/>
    },
    {
      title: 'searchNews',
      icon: <NewsIcon width={26} height={26}/>
    }
  ]

  const handleClick = async (title: string) => {
    let searchName = ''
    switch (title) {
      case 'searchMusic':
        searchName = 'Music'
        break
      case 'searchWeather':
        searchName = 'Weather'
        break
      case 'searchNews':
        searchName = 'News'
        break
    }

    // create a chatItem
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        searchName,
        modelPrimaryId: selectedModelId,
      })
    }

    const response = await fetch('/api/chat/createPlugin', options)
    if (!response.ok) {
      toast.error('Failed to create a chat item')
      return
    }
    const data = await response.json()
    setChatItems(data.chatItems)
    await router.push(`/chat/${data.newChatItem.item_uuid}`)
    setIsModalOpen(false)
  }

  return (
    <div className={'flex flex-col h-full'}>
      <Toaster richColors position={'top-center'}/>
      {/* header */}
      <div className={'p-4 flex justify-between bg-gray-50'}>
        <p className={'font-semibold'}>{t(`chatPage.menu.plugins`)}</p>
        <XIcon
          width={20}
          height={20}
          className={'h-1/4 cursor-pointer text-gray-800 hover:text-gray-800/70 transition-change'}
          onClick={() => setIsModalOpen(false)}
        />
      </div>
      <div className={'border-b'}/>

      {/* content */}
      <div className={'p-4 flex-1 flex flex-wrap gap-4 overflow-auto'}>
        {
          pluginsArr.map((plugin) => (
            <div
              key={plugin.title}
              className={clsx(
                'w-1/3 h-20 rounded-md flex flex-col items-center justify-around cursor-pointer',
                'bg-zinc-200/20 hover:bg-zinc-200/60 transition-change'
              )}
              onClick={() => handleClick(plugin.title)}
            >
              {plugin.icon}
              <p className={'font-medium'}>{t(`chatPage.menu.${plugin.title}`)}</p>
            </div>
          ))
        }
      </div>
      <div className={'border-b'}/>

      {/* footer */}
      <div className={'p-4 bg-gray-50'}>
        <p className={'flex justify-center gap-1'}>
          {t('chatPage.menu.footer')}
          <span className={'underline cursor-pointer'} onClick={() => router.push('/#research')}>
            {t('chatPage.menu.footerLink')}
          </span>
        </p>
      </div>
    </div>
  )
}
