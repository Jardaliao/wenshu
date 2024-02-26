package main

import (
	"context"
	"fmt"
	"github.com/gogf/gf/v2/os/glog"
	"io"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
	"sync"
	"time"
)

import (
	"github.com/gogf/gf/v2/frame/g"
	"github.com/gogf/gf/v2/os/gcfg"
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
	server := http.NewServeMux()
	server.HandleFunc("/", func(writer http.ResponseWriter, request *http.Request) {
		writer.Write([]byte("Hello World!"))
	})
	go func() {
		if err := http.ListenAndServe(":80", server); err != nil {
			ApLog.Errorf(context.TODO(), "%+v", err)
		}
	}()
	go func() {
		if err := http.ListenAndServe(":443", server); err != nil {
			ApLog.Errorf(context.TODO(), "%+v", err)
		}
	}()
	// 设置代理请求的处理函数
	http.HandleFunc("/tongyiLogin/authorize", WenshuProxy.ServeHTTP)                      // 登录的初始接口，用于获取SESSION
	http.HandleFunc("/oauth/authorize", AccountProxy.ServeHTTP)                           // 上一个接口响应的重定向地址，用于提权SESSION
	http.HandleFunc("/api/login", AccountProxy.ServeHTTP)                                 // 登录接口，获取HOLDON KEY
	http.HandleFunc("/website/wenshu/181029CR4M5A62CH/index.html", WenshuProxy.ServeHTTP) // 主页html接口，需要访问主页获取一些加密盐
	http.HandleFunc("/website/parse/rest.q4w", WenshuProxy.ServeHTTP)                     // 获取页面数据接口
	http.HandleFunc("/waf_text_verify.html", WenshuProxy.ServeHTTP)                       // 验证码校验Ï

	// 启动服务器，监听端口8080
	ApLog.Infof(context.TODO(), "代理服务器已启动，监听端口9020...")
	//if err := http.ListenAndServeTLS(
	//	":9020",
	//	"/opt/app-config/jarda/wenshu/keystore/wenshu.liaoxiaojie.cn.pem",
	//	"/opt/app-config/jarda/wenshu/keystore/wenshu.liaoxiaojie.cn.key",
	//	nil); err != nil {
	//	log.Fatal(err)
	//}
	if err := http.ListenAndServe(":9020", nil); err != nil {
		ApLog.Fatal(context.TODO(), err)
	}
}

// makePreRequest 创建请求前置操作
func makePreRequest(u *url.URL) func(*http.Request) {
	return func(r *http.Request) {
		ServerLog.Infof(context.TODO(), "收到请求 %s %s address=%s", r.Method, r.Host, r.RemoteAddr)
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
