#syntax=docker/dockerfile:1

FROM golang:1.21.0-alpine3.18 as build

WORKDIR /app

COPY go.mod go.sum src/*.go ./src/
COPY config /app/config
RUN cd src && go mod download

# 编译
RUN cd src && \
    CGO_ENABLED=0 GOOS=linux go build -o /app/wenshu.bin

ENV wenshu_profile=docker

CMD ["/app/wenshu.bin"]