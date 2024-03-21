FROM node:14.16.1-alpine

WORKDIR /server

COPY . .
RUN npm install

EXPOSE 3002

CMD npm start