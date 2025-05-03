FROM node:18-alpine

WORKDIR /app

COPY package.json ./
COPY tsconfig.json ./
COPY src ./src

RUN npm install

EXPOSE 8080
CMD ["npm", "run", "dev"]  # or use ts-node-dev if installed
