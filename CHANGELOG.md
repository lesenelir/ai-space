# Changelog

This changelog provides a detailed record of the updates and improvements made to the project since its inception.

## Beta

### v0.0.1

- Initialized project setup.
- Integrated `clerk` for authentication (login/logout).
- Integrated `prisma` for database management.


### v0.0.2

- Integrated `typewriter-effect` for home page animation.
- Completed homepage design and code.

### v0.0.3

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


