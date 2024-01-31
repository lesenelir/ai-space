import clsx from 'clsx'
import { toast } from 'sonner'
import { useTranslation } from 'next-i18next'
import {
  type ChangeEvent,
  type KeyboardEvent,
  type CompositionEvent,
  type FormEvent,
  useState,
  useRef,
  useMemo,
} from 'react'

import { createVoice } from '@/requests'
import Modal from '@/components/ui/Modal'
import RefreshIcon from '@/components/icons/RefreshIcon'
import ModalUrl from '@/components/tts/TTSMessage/ModalUrl'
import CommonMessageHeader from '@/components/common/commonMessageHeader'

export default function TTSMessage() {
  const maxHeight = 200
  const { t } = useTranslation('common')
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  const [isTextAreaFocus, setIsTextAreaFocus] = useState<boolean>(false)
  const [isComposing, setIsComposing] = useState<boolean>(false)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [converting, setConverting] = useState<boolean>(false)
  const [showAudio, setShowAudio] = useState<boolean>(false)
  const [provider, setProvider] = useState<string>('openai')
  const [voice, setVoice] = useState<string>('alloy')
  const [format, setFormat] = useState<string>('mp3')
  const [model, setModel] = useState<string>('tts-1')
  const [speed, setSpeed] = useState<number>(1)
  const [audioUrl, setAudioUrl] = useState<string>('')

  const selectClassName = useMemo(() => (
    clsx(
      'bg-transparent text-sm border dark:border-gray-500 p-1 rounded-md focus:outline-none',
      'focus:border-blue-500 dark:focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
    )
  ), [])

  const handleComposition = (e: CompositionEvent) => {
    if (e.type === 'compositionstart') {
      setIsComposing(true)
    } else {
      setIsComposing(false)
    }
  }

  const handleTextAreaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target
    textarea.style.height = 'auto'
    textarea.style.height = Math.min(Math.max(textarea.scrollHeight, 144), maxHeight) + 'px'
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.shiftKey) return

    if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
      e.preventDefault()
      handleSubmit(e).then()
    }
  }

  const handleSubmit = async (e: FormEvent | KeyboardEvent) => {
    e.preventDefault()

    // because of the `required` attribute, so we don't need to check the value
    const text = textAreaRef.current!.value || ''

    try {
      setShowAudio(false)
      setConverting(true)
      const response = (await createVoice(text, voice, format, model, speed))!
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      setConverting(false)
      setShowAudio(true)
      setAudioUrl(url)
    } catch (e) {
      toast.error('get voice failed')
    }
  }

  return (
    <div
      className={clsx(
        'flex-1 w-full flex flex-col bg-gray-50',
        'dark:bg-chatpage-message-background-dark dark:text-chatpage-message-text-dark'
      )}
    >
      <CommonMessageHeader/>

      {
        isModalOpen && (
          <>
            <Modal
              motionClassName={clsx(
                'w-1/3 h-[210px] p-4 border border-gray-500 rounded-xl',
                'bg-white text-black',
                'dark:bg-zinc-800 dark:text-white'
              )}
              onClose={() => setIsModalOpen(true)}
            >
              <ModalUrl ref={textAreaRef} setIsModalOpen={setIsModalOpen} setShowAudio={setShowAudio}/>
            </Modal>
          </>
        )
      }

      {/* Message Content */}
      <form className={'flex flex-col gap-4 p-3'} onSubmit={handleSubmit}>
        <div
          className={clsx(
            showAudio && 'border dark:border-gray-500 rounded-lg',
            showAudio && isTextAreaFocus && 'border-blue-500 dark:border-blue-500 outline-none ring-2 ring-blue-500'
          )}
        >
          <textarea
            ref={textAreaRef}
            required={true}
            placeholder={t('ttsPage.textPlaceholder')}
            className={clsx(
              'resize-none w-full h-[144px] p-3 text-sm rounded-lg',
              'custom-message-light-scrollbar bg-transparent focus:outline-none',
              !showAudio && 'border dark:border-gray-500',
              !showAudio && 'focus:ring-2 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-blue-500',
              showAudio && 'focus:ring-0 focus:outline-none'
            )}
            onChange={handleTextAreaChange}
            onKeyDown={handleKeyDown}
            onCompositionStart={handleComposition}
            onCompositionEnd={handleComposition}
            onFocus={() => setIsTextAreaFocus(true)}
            onBlur={() => setIsTextAreaFocus(false)}
          />
          {
            showAudio && (
              <audio
                controls
                key={audioUrl}
                className={clsx(
                  'w-full p-3 h-20',
                  showAudio && 'border-t dark:border-gray-500'
                )}
              >
                <source src={audioUrl} type="audio/mpeg" className={''}/>
                Your browser does not support the audio element.
              </audio>
            )
          }
        </div>

        {/* settings */}
        <div className={'flex flex-wrap gap-4 text-black dark:text-white'}>
          <div className={'flex flex-col gap-2'}>
            <span className={'text-sm font-medium'}>{t('ttsPage.provider')}</span>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className={selectClassName}
            >
              <option value={'openai'}>openai</option>
            </select>
          </div>

          <div className={'flex flex-col gap-2'}>
            <span className={'text-sm font-medium'}>{t('ttsPage.voice')}</span>
            <select
              value={voice}
              onChange={(e) => setVoice(e.target.value)}
              className={selectClassName}
            >
              <option value={'alloy'}>alloy</option>
              <option value={'echo'}>echo</option>
              <option value={'fable'}>fable</option>
              <option value={'onyx'}>onyx</option>
              <option value={'nova'}>nova</option>
              <option value={'shimmer'}>shimmer</option>
            </select>
          </div>

          <div className={'flex flex-col gap-2'}>
            <span className={'text-sm font-medium'}>{t('ttsPage.format')}</span>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className={selectClassName}
            >
              <option value={'mp3'}>mp3</option>
              <option value={'opus'}>opus</option>
              <option value={'aac'}>aac</option>
              <option value={'flac'}>flac</option>
            </select>
          </div>

          <div className={'flex flex-col gap-2'}>
            <span className={'text-sm font-medium'}>{t('ttsPage.model')}</span>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className={selectClassName}
            >
              <option value={'tts-1'}>tts-1</option>
              <option value={'tts-1-hd'}>tts-1-hd</option>
            </select>
          </div>

          <div className={'flex flex-col gap-2'}>
            <span className={'text-sm font-medium'}>{t('ttsPage.speed')}</span>
            <select
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className={selectClassName}
            >
              <option value={0.25}>0.25</option>
              <option value={0.5}>0.5</option>
              <option value={0.75}>0.75</option>
              <option value={1}>1</option>
              <option value={1.25}>1.25</option>
              <option value={1.5}>1.5</option>
              <option value={2}>2</option>
              <option value={2.5}>2.5</option>
              <option value={3}>3</option>
              <option value={3.5}>3.5</option>
              <option value={4}>4</option>
            </select>
          </div>
        </div>

        {/* buttons */}
        <div className={'flex gap-3'}>
          <button
            type={'submit'}
            disabled={converting}
            className={clsx(
              'w-fit flex items-center gap-1',
              'bg-blue-500 p-2 rounded-lg text-white',
              'shadow-md text-sm hover:bg-blue-500/90 hover-transition-change',
              'disabled:opacity-80 disabled:cursor-not-allowed'
            )}
          >
            {converting && (
              <RefreshIcon width={16} height={16} className={'animate-spinReverse'}/>
            )}
            {t('ttsPage.convert')}
          </button>

          <button
            type={'button'}
            className={clsx(
              'p-2 font-normal text-sm rounded-lg border border-input',
              'hover:bg-gray-200/80 hover-transition-change',
              'dark:hover:bg-gray-500/10 dark:border-gray-500'
            )}
            onClick={() => setIsModalOpen(true)}
          >
            {t('ttsPage.loadFromURL')}
          </button>
        </div>
      </form>
    </div>
  )
}
