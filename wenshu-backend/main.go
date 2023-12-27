package main

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
	"sync"
	"time"
)

var (
	AccountUrl   *url.URL
	AccountProxy *httputil.ReverseProxy
	WenshuUrl    *url.URL
	WenshuProxy  *httputil.ReverseProxy

	Now = func() string { return time.Now().Format("2006-01-02 15:04:05.000 ") }
)

func init() {
	log.SetOutput(io.MultiWriter(os.Stdout, newFileOutput("logs", "server", "2006-01-02-15")))

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
	// 设置代理请求的处理函数
	http.HandleFunc("/api/login", AccountProxy.ServeHTTP)                                 // 登录接口
	http.HandleFunc("/website/wenshu/181029CR4M5A62CH/index.html", WenshuProxy.ServeHTTP) // 主页html接口，需要访问主页获取一些加密盐
	http.HandleFunc("/website/parse/rest.q4w", WenshuProxy.ServeHTTP)                     // 获取页面数据接口
	http.HandleFunc("/waf_text_verify.html", WenshuProxy.ServeHTTP)                       // 验证码校验Ï

	// 启动服务器，监听端口8080
	log.Println("代理服务器已启动，监听端口9020...")
	if err := http.ListenAndServe(":9020", nil); err != nil {
		log.Fatal(err)
	}
}

// makePreRequest 创建请求前置操作
func makePreRequest(u *url.URL) func(*http.Request) {
	return func(r *http.Request) {
		log.Printf("收到请求 %s %s address=%s", r.Method, r.Host, r.RemoteAddr)
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
	}
}

func postRequest(resp *http.Response) error {
	response, _ := httputil.DumpResponse(resp, true)
	log.Printf("响应请求 %s", response)
	return nil
}

type FileLog struct {
	directory string
	prefix    string
	layout    string
	mu        sync.Mutex
	file      *os.File
}

func newFileOutput(directory, prefix, layout string) io.Writer {
	if err := os.MkdirAll(directory, 0744); err != nil {
		fmt.Printf(Now()+"can't create log directory %s", directory)
		return nil
	}
	return &FileLog{directory: directory, prefix: prefix, layout: layout}
}

func (f *FileLog) Write(p []byte) (n int, err error) {
	f.mu.Lock()
	defer f.mu.Unlock()
	if f.file == nil {
		if err = f.openExistingOrNew(); err != nil {
			return 0, err
		}
	}
	write, err := f.file.Write(p)
	return write, err
}
func (f *FileLog) openExistingOrNew() error {
	filename := f.filename()
	_, err := os.Stat(filename)
	if os.IsNotExist(err) {
		file, err := os.OpenFile(filename, os.O_CREATE|os.O_WRONLY|os.O_TRUNC, os.FileMode(0644))
		if err != nil {
			return err
		}
		f.file = file
	} else {
		file, err := os.OpenFile(filename, os.O_APPEND|os.O_WRONLY, 0644)
		if err != nil {
			return err
		}
		f.file = file
	}
	return nil
}

func (f *FileLog) filename() string {
	return fmt.Sprintf("%s/%s_%s.log", f.directory, f.prefix, time.Now().Format(f.layout))
}
