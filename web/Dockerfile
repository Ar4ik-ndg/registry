FROM node:20.1-alpine as builder
LABEL authors="agniaendie,ar4ikoffc"

COPY . /web

WORKDIR /web

RUN npm install
RUN npm run build

FROM nginx:latest

COPY --from=builder /web/dist /usr/share/nginx/html

EXPOSE 80