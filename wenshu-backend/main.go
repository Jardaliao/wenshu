package main

import (
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
)

var UrlMapping = map[string]string{
	`liaoxiaojie.cn/wenshu`: `account.court.gov.cn`,
}

func handleProxy(w http.ResponseWriter, r *http.Request) {
	// 目标服务器的地址
	targetURL := "http://目标服务器IP或域名:端口号" // 替换为目标服务器的实际地址

	// 解析目标URL
	target, err := url.Parse(targetURL)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadGateway)
		return
	}

	// 创建反向代理
	proxy := httputil.NewSingleHostReverseProxy(target)

	// 更改请求主机头以匹配目标服务器的主机
	r.Host = target.Host

	// 执行代理请求
	proxy.ServeHTTP(w, r)
}

func main() {
	// 设置代理请求的处理函数
	http.HandleFunc("/wenshu", handleProxy)

	// 启动服务器，监听端口8080
	log.Println("代理服务器已启动，监听端口8080...")
	if err := http.ListenAndServe(":9020", nil); err != nil {
		log.Fatal(err)
	}
}
