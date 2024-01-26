# Changelog

This changelog provides a detailed record of the updates and improvements made to the project since its inception.

## Beta

### v0.0.1
> This version aims to complete the basic project setup and integrate the basic dependencies.

- Initialized project setup.
- Integrated `clerk` for authentication (login/logout).
- Integrated `prisma` for database management.


### v0.0.2
> This version aims to complete the basic UI design and code of the home page.

- Integrated `typewriter-effect` for home page animation.
- Completed homepage design and code.


### v0.0.3
> This version aims to complete the basic UI design and some basic logic of the chat page.

- Integrated `framer-motion` for enhanced UI animations.
- Implemented resizable UI for menu customization.
- UI components added:
  - dropdown
  - modal
  - select
  - textarea
  - resizable 
- Integrated `next-themes` for dark mode and theme switching.
- Integrated `next-i18next` for internationalization support.
- Completed basic implementation of the chat page.


### v0.0.4
> Integrated Mysql database and completed the basic implementation of the chatItem list component.

- Complete the frontend logic for MainMenuContent and ChatItemCard components.
- Implement pre-rendering of chatItem list data using ssr when accessing the chat page.
- Add `new chat api routes` and implement the logic for creating new chat.
- Add `delete chatItem api routes` and implement the logic for deleting chatItem.
- Add `update chatItem name routes` and implement the logic for updating chatItem name.
- Add `start chat api routes` and implement the logic for starting a chat.
- Integrated `Vitest` for testing.
- Integrated search functionality for chatItem list.
- Click on chatItem to open `/chat/uuid` page.
- Add `Model Table` for model management. When creating a new chat, the chatItem will be automatically detected the model id and saved to the database.
- Refactor Message Footer Component.
- UI components added:
  - button
  - input
  - tabs
  - tooltip
- Add `save openai key api routes` and implement the logic for saving openai key.
- Add `save gemini key api routes` and implement the logic for saving gemini key.
- Refactor Settings component.


### v0.0.5
> This version aims to integrate the OpenAI API and Gemini API into the project, and complete the basic implementation of the chat page.

- Add `ai` vercel AI SDK to request openai api and implement the stream response. (might not be a good choice)
- Add `saveUserInput` api routes and implement the logic for saving user input.
- Add `saveRobotMessage` api routes and implement the logic for saving the assistant robot message.
- Fix `delete chatItem api routes` for deleting chatItem related chatMessages data.
- UI components added:
  - slider
- Add `Chat Settings components` to Tabs components for setting chat parameters.
- Integrated `maxTokens and tempeture` parameters for openai backend api.
- Integrated `react-markdown` for markdown to html.
- Integrated `typography` for typography styles.
- Integrated `react-syntax-highlighter` for code syntax highlighting.
- Add `copy code` feature.
- Integrated `stackblitz` for previewing code.
- When you are waiting AI response, you could not send a message again. -> Loading tsx
- Remove `API_RequestLog` table and add `cost_tokens` field to `ChatMessage` table.
- Integrated display `token consumption` in chat page.
- Extract `useGetChatInformation hook` for getting chat information.
- Integrated `SpeechSynthesisUtterance api` for speech synthesis.
- Integrated `react-speech-recognition` for speech recognition.


### v0.0.6

- Refactor `Footer` component.
- Add `more icons and relevant dropdown components` to the `FooterHeader` component.
- Add `Ignore above messages` feature, but had some bugs. When rendering real time messages an array, the ignored above messages will not work after refreshing the page. Because the real time messages returned id type is string, haven't stored it in the database.
- Implement the deletion of all chatMessages in the current ChatItem.
- Add `GPT4 vision` model.
- Integrated `cloudinary` for image upload and image display.
- Abort `useChat hook` and Refactor `messages array` state for real time messages. (#BIG Feature)
- Abort `/api/chat/sendMessage` api routes and Add`/api/chat/send` api for real time messages.
- Refactor `/api/RobotMessage` api routes.
- Add `abort controller` for aborting stream response. When a user switches to another chatItem, the previous chatItem stream response will be aborted.
- Add `Max history size` feature for chat settings and implement the logic for sending the max history size to the model.
- Add `My Copilots` featured.
- Add `Refesh the latest reply` feature.
- Add `Generate chat title` feature.


### v0.0.7

- Add `docker-compose` for dockerized the project.
- Integrated `clsx` for className management.
- Complete `dall-E` page for generating images.
- Integrated `html2canvas` for generating screenshot.
- Drag and drop `image` to the chat input box for uploading image.
- Add `generate follow-up questions` feature.
