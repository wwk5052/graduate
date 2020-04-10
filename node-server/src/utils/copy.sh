#!/bin/sh
cd /Users/macpro/My/font-end/个人项目源码/node-blog/logs
# 拷贝
cp access.log $(date +%Y-%m-%d).access.log
# 清空
echo "" > access.log

# 运行  sh copy.sh