# Java
## 遍历删除

```java
// 使用for each 不加break会报错，如下遍历，map类似
Iterator<SysChargerDO> chargerDOIterator = chargerDOList.iterator();
while (chargerDOIterator.hasNext()) {
    if (mapIdList.contains(chargerDOIterator.next().getSysMapId())) {
        chargerDOIterator.remove();
        break;
    }
}
```

## double精度

```java
// Double转BigDecimal
Double a = 0.01;
BigDecimal b = new BigDecimal(a); // 丢失精度
BigDecimal b = new BigDecimal(a.toString()); // 正确
```

## 权重抽奖

```java
public static final int[] LUCKY_DRAW_WEIGHT_ARRAY = new int[]{1, 2, 3, 4, 5, 6};
int[] weightArray = Constants.LUCKY_DRAW_WEIGHT_ARRAY;
List<Integer> weightList = new ArrayList<>(Arrays.asList(ArrayUtils.toObject(weightArray)));
List<Integer> weightSumList = new ArrayList<>();
int sum = 0;
for (int weight : weightList) {
    weightSumList.add(sum);
    sum += weight;
}
Random random = new Random();
int rand = random.nextInt(sum);
int result = Constants.LUCKY_DRAW_NOT_WIN;
for (int i = weightSumList.size() - 1; i >= 0; i--) {
    if (rand >= weightSumList.get(i)) {
        result = i;
        break;
    }
}
return result;
```

## 总结
* 1 异常可能抛出数据库结构，防止日志打印不全

```java
// service
try{
	// ...
} catch (Exception e){
	logger.error(param.toString(), e);
	// logger.error("luckyDrawWeightArray={}, goodsSize={}", luckyDrawWeightArray, goodsSize, e);
    throw new ServiceException(e);
}

// controller
try {
	// ...
} catch (Exception e) {
	logger.error("分页查询用户商品分类列表失败！" + param.toString(), e);
	resultDTO.setInfo("分页查询用户商品分类列表失败！" + e.getMessage());
}

// ServiceException.java 统一规范，如果直接throw e;不需要，防止前台反馈英文
/**
 * controller层获取服务异常信息
 *
 * @return
 */
@Override
public String getMessage() {
	Throwable cause = this.getCause();
	if (cause == null) {
		return this.getMessage();
	} else {
		while (cause.getCause() != null) {
			cause = cause.getCause();
		}
		return cause.getMessage();
	}
}
```

* 2 service层，所有对外的方法增加check
* 3 安卓上传超时，修改tomcat超时时间，nginx文件大小，超时时间
* 4 activemq延迟任务开启，配置activemq.xml schedulerSupport="true"
* 5 tomcat当下载服务器用，service.xml增加

```xml
<Context path="/download" reloadable="true" docBase="d://static//download" crossContext="true"/>
```

catalina.sh增加

```sh
JAVA_OPTS="-server -XX:PermSize=128m -XX:MaxPermSize=512m"
```

## 跨域
CrossOrigin 不同机子跨域，同一机子配置nginx

## 工具
* 开源数据库工具 dbeaver
* 代码管理 Git
* 前端库 node.js
* linux文件传输 WinSCP
* linux命令 putty
* 开源前端开发 VSCodeSetup
* 代理 Shadowsocks

## java环境变量
* 1.系统变量 → 新建 JAVA_HOME
* 2.系统变量 → 编辑 Path += ;%JAVA_HOME%\bin;%JAVA_HOME%\jre\bin;
* 3.系统变量 → 新建 CLASSPATH = .;%JAVA_HOME%\lib;%JAVA_HOME%\lib\tools.jar
* 4.检验 java -version

## idea激活
* 使用前请将0.0.0.0 account.jetbrains.com添加到hosts
* EB101IWSWD-eyJsaWNlbnNlSWQiOiJFQjEwMUlXU1dEIiwibGljZW5zZWVOYW1lIjoibGFuIHl1IiwiYXNzaWduZWVOYW1lIjoiIiwiYXNzaWduZWVFbWFpbCI6IiIsImxpY2Vuc2VSZXN0cmljdGlvbiI6IkZvciBlZHVjYXRpb25hbCB1c2Ugb25seSIsImNoZWNrQ29uY3VycmVudFVzZSI6ZmFsc2UsInByb2R1Y3RzIjpbeyJjb2RlIjoiSUkiLCJwYWlkVXBUbyI6IjIwMTgtMTAtMTQifSx7ImNvZGUiOiJSUzAiLCJwYWlkVXBUbyI6IjIwMTgtMTAtMTQifSx7ImNvZGUiOiJXUyIsInBhaWRVcFRvIjoiMjAxOC0xMC0xNCJ9LHsiY29kZSI6IlJEIiwicGFpZFVwVG8iOiIyMDE4LTEwLTE0In0seyJjb2RlIjoiUkMiLCJwYWlkVXBUbyI6IjIwMTgtMTAtMTQifSx7ImNvZGUiOiJEQyIsInBhaWRVcFRvIjoiMjAxOC0xMC0xNCJ9LHsiY29kZSI6IkRCIiwicGFpZFVwVG8iOiIyMDE4LTEwLTE0In0seyJjb2RlIjoiUk0iLCJwYWlkVXBUbyI6IjIwMTgtMTAtMTQifSx7ImNvZGUiOiJETSIsInBhaWRVcFRvIjoiMjAxOC0xMC0xNCJ9LHsiY29kZSI6IkFDIiwicGFpZFVwVG8iOiIyMDE4LTEwLTE0In0seyJjb2RlIjoiRFBOIiwicGFpZFVwVG8iOiIyMDE4LTEwLTE0In0seyJjb2RlIjoiUFMiLCJwYWlkVXBUbyI6IjIwMTgtMTAtMTQifSx7ImNvZGUiOiJDTCIsInBhaWRVcFRvIjoiMjAxOC0xMC0xNCJ9LHsiY29kZSI6IlBDIiwicGFpZFVwVG8iOiIyMDE4LTEwLTE0In0seyJjb2RlIjoiUlNVIiwicGFpZFVwVG8iOiIyMDE4LTEwLTE0In1dLCJoYXNoIjoiNjk0NDAzMi8wIiwiZ3JhY2VQZXJpb2REYXlzIjowLCJhdXRvUHJvbG9uZ2F0ZWQiOmZhbHNlLCJpc0F1dG9Qcm9sb25nYXRlZCI6ZmFsc2V9-Gbb7jeR8JWOVxdUFaXfJzVU/O7c7xHQyaidCnhYLp7v32zdeXiHUU7vlrrm5y9ZX0lmQk3plCCsW+phrC9gGAPd6WDKhkal10qVNg0larCR2tQ3u8jfv1t2JAvWrMOJfFG9kKsJuw1P4TozZ/E7Qvj1cupf/rldhoOmaXMyABxNN1af1RV3bVhe4FFZe0p7xlIJF/ctZkFK62HYmh8V3AyhUNTzrvK2k+t/tlDJz2LnW7nYttBLHld8LabPlEEjpTHswhzlthzhVqALIgvF0uNbIJ5Uwpb7NqR4U/2ob0Z+FIcRpFUIAHEAw+RLGwkCge5DyZKfx+RoRJ/In4q/UpA==-MIIEPjCCAiagAwIBAgIBBTANBgkqhkiG9w0BAQsFADAYMRYwFAYDVQQDDA1KZXRQcm9maWxlIENBMB4XDTE1MTEwMjA4MjE0OFoXDTE4MTEwMTA4MjE0OFowETEPMA0GA1UEAwwGcHJvZDN5MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAxcQkq+zdxlR2mmRYBPzGbUNdMN6OaXiXzxIWtMEkrJMO/5oUfQJbLLuMSMK0QHFmaI37WShyxZcfRCidwXjot4zmNBKnlyHodDij/78TmVqFl8nOeD5+07B8VEaIu7c3E1N+e1doC6wht4I4+IEmtsPAdoaj5WCQVQbrI8KeT8M9VcBIWX7fD0fhexfg3ZRt0xqwMcXGNp3DdJHiO0rCdU+Itv7EmtnSVq9jBG1usMSFvMowR25mju2JcPFp1+I4ZI+FqgR8gyG8oiNDyNEoAbsR3lOpI7grUYSvkB/xVy/VoklPCK2h0f0GJxFjnye8NT1PAywoyl7RmiAVRE/EKwIDAQABo4GZMIGWMAkGA1UdEwQCMAAwHQYDVR0OBBYEFGEpG9oZGcfLMGNBkY7SgHiMGgTcMEgGA1UdIwRBMD+AFKOetkhnQhI2Qb1t4Lm0oFKLl/GzoRykGjAYMRYwFAYDVQQDDA1KZXRQcm9maWxlIENBggkA0myxg7KDeeEwEwYDVR0lBAwwCgYIKwYBBQUHAwEwCwYDVR0PBAQDAgWgMA0GCSqGSIb3DQEBCwUAA4ICAQC9WZuYgQedSuOc5TOUSrRigMw4/+wuC5EtZBfvdl4HT/8vzMW/oUlIP4YCvA0XKyBaCJ2iX+ZCDKoPfiYXiaSiH+HxAPV6J79vvouxKrWg2XV6ShFtPLP+0gPdGq3x9R3+kJbmAm8w+FOdlWqAfJrLvpzMGNeDU14YGXiZ9bVzmIQbwrBA+c/F4tlK/DV07dsNExihqFoibnqDiVNTGombaU2dDup2gwKdL81ua8EIcGNExHe82kjF4zwfadHk3bQVvbfdAwxcDy4xBjs3L4raPLU3yenSzr/OEur1+jfOxnQSmEcMXKXgrAQ9U55gwjcOFKrgOxEdek/Sk1VfOjvS+nuM4eyEruFMfaZHzoQiuw4IqgGc45ohFH0UUyjYcuFxxDSU9lMCv8qdHKm+wnPRb0l9l5vXsCBDuhAGYD6ss+Ga+aDY6f/qXZuUCEUOH3QUNbbCUlviSz6+GiRnt1kA9N2Qachl+2yBfaqUqr8h7Z2gsx5LcIf5kYNsqJ0GavXTVyWh7PYiKX4bs354ZQLUwwa/cG++2+wNWP+HtBhVxMRNTdVhSm38AknZlD+PTAsWGu9GyLmhti2EnVwGybSD2Dxmhxk3IPCkhKAK+pl0eWYGZWG3tJ9mZ7SowcXLWDFAk0lRJnKGFMTggrWjV8GYpw5bq23VmIqqDLgkNzuoog==
