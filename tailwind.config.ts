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
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '0.2' },
          '20%': { opacity: '1' },
        },
        record: {
          '0%': { opacity: '1' },
          '50%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        spinReverse: {
          from : {
            transform: 'rotate(360deg)',
          },
          to: {
            transform: 'rotate(0deg)',
          }
        }
      },
      animation: {
        blink: 'blink 1.4s infinite both',
        record: 'record 1.5s infinite both',
        slowSpin: 'spin 2s linear infinite',
        spinReverse: 'spinReverse 1.5s linear infinite',
      },
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
          'message-text-dark': '#D1D5DB', /* gray-300 */
          'message-text-strong-dark': '#ECECF1',
          'message-robot-content-dark': '#444652',
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
      typography: {
        DEFAULT: {
          css: {
            p: {
              margin: '0',
            },
            ol: {
              margin: '0',
            },
            ul: {
              margin: '0',
            },
            li: {
              '> p': {
                margin: '0',
              },
              margin: '0',
            },
            pre: {
              '>code': {
                color: '#374151'
              },
              margin: '0',
              backgroundColor: 'transparent',
            },
            code: {
              margin: '0',
            },
          }
        },
        invert: {
          css: {
            pre: {
              '>code': {
                color: '#D1D5DB'
              }
            }
          }
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
export default config
