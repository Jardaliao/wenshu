package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
	"time"
)

import (
	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/os/gcfg"
	"github.com/gogf/gf/v2/os/glog"
)

var (
	AccountUrl   *url.URL
	AccountProxy *httputil.ReverseProxy
	WenshuUrl    *url.URL
	WenshuProxy  *httputil.ReverseProxy

	Now       = func() string { return time.Now().Format("2006-01-02 15:04:05.000 ") }
	profile   string
	ApLog     *glog.Logger
	ServerLog *glog.Logger
)

func init() {
	// 1 初始化环境变量，读取配置文件
	profile = os.Getenv("wenshu_profile")
	if "" != profile {
		g.Cfg().GetAdapter().(*gcfg.AdapterFile).SetFileName(fmt.Sprintf("config.%s.yaml", profile))
	}
	ApLog = g.Log("apLog")
	ServerLog = g.Log("serverLog")

	ApLog.Infof(context.TODO(), "程序启动，profile=%s", profile)

	// 2 必要的代理设置
	var err error
	// 初始化代理对象
	AccountUrl, err = url.Parse("https://account.court.gov.cn")
	if err != nil {
		panic(err)
	}
	AccountProxy = httputil.NewSingleHostReverseProxy(AccountUrl)
	AccountProxy.Director = makePreRequest(AccountUrl)
	AccountProxy.ModifyResponse = postRequest

	WenshuUrl, err = url.Parse("https://wenshu.court.gov.cn")
	if err != nil {
		panic(err)
	}
	WenshuProxy = httputil.NewSingleHostReverseProxy(WenshuUrl)
	WenshuProxy.Director = makePreRequest(WenshuUrl)
	WenshuProxy.ModifyResponse = postRequest
}

func main() {
	wenshuHandler := http.NewServeMux()
	// 设置代理请求的处理函数
	wenshuHandler.HandleFunc("/tongyiLogin/authorize", WenshuProxy.ServeHTTP) // 登录的初始接口，用于获取SESSION
	wenshuHandler.HandleFunc("/oauth/authorize", AccountProxy.ServeHTTP)      // 上一个接口响应的重定向地址，用于提权SESSION
	wenshuHandler.HandleFunc("/api/login", AccountProxy.ServeHTTP)            // 登录接口，获取HOLDON KEY

	wenshuHandler.HandleFunc("/website/wenshu/181029CR4M5A62CH/index.html", WenshuProxy.ServeHTTP) // 主页html接口，需要访问主页获取一些加密盐
	wenshuHandler.HandleFunc("/website/parse/rest.q4w", WenshuProxy.ServeHTTP)                     // 获取页面数据接口
	wenshuHandler.HandleFunc("/waf_text_verify.html", WenshuProxy.ServeHTTP)                       // 验证码校验Ï

	// 启动服务器，监听端口 9020
	ApLog.Infof(context.TODO(), "文书代理服务器已启动，监听端口9020...")
	if err := http.ListenAndServeTLS(
		":9020",
		"cert/wenshu.liaoxiaojie.cn.pem",
		"cert/wenshu.liaoxiaojie.cn.key",
		wenshuHandler); err != nil {
		log.Fatal(err)
	}
}

// makePreRequest 创建请求前置操作
func makePreRequest(u *url.URL) func(*http.Request) {
	return func(r *http.Request) {
		reqStr, _ := httputil.DumpRequest(r, true)
		ServerLog.Infof(context.TODO(), "收到请求 %s\naddress=%s\n", reqStr, r.RemoteAddr)
		r.URL.Scheme = u.Scheme
		r.URL.Host = u.Host
		r.Host = u.Host // 更改请求主机头以匹配目标服务器的主机

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
		originHeader := r.Header.Get("origin")
		if originHeader != "" {
			r.Header.Del("origin")
			r.Header.Set("Origin", originHeader)
		}
		refererHeader := r.Header.Get("referer")
		if refererHeader != "" {
			r.Header.Del("referer")
			r.Header.Set("Referer", refererHeader)
		}
		// 对端接口会检查User-Agent，这里固定用浏览器抓取到的Agent 固定UA
		r.Header.Del("user-agent")
		r.Header.Set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
	}
}

func postRequest(resp *http.Response) error {
	//response, _ := httputil.DumpResponse(resp, true)
	//log.Printf("响应请求 %s", response)
	return nil
}
