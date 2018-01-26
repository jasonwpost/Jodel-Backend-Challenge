FROM node:carbon

WORKDIR /home/api
ADD . /home/api

RUN npm install

EXPOSE 3000

CMD npm start