FROM node:18-alpine
COPY ./app.js /usr/app/
COPY ./package.json /usr/app/
WORKDIR /usr/app
RUN npm install
CMD ["node", "app.js"]
