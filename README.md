# AI-Space

## Introduction

This project is a chat application that uses various AI models to chat with users. 
The application is built with Next.js Pages Router and Tailwind CSS.

Tech Stack: Next.js (Pages Router) + React + TypeScript + Tailwind CSS + Jotai + AI + Prisma + MySQL (Client side storage will be added in the future)


## Features

- Frontend
  - [x] Website UI/UX accomplished with Tailwindcss, such as Home Page, Chat Page, etc
  - [x] Composed several UI components, such as Modal, Tabs, Tooltip components, etc
  - [x] Integrate clerk for login authentication 
  - [x] Home page animation 
  - [x] Dark mode and Light mode
  - [x] Mobile support
  - [x] I18n Internationalization
  - [x] Copy to clipboard 
  - [x] Markdown converted to html string and code highlighted
  - [x] Integrate stackblitz for previewing code
  - [x] Speech synthesis and speech recognition
  - [x] Images uploaded to Cloudinary and previewed
  - [x] Maintain the token consumption of each chat
  - [x] Using Jotai for global state management
  - [x] SSR to prefetch data, and hydrate the prefetched data on the client side 
  - [ ] Create and save screenshot 

- Backend
  - [x] Integrate mysql database and save the chat data to the server
  - [x] Create database tables and restful api routes for data persistence

![tables logo](/public/docs/dark.png#gh-dark-mode-only)
![tables logo](/public/docs/light.png#gh-light-mode-only)


> This project aims to build a full stack application, so I decided to save data to the server.
> 
> Maybe I will add client side storage in the future.

- OpenAI
  - [x] Integrate OpenAI API and add GPT-3.5 GPT-4 GPT-vision models
  - [x] Integrate vercel ai sdk for requesting openai api and implement the stream response
  - [x] Maintain the messages' array state on my own instead of using vercel ai sdk useChat hook
  - [x] Add maxTokens and temperature parameters to openai backend api
  - [x] Maintain the max history size parameter for chat context management 
  - [x] Add my copilots (system message) feature
  - [x] Add refresh the latest reply feature
  - [x] Add generate chat title feature


## Inspirations

- [https://openai.com/chatgpt](https://openai.com/chatgpt)
- [https://chat.openai.com](https://chat.openai.com)
- [https://chatkit.app](https://chatkit.app)
- [https://web.chatboxai.app](https://web.chatboxai.app)


## License
Code is licensed under [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0)
