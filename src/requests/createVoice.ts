import { toast } from 'sonner'

export const createVoice = async (
  text: string,
  voice: string,
  format: string,
  model: string,
  speed: number,
) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      text,
      voice,
      format,
      model,
      speed
    })
  }

  try {
    return await fetch('/api/tts/createVoice', options)
  } catch (e) {
    toast.error('Error creating voice')
  }
}
