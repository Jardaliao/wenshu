#syntax=docker/dockerfile:1

FROM node:18.16.0-alpine3.18 as build

WORKDIR /app

COPY src ./src
COPY index.html jsconfig.json package-lock.json package.json vite.config.js ./
# 编译到 dist 目录
RUN npm install && \
    npm run build


FROM nginx:stable-alpine
# 从 上个stage 的 dist 目录拷贝到下一 stage
COPY --from=build /app/dist /usr/lib/jarda/wenshu-web/html
COPY cert /usr/lib/jarda/wenshu-web/cert
COPY wenshu-web-443-docker.conf /etc/nginx/conf.d/default.conf

# 端口
EXPOSE 80 443
