FROM node:18-alpine

WORKDIR /app

COPY package.json ./
COPY tsconfig.json ./
COPY vite.config.ts ./
COPY src ./src
COPY public ./public

RUN npm install

EXPOSE 5173
CMD ["npm", "run", "dev"]
