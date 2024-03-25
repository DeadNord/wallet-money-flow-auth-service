FROM node:16-alpine

WORKDIR /server

COPY . .
RUN npm install

EXPOSE 3002

CMD npm start