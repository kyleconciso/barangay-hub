FROM node:18-alpine

WORKDIR /usr/app

COPY package.json ./

RUN npm install --only=production

COPY . .

EXPOSE 8080

CMD ["node", "app.js"]