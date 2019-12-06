# linux命令
* useradd testuser
* passwd testuser
* 删除 userdel -r testuser
* 备份 mysqldump -u irdms -p irdms > irdms_20180816.sql
* 切换用户 su username
* 查看进程 ps -ef|grep [irdms]
* 杀进程 kill -9 [pid]
* 加权限 chmod u+x [*]    u当前用户，a所有
* 执行 ./*.sh [start]
* redis
* ./redis-cli keys "EQUIPMENT_ORDER_STOCK:100001*" | xargs ./redis-cli del
* ./redis-cli keys "*"
* 时间
* date -R 系统时间(+0800表示东八区及中国时间)
* date -s '2019-10-18 11:32:00'
* clock 硬件时钟时间
* clock -w 根据系统时间设置硬件时钟
* 时区
* tzselect TZ='Asia/Shanghai' export TZ 重新登录

* 启动nginx域名访问
* jekins发布问题磁盘满

# linux环境变量
* vim /etc/profile
* :q 退出
* :wq 保存
* i 编辑 esc 退出
* JAVA_HOME=/usr/lib/jvm/java-1.8.0-openjdk-1.8.0.161-0.b14.el7_4.x86_64
* PATH=$PATH:$JAVA_HOME/bin:$JAVA_HOME/jre/bin
* export JAVA_HOME PATH
* source /etc/profile

查看IP ifconfig
javac -classpath ../hadoop-core-1.1.2.jar *.java
查看最新日志 tail
循环读取 tail -f
查看日志 cat
查看最老日志 head
查看Java进程 jps
删除第一行 sed '1d' train.csv
用户环境变量 vi ~/.bashrc 最下面增加
export HADOOP_HOME=/home/hadoop/hadoop-2.0
export PATH=$PATH:$HADOOP_HOME/bin 
