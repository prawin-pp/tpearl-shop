ARG NODE_ENV=development

FROM node:lts-alpine as build

ENV NODE_ENV=$NODE_ENV

RUN set -e; apk add --no-cache bash git
RUN npm install -g vite typescript

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:latest as server

WORKDIR /usr/share/nginx/html

COPY --from=build /usr/src/app/dist /usr/share/nginx/html
COPY devtools/nginx/nginx.conf /etc/nginx/conf.d/default.conf
