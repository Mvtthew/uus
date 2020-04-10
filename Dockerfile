FROM node:13

WORKDIR /usr/src/app

COPY *.json ./

RUN npm install

COPY ./src ./src

EXPOSE 21000

RUN npm run build

CMD ["npm", "start"]