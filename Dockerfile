FROM node:17-alpine

COPY src/*.js /usr/src/app/

WORKDIR /usr/src/app

ENTRYPOINT []
USER node