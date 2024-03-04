#!/bin/bash

export wenshu_profile=prod

# 启动服务
exec ./wenshu.bin &

# 启动服务的返回值
retval=$?

# 服务的pid
pid=$!

# 如果返回值非0，失败退出
[ $retval -eq 0 ] || exit $retval

# pid空，失败退出，否则成功退出
if ! ps -p $pid > /dev/null ; then
  exit 1
fi
exit 0