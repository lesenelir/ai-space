export async function uploadImage(file: File, id: string, controller: AbortController) {
  const formData = new FormData()

  formData.append('file', file)
  formData.append('upload_preset', 'ai-space')

  try {
    const options = {
      method: 'POST',
      body: formData,
      signal: controller.signal
    }
    const response = await fetch('https://api.cloudinary.com/v1_1/dyecgzt54/image/upload', options)
    const data = await response.json()
    return {id, url: data.url}
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.log('Upload cancelled')
    } else {
      throw new Error('Upload image failed')
    }
  }
}
