# 怎么部署？
## 本地部署
1. 安装 docker desktop
2. 在项目根目录运行 `docker-compose up -d`（默认使用 80 和 443 端口）
## 云服务器部署
- 编译后端服务
  - 安装 Golang 1.21.0
# 项目结构
```text
├── Readme.md
├── compose.yaml
├── wenshu-backend                      # 后端服务
│   ├── Dockerfile
│   ├── Makefile
│   ├── config                          # 日志等配置
│   │   ├── config.docker.yaml
│   │   ├── config.mac-local.yaml
│   │   ├── config.prod.yaml
│   │   ├── config.windows-local.yaml
│   │   └── config.yaml
│   ├── deb                             # 打包成 deb 的必要文件
│   │   ├── jarda-wenshu.service
│   │   ├── lifecycle
│   │   └── start.sh
│   ├── go.mod
│   ├── go.sum
│   ├── nfpm.yaml
│   └── src
│       └── main.go                     # 后端服务主要逻辑
└── wenshu-web                          # 前端服务
    ├── Dockerfile
    ├── Makefile
    ├── README.md
    ├── cert
    ├── index.html
    ├── jsconfig.json
    ├── node_modules
    ├── package-lock.json
    ├── package.json
    ├── public
    │   └── favicon.ico
    ├── src
    │   ├── App.vue
    │   ├── assets
    │   ├── components
    │   ├── main.js
    │   ├── router
    │   ├── store
    │   ├── utils
    │   └── views
    ├── vite.config.js
    ├── wenshu-web-443-docker.conf  # nginx 配置文件（docker 用）
    └── wenshu-web-443.conf         # nginx 配置文件
```