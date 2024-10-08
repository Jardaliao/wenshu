<p align="center">
    <img src="assets/1.jpg" width="200" />
    <img src="assets/2.jpg" width="200" />
    <img src="assets/3.jpg" width="200" />
    <img src="assets/4.jpg" width="200" />
    <img src="assets/5.jpg" width="200" />
    <img src="assets/6.jpg" width="200" />
</p>

# 怎么运行
！！！用用不着的文书网账号测试，部署调试很容易喜提封号
1. 安装 docker desktop
2. 在项目根目录运行 `docker-compose up -d`（默认使用 8080 端口）

# 项目结构
```text
├── Readme.md
├── compose.yaml
├── wenshu-backend                      # 后端服务
│   ├── Dockerfile
│   ├── config                          # 日志等配置
│   │   ├── config.docker.yaml
│   │   ├── config.mac-local.yaml
│   │   ├── config.prod.yaml
│   │   ├── config.windows-local.yaml
│   │   └── config.yaml
│   ├── go.mod
│   ├── go.sum
│   └── src
│       └── main.go                     # 后端服务主要逻辑
└── wenshu-web                          # 前端服务
    ├── Dockerfile
    ├── README.md
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
    ├── wenshu-web-443-docker.conf
```