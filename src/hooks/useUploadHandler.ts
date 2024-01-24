import { type MutableRefObject } from 'react'
import { useSetAtom, useAtomValue } from 'jotai'

import { previewUrlsAtom, remoteUrlsAtom, uploadingAtom } from '@/atoms'
import type { TImage } from '@/types'
import { uploadImage } from '@/utils'

export const useUploadHandler = (
  abortImageController: MutableRefObject<{[p: string]: AbortController}>
) => {
  const setUploading = useSetAtom(uploadingAtom)
  const setRemoteUrls = useSetAtom(remoteUrlsAtom)
  const previewUrls = useAtomValue(previewUrlsAtom)

  return (
    files: FileList | null,
    newPreviewUrls: TImage[] | null
  ) => {
    if (!files || !files.length) return

    const mergedPreviewUrls = [...previewUrls, ...(newPreviewUrls || [])]
    const len = !Object.keys(previewUrls).length ? files.length : mergedPreviewUrls.length
    const start = !Object.keys(previewUrls).length ? 0 : previewUrls.length

    // initial uploading state
    const initialUploadingState: {[key: string]: boolean} = {}
    for (let i = start; i < len; i++) {
      initialUploadingState[mergedPreviewUrls[i].id] = true
    }

    setUploading(initialUploadingState)

    // update images urls to cloudinary
    const uploadTask = [...files].map(async (file, index) => {
      const controller = new AbortController() // cancel upload (abort)
      abortImageController.current[mergedPreviewUrls[start + index].id] = controller

      try {
        const item = await uploadImage(file, mergedPreviewUrls[start + index].id, controller)
        setUploading(prev => ({...prev, [mergedPreviewUrls[start + index].id]: false})) // when upload success, set uploading to false
        return item
      } catch {
        setUploading(prev => ({...prev, [mergedPreviewUrls[start + index].id]: false})) // when upload failed, set uploading to false
        return undefined
      }
    })

    Promise.all(uploadTask).then((values) => {
      const successfulUploads = values.filter(item => item !== undefined) as TImage[]
      setUploading({}) // reset uploading state
      setRemoteUrls(prev => [...prev, ...successfulUploads])
    }).catch((error) => {
      console.log(error)
    })
  }
}

// export default function useUploadHandler(
//   abortImageController: MutableRefObject<{[p: string]: AbortController}>
// ) {
//   const setUploading = useSetAtom(uploadingAtom)
//   const setRemoteUrls = useSetAtom(remoteUrlsAtom)
//   const previewUrls = useAtomValue(previewUrlsAtom)
//
//   return (
//     files: FileList | null,
//     newPreviewUrls: TImage[] | null
//   ) => {
//     if (!files || !files.length) return
//
//     const mergedPreviewUrls = [...previewUrls, ...(newPreviewUrls || [])]
//     const len = !Object.keys(previewUrls).length ? files.length : mergedPreviewUrls.length
//     const start = !Object.keys(previewUrls).length ? 0 : previewUrls.length
//
//     // initial uploading state
//     const initialUploadingState: {[key: string]: boolean} = {}
//     for (let i = start; i < len; i++) {
//       initialUploadingState[mergedPreviewUrls[i].id] = true
//     }
//
//     setUploading(initialUploadingState)
//
//     // update images urls to cloudinary
//     const uploadTask = [...files].map(async (file, index) => {
//       const controller = new AbortController() // cancel upload (abort)
//       abortImageController.current[mergedPreviewUrls[start + index].id] = controller
//
//       try {
//         const item = await uploadImage(file, mergedPreviewUrls[start + index].id, controller)
//         setUploading(prev => ({...prev, [mergedPreviewUrls[start + index].id]: false})) // when upload success, set uploading to false
//         return item
//       } catch {
//         setUploading(prev => ({...prev, [mergedPreviewUrls[start + index].id]: false})) // when upload failed, set uploading to false
//         return undefined
//       }
//     })
//
//     Promise.all(uploadTask).then((values) => {
//       const successfulUploads = values.filter(item => item !== undefined) as TImage[]
//       setUploading({}) // reset uploading state
//       setRemoteUrls(prev => [...prev, ...successfulUploads])
//     }).catch((error) => {
//       console.log(error)
//     })
//   }
// }
