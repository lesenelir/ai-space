FROM node:alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm
RUN pnpm install

COPY . .

RUN npx prisma generate
RUN pnpm run build

EXPOSE 3000

CMD ["pnpm", "start"]
