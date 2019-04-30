# Git
* git查代码行数

```sh
git log --author="chenhuihua" --pretty=tformat: --since=2019-4-18 --until=2019-4-19 --numstat | awk '{add+=$1;subs+=$2;loc+=$1-$2} END {printf "added lines:%s,removed lines:%s,total lines:%s",add,subs,loc}'
git clean -f -d -x 清理所有
```
