package main

import (
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
)

var (
	TargetUrl   *url.URL
	TargetProxy *httputil.ReverseProxy
)

func init() {
	var err error
	// 初始化代理对象
	TargetUrl, err = url.Parse("https://account.court.gov.cn")
	if err != nil {
		panic(err)
	}
	TargetProxy = httputil.NewSingleHostReverseProxy(TargetUrl)
	TargetProxy.Director = func(r *http.Request) {
		log.Printf("收到请求 %s %s address=%s", r.Method, r.Host, r.RemoteAddr)
		r.URL.Scheme = TargetUrl.Scheme
		r.URL.Host = TargetUrl.Host
		r.Host = TargetUrl.Host // 更改请求主机头以匹配目标服务器的主机

		// 小程序的请求头会自动把首字母转小写，这里把它转成大写
		ctHeader := r.Header.Get("content-type")
		if ctHeader != "" {
			r.Header.Del("content-type")
			r.Header.Set("Content-Type", ctHeader)
		}
		cHeader := r.Header.Get("cookie")
		if cHeader != "" {
			r.Header.Del("cookie")
			r.Header.Set("Cookie", cHeader)
		}
	}
	TargetProxy.ModifyResponse = func(resp *http.Response) error {
		response, _ := httputil.DumpResponse(resp, true)
		log.Printf("响应请求 %s", response)
		return nil
	}
}

func main() {
	// 设置代理请求的处理函数
	http.HandleFunc("/api/login", TargetProxy.ServeHTTP)                                 // 登录接口
	http.HandleFunc("website/wenshu/181029CR4M5A62CH/index.html", TargetProxy.ServeHTTP) // 主页html接口，需要访问主页获取一些加密盐
	http.HandleFunc("/website/parse/rest.q4w", TargetProxy.ServeHTTP)                    // 获取页面数据接口

	// 启动服务器，监听端口8080
	log.Println("代理服务器已启动，监听端口9020...")
	if err := http.ListenAndServe(":9020", nil); err != nil {
		log.Fatal(err)
	}
}
