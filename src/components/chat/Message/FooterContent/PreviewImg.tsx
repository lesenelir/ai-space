import clsx from 'clsx'
import Image from 'next/image'
import type { Dispatch, MutableRefObject, SetStateAction } from 'react'

import type { TImage } from '@/types'
import LoadingSpinner from '@/components/common/chat/LoadingSpinner'

interface IProps {
  previewUrls: TImage[]
  remoteUrls: TImage[]
  uploading: {[key: string]: boolean}
  deleting: {[key: string]: boolean}
  setPreviewUrls: Dispatch<SetStateAction<TImage[]>>
  setRemoteUrls: Dispatch<SetStateAction<TImage[]>>
  setDeleting: Dispatch<SetStateAction<{[p: string]: boolean}>>
  setUploading: Dispatch<SetStateAction<{[p: string]: boolean}>>
  abortImageController: MutableRefObject<{[p: string]: AbortController}>
}

export default function PreviewImg(props: IProps) {
  const {
    previewUrls,
    setPreviewUrls,
    uploading,
    abortImageController,
    setRemoteUrls,
    setUploading,
    deleting,
    setDeleting,
    remoteUrls
  } = props

  const removePreviewImg = async (id: string) => {
    if (uploading[id]) {
      // uploadImage aren't yet finished, cancel uploadImage.
      abortImageController.current[id].abort()
      delete abortImageController.current[id]
      setUploading(prev => ({...prev, [id]: false}))
    } else {
      // uploadImage are finished, delete image in cloudinary.
      // initialize deleting state
      setDeleting(prev => ({...prev, [id]: true}))

      const imageTodoDelete = remoteUrls.find(item => item.id === id)
      if (imageTodoDelete) {
        try {
          const options = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url: imageTodoDelete.url })
          }
          await fetch('/api/chat/deleteRemoteImage', options)
          setDeleting(prev => ({...prev, [id]: false}))
        } catch (error) {
          console.log('Failed to delete image', error)
          setDeleting(prev => ({...prev, [id]: false}))
        }
      }
    }
    // update state
    setPreviewUrls(prev => prev.filter(item => item.id !== id))
    setRemoteUrls(prev => prev.filter(item => item.id !== id))
  }

  return (
    <div className={'flex flex-wrap gap-3'}>
      {
        previewUrls.map(item => (
          <div
            key={item.id}
            className={'relative w-20 h-20 rounded-xl group/icons cursor-pointer'}
          >
            <Image
              src={item.url}
              sizes={'100%'}
              fill={true}
              alt={'preview image'}
              unoptimized={true}
              placeholder={'blur'}
              blurDataURL={item.url}
              className={`rounded-xl object-cover ${uploading[item.id] && 'opacity-40'}`}
            />
            {
              (uploading[item.id] || deleting[item.id]) && (
                <LoadingSpinner className={'absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2'}/>
              )
            }
            <span
              className={clsx(
                'absolute top-0 right-0 w-1/4 h-1/4 -mt-1.5 -mr-1.5 z-50 rounded-full',
                'opacity-0 group-hover/icons:opacity-100 bg-zinc-500 text-gray-100',
                'hover:bg-gray-900 hover:text-gray-100',
                'border dark:border-gray-500',
                'inline-flex justify-center items-center'
              )}
              onClick={() => removePreviewImg(item.id)}
            >
              x
            </span>
          </div>
        ))
      }
    </div>
  )
}
