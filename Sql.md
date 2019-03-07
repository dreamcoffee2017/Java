# mysql
* 安装路径 whereis mysql
* 导出 mysqldump -u irdms -p irdms > irdms_20180816.sql
* 导入 mysql -u irdms -p irdms < irdms_20180816.sql
* 查询隔离级别 SELECT @@tx_isolation
* 1）read uncommitted : 读取尚未提交的数据 ：哪个问题都不能解决
* 2）read committed：读取已经提交的数据 ：可以解决脏读 ---- oracle默认的
* 3）repeatable read：重读读取：可以解决脏读 和 不可重复读 ---mysql默认的
* 4）serializable：串行化：可以解决 脏读 不可重复读 和 虚读---相当于锁表
* 行级锁需要明确id
* 根据字段名查询表

```sql
select TABLE_SCHEMA `database`,TABLE_NAME `table`
from information_schema.`COLUMNS`
where TABLE_SCHEMA='irdms_dev' and COLUMN_NAME='ord_points_order_id'
```