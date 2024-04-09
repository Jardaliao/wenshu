#syntax=docker/dockerfile:1

FROM node:18.16.0-alpine3.18 as build

WORKDIR /app

COPY src ./src
COPY index.html jsconfig.json package-lock.json package.json vite.config.js ./
RUN npm install && \
    npm run build


FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/lib/jarda/wenshu-web/html
COPY cert /usr/lib/jarda/wenshu-web/cert
COPY wenshu-web-443.conf /etc/nginx/conf.d/

# 端口
EXPOSE 80 443
