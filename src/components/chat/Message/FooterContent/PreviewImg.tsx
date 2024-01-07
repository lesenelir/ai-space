import Image from 'next/image'
import { useRouter } from 'next/router'
import { Dispatch, MutableRefObject, SetStateAction, useEffect, useState } from 'react'

import { type TImage } from '@/types'
import LoadingSpinner from '@/components/common/chat/LoadingSpinner'

interface IProps {
  previewUrls: TImage[]
  remoteUrls: TImage[]
  uploading: {[key: string]: boolean}
  setPreviewUrls: Dispatch<SetStateAction<TImage[]>>
  setRemoteUrls: Dispatch<SetStateAction<TImage[]>>
  setUploading: Dispatch<SetStateAction<{[p: string]: boolean}>>
  abortControllers: MutableRefObject<{[p: string]: AbortController}>
}

export default function PreviewImg(props: IProps) {
  const {
    previewUrls,
    setPreviewUrls,
    uploading,
    abortControllers,
    setRemoteUrls,
    setUploading,
    remoteUrls
  } = props
  const router = useRouter()
  const [deleting, setDeleting] = useState<{[key: string]: boolean}>({})

  useEffect(() => {
    setDeleting({})
  }, [router.query.id])

  const removePreviewImg = async (id: string) => {
    if (uploading[id]) {
      // uploadImage aren't yet finished, cancel uploadImage.
      abortControllers.current[id].abort()
      delete abortControllers.current[id]
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
              alt={'preview image'}
              layout={'fill'}
              objectFit={'cover'}
              className={`rounded-xl ${uploading[item.id] && 'opacity-40'}`}
              unoptimized={true}
              placeholder={'blur'}
              blurDataURL={item.url}
            />
            {
              (uploading[item.id] || deleting[item.id]) && (
                <LoadingSpinner className={'absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2'}/>
              )
            }
            <span
              className={`
                absolute top-0 right-0 w-1/4 h-1/4 -mt-1.5 -mr-1.5 z-50 rounded-full
                opacity-0 group-hover/icons:opacity-100 bg-zinc-500 text-gray-100 
                hover:bg-gray-900 hover:text-gray-100
                border dark:border-gray-500
                inline-flex justify-center items-center
              `}
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
