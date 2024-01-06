export function getModelName(id: number) {
  switch (id) {
    case 1:
      return 'gpt-3.5-turbo'
    case 2:
      return 'gpt-4-1106-preview' // gpt4-turbo
    case 3:
      return 'gpt-4-vision-preview' // gpt4 vision
    case 4:
      return 'gemini' // TODO: get gemini model name
  }
}
