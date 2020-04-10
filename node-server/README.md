# 启动方式：

## 启动本地 mysql

```
sudo /usr/local/MySQL/support-files/mysql.server start
```

## 使用 http-server 启动静态页面

```
http-server -p 8001
```

## 启动 nginx

```
nginx
```

## 启动本地 redis

```
redis-server
```

## 启动 node 程序

```
npm run dev
```

### 模块化标准 -- commonJS

#### 好处：

- 代码可以拆分
- 函数方法的复用
- 单一值原则
- 业务逻辑结构化

### debugger 方式：

- 使用 vscode 软件
- 使用 git 管理工具、

### server 端和前端的区别：

- 语言和环境、规则、工具、思维的问题
- 服务稳定性：服务不能挂掉
  - server 可能会遭受各种恶意攻击和误操作（接口暴露在整个互联网之下）
  - 单个客户端可以意外挂掉，但是服务端不能
  - PM2 做进程守候（进程如果挂掉就会自动重启，不用人工干预）
- 考虑内存和 cpu（优化、扩展）
  - 客户端独占一个浏览器，内存、CPU 都不是问题
  - server 端需要承载很多很多请求，cpu 和内存都是稀缺资源，让一个服务器承载更多的请求
  - 使用 stream 写日志（针对内存和 cpu 的优化），使用 redis 存 session（对内存和 cpu 进行扩展）
- 日志记录
  - 前端也会参与写日志、但是只是日志的发起方，不关心后续
  - server 端需要记录日志、存储日志、分析日志、前端不用关心
- 安全（server 端是安全最后的保障）
  - server 端要随时准备接受各种恶意攻击，前端则比较少（XSS）
  - 如：越权操作，数据库攻击等
  - 登录验证，预防 xss 攻击和 sql 注入等
- 集群和服务拆分
  - 如果流量迅速增加，通过扩展机器和服务拆分来承载更大的流量

## 需求分析：

### 目标：

- 开发一个博客系统，具有博客的基本功能（查看、管理、注册、登录等）

### 需求：

- 首页，作者主页，博客详情页
- 登录页
- 管理中心，新建页，编辑页

### 技术方案：

- 数据库如何存储
  - 博客
    - 存储博客（格式见表数据库设计 1-1）
  - 用户
    - 存储用户（格式见表数据库设计 1-2）
- 如何与前端对接（接口设计）
  - 见接口设计图
  - 登录：使用业界统一的解决方案，没有重新设计

### `http`请求概述：

- 从输入 URL 到显示页面的整个过程：
  - DNS 解析，建立 TCP 链接，发送 http 请求
  - server 接受到 http 请求，处理，并返回
  - 客户端接受到返回数据，处理数据（渲染页面，执行 js 等）

### nodejs 处理 http 请求:

- get 请求和 querystring（querystring.parse，将 a=100&b=200 转换为对象的格式）
- post 请求和 post data（post 发送数据的一种描述）: 使用数据流的形式
- 路由

### 使用到的工具：

- 使用 nodemon 检测文件变化，自动重启 node
- 使用 cross-env 设置环境变量，兼容 mac、linux、windows

### mySQL 数据库

#### 介绍：

- web server 中最流行的关系型数据库
- 轻量级别，易用

#### 操作数据库：

- 建库：
- 建表：
- 表操作：
  - 增：`insert into users (username,`password`,realname) values ('zhangsna','123','张三');`
  - 删：`delete`
  - 改：`update`
  - 查：`select * from users;`、`select id,username from users;`

### 登录处理：

- 登录校验：

  - cookie:
    - 跨域不共享（浏览器给每个域名存储一个 cookie）前端和 server 端必须同域（nginx 做代理，让前后端同域）
    - 每次发送 http 请求，会将请求域的 cookie 一起发送给 server
    - server 修改 cookie 并返回给浏览器
    - 浏览器中也可以通过 js 修改 cookie（有限制）
  - ## session:
  - redis(内存数据库 key-vlaue):
    - brew install redis
    - redis-server
    - redis-cli
    - set myname wangershi
    - get myname ('wangershi')
    - del myname
  - 用 redis :
    - 进程内存有限，访问量过大的时候，内存暴增（session 过多），导致进程崩溃
    - 正式线上是多进程，进程之间内存无法共享
    - session 是存储在 Heap(堆)中的，当 session 过高，会导致崩溃
  - nginx ：

- 登录信息存储：

- 静态前端页面以服务端的形式启动：

  - 使用 http-server
  - http-server -p 8001 设置一个端口
  - 即可将静态页面以服务端的形式展示出来

- 使用 nginx 做代理

* nginx 高性能的 web 服务器
* 一般用于静态服务、负载均衡等（server 集群，有一个是主机器，其他的如何分摊流量，使得性能最高）
* 反向代理

- nginx 下载 brew install nginx
- nginx 配置 /usr/local/etc/nginx/nginx.conf
- 常用命令：
  - nginx -t 测试配置文件是否正确
  - 启动 nginx : nginx
  - 重启 nginx: nginx -s reload
  - 停止：nginx -s stop

### 日志

#### 访问日志(access log)记录每次请求的情况

#### 自定义日志(包括自定义事件、错误记录等)

#### 将日志放在文件中(node.js 文件操作)

#### node.js 流

#### 日志文件拆分，日志内容分析

## IO 操作的性能瓶颈

- IO : "网络 IO"和"文件 IO"
- 相比于 CPU 计算和内存读写，IO 的特点就是慢
- 在有限的硬件资源下提高 IO 操作效率

### stream(流)：

### 日志拆分：

- 日志内容会慢慢积累，放在一个文件中不好处理
- 可以按时间划分日志文件
- 实现方式：linux 的 crontab 命令,即定时任务

### crontab

- 设置定时任务： 格式： **\***command(\* 从左到右依次是，分钟、小时、日期、月份、星期)
- 将 access.log 拷贝并重命名为 2019-02-10.access.log
- 清空 access.log 文件，继续积累日志

#### crontab 的使用

```
crontab -e 打开编辑器
1 * 0 * * * sh /Users/macpro/My/font-end/个人项目源码/node-blog/src/utils/copy.sh
```

在每天 0 点出发执行该脚本

```
crontab -l 查看任务
```

### 日志分析

- 按行分析，使用 nodeJS 的 readline（基于 stream）

## 上线配置

### PM2 实现

- 服务器稳定性
  - 进程守护，系统崩溃自动重启
  - 使用 node 或者 nodemon 启动程序，进程崩溃则无法访问
  - pm2 如果遇到进程崩溃，会自动重启
  - 启动多进程，充分利用 CPU 和内存
  - 自带日志记录功能
- 利用服务器硬件资源，提高性能
- 线上日志记录

### PM2 介绍：

- 线上环境下用于启动 node.js 的进程守护的工具
- 下载安装 `npm install pm2 -g` pm2 --version

#### 基本使用

#### pm2 常用命令：

- pm2 start ...(启动的程序名或者配置文件)
- pm2 list pm2 的进程列表
- pm2 restart <Appname>/<id>
- pm2 stop <Appname>/<id>
- pm2 delete <Appname>/<id>
- pm2 info <Appname>/<id>
- pm2 log <Appname>/<id>
- pm2 monit <Appname>/<id>

#### pm2 常用配置

- 新建 PM2 配置文件（进程数量、日志文件目录等）
- 修改 PM2 启动命令
- 访问 server，检查日志文件的内容

#### 多进程：

- 为何使用多进程

  - 提高服务器稳定性，各个进程互不影响

  * 单个进程内存受限

  - 提高 cpu 和硬件的使用效率

- 多进程和 redis
  - 多进程可以共享 redis
  - 多进程之间，内存无法共享（使用 redis）
  - 多进程自带负载均衡规则

## 安全：

### sql 注入：窃取数据库内容

- 输入一个 sql 片段，最终拼接成一段攻击代码
- 预防措施：使用 mysql 的 escape 函数处理输入内容即可

### xss 攻击：窃取前端的 cookie 的内容

- 攻击方式：在页面中展示内容中参杂 js 代码，以获取网页信息
- 预防方式：转换生成 js 的字符串
  - & -> &amp;
  - < -> &lt;
  - -> &gt;
  - '' -> &quot;
  - ' -> &#x27;
  - / -> &#x2F;
- 预防工具：xss 包（`npm install xss --save`）

### 密码加密：保障用户信息安全

- 万一数据库被用户攻破，最不应该泄漏的就是用户信息
- 加密算法

### 有些攻击需要硬件和服务来支持（需要 OP 支持），如 DDOS
