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
* 异常可能抛出数据库结构，防止日志打印不全

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

* service层，所有对外的方法增加check
* 安卓上传超时，修改tomcat超时时间，nginx文件大小，超时时间
* activemq延迟任务开启，配置activemq.xml schedulerSupport="true"
* tomcat当下载服务器用，service.xml增加

```xml
<Context path="/download" reloadable="true" docBase="d://static//download" crossContext="true"/>
```

catalina.sh增加

```sh
JAVA_OPTS="-server -XX:PermSize=128m -XX:MaxPermSize=512m"
```

* 枚举

```java
public enum BoxCabinStatusEnum {

    NORMAL("1", "正常"),
    ERROR("2", "异常");

    private String code;
    private String desc;

    BoxCabinStatusEnum(String code, String desc) {
        this.code = code;
        this.desc = desc;
    }

    public static String getDescByCode(String code) {
        for (BoxCabinStatusEnum e : BoxCabinStatusEnum.values()) {
            if (e.code.equals(code)) {
                return e.desc;
            }
        }
        return null;
    }

    public String getCode() {
        return code;
    }

    public String getDesc() {
        return desc;
    }
}
```

* 文件操作

```java
if (file.exists()) {
	if (!file.delete()) {
		logger.error(file.getName() + " delete fail");
	}
}
if (!file.exists()) {
	if (!file.mkdirs()) {
		logger.error(file.getName() + " create fail");
	}
}
```

* 测试

```java
public class SystemControllerTest {

    private static final String URL = "http://172.18.0.103:8082/web-waybill/system/";
    private HttpHeaders headers;
    private RestTemplate restTemplate;
    private ResponseEntity<String> response;

    @Before
    public void setUp() throws Exception {
        headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON_UTF8);
        restTemplate = new RestTemplate();
    }

    @After
    public void tearDown() throws Exception {
        if (response == null) return;
        Assert.isTrue(response.getStatusCode().value() == 200, "请求失败！");
        JSONObject jsonObject = JSONObject.parseObject(response.getBody());
        System.out.println(jsonObject);
        Assert.isTrue("1".equals(jsonObject.get("code")));
    }

    @Test
    public void queryCountryList() {
        HttpEntity httpEntity = new HttpEntity<>(headers);
        response = restTemplate.exchange(URL + "queryCountryList", HttpMethod.POST, httpEntity, String.class);
    }
}
```

* spring日志屏蔽

```xml
log4j.logger.org.springframework = ${log4j.ale}
```

* spring事务提交后执行

```java
TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronizationAdapter() {
    @Override
    public void afterCommit() {
        // do something
    }
});
```

* tx-lcn分布式事务
超时回滚不抛错配置超时时间大于dubbo服务https://www.txlcn.org/zh-cn/docs/setting/manager.html
dubbo默认10秒，tx-lcn默认5秒
不支持线程操作db
不支持spring事务提交后执行


* dubbo
dubbo坑，跨service无法处理对象

* lts
lts-admin linux访问报spring错误，配置lts-admin.sh文件，找到nohup "$JAVA"增加-Djava.io.tmpdir="$LTS_ADMIN_HOME/../tmp"
jobtractor重启后，重启jobclient服务，如service-task

## 跨域
CrossOrigin 不同机子跨域，同一机子配置nginx

## token
前后分离场景下使用jwt登录流程
* 单token
1. 在登录接口中，根据用户id和用户类型创建jwt token(有效期设置为-1，即永不过期)，得到A
2. 更新登录日期(当前时间new Date()即可)（业务上可选），得到B
3. 在redis中缓存key为ACCESS_TOKEN:userId:A(加上A是为了防止用户多个客户端登录 造成token覆盖),value为B的毫秒数（转换成字符串类型），过期时间为7天（7 * 24 * 60 * 60）
4. 在登录结果中返回json格式为{"result":"success","token": A}
5. 接口header携带token，后端拦截器，解析失败，返回（code = 0 ,info= Token验证不通过, errorCode = '1001'）；
解析成功，验证redis中key为ACCESS_TOKEN:userId:A，不存在返回（code = 0 ,info= 会话过期请重新登录, errorCode = '1002'）；
如果缓存key存在，则自动续7天超时时间（value不变），实现频繁登录用户免登陆。
7. 如果是修改密码或退出登录 则废除access_tokens（删除key）

* 双token
1.登录成功，后台jwt生成access_token（jwt有效期30分钟）和refresh_token（jwt有效期15天），并缓存到redis（hash-key为token,sub-key为手机号,value为设备唯一编号（根据手机号码，可以人工废除全部token，也可以根据sub-key,废除部分设备的token。），设置过期时间为1个月，保证最终所有token都能删除)，返回后，客户端缓存此两种token;
2.使用access_token请求接口资源，校验成功且redis中存在该access_token（未废除）则调用成功；如果token超时，中间件删除access_token（废除）；客户端再次携带refresh_token调用中间件接口获取新的access_token;
3.中间件接受刷新token的请求后，检查refresh_token是否过期。
如过期，拒绝刷新，删除refresh_token（废除）； 客户端收到该状态后，跳转到登录页；
如未过期，检查缓存中是否有refresh_token（是否被废除），如果有，则生成新的access_token并返回给客户端，客户端接着携带新的access_token重新调用上面的资源接口。
4.客户端退出登录或修改密码后，调用中间件注销旧的token(中间件删除access_token和refresh_token（废除）)，同时清空客户端侧的access_token和refresh_toke。
5.如手机丢失，可以根据手机号人工废除指定用户设备关联的token。
6.以上3刷新access_token可以增加根据登录时间判断最长X时间必须重新登录，此时则拒绝刷新token。（拒绝的场景：失效，长时间未登录，频繁刷新）

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
