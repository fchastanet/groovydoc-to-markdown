FROM node:17-alpine

WORKDIR /usr/src/app

COPY src/*.js /usr/src/app/
COPY package*.json /usr/src/app/
RUN set -x \
  && npm ci

ENTRYPOINT []
USER node