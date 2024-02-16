FROM node:20.9.0

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build

CMD ["node", "dist/index.js"]