import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  safelist: [
    'bg-openai-b-0', 'text-openai-t-0', 'bg-openai-t-0',
    'bg-openai-b-1', 'text-openai-t-1', 'bg-openai-t-1',
    'bg-openai-b-2', 'text-openai-t-2', 'bg-openai-t-2',
    'bg-openai-b-3', 'text-openai-t-3', 'bg-openai-t-3',
    'bg-openai-b-4', 'text-openai-t-4', 'bg-openai-t-4',
    'bg-openai-b-5', 'text-openai-t-5', 'bg-openai-t-5',
    'bg-openai-b-6', 'text-openai-t-6', 'bg-openai-t-6',
  ],
  theme: {
    extend: {
      colors: {
        homepage: {
          'second-background': '#E1EBFE',
          'second-text': '#104194',
          'third-background': '#E9E8D8',
          'third-text': '#22321C',
        },
        chatpage: {
          'menu-background': '#202123',
          'menu-text': '#E3E3E8',
          'menu-hover':'#343540',
          'message-background-dark': '#343540',
          'message-background-light': '#f9fafb', /* gray-50 */
        },
        openai: {
          'b-0': '#235354',
          't-0': '#FFFFDF',
          'b-1': '#240647',
          't-1': '#D5FDFF',
          'b-2': '#20361B',
          't-2': '#F5C3FC',
          'b-3': '#3A083E',
          't-3': '#D4FDCC',
          'b-4': '#343324',
          't-4': '#FFFFDF',
          'b-5': '#FFFFDF',
          't-5': '#235354',
        }
      },
    },
  },
  plugins: [],
}
export default config
