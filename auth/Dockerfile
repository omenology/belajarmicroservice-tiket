FROM node:17.1.0-alpine3.12

WORKDIR /app
COPY ./ ./
RUN yarn install

CMD ["yarn", "dev"]