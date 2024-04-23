#syntax=docker/dockerfile:1

FROM golang:1.21.0-alpine3.18 as build

WORKDIR /app

# 拷贝源代码
COPY go.mod go.sum src/*.go ./src/
RUN cd src && go mod download

# 编译
RUN cd src && \
    CGO_ENABLED=0 GOOS=linux go build -o /app/wenshu.bin


FROM scratch
# 从 stage 1 拷贝可执行文件
COPY --from=build /app/wenshu.bin /app/wenshu.bin
COPY config /app/config

ENV wenshu_profile=docker

# 端口
EXPOSE 9020 9021