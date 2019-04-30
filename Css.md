# Css
* 固定导航栏

```
<html>
<head><title>项目记录</title></head>
<body>
<header class="header"></header>
<div class="container">
  <div class="mainCon"></div>
  <footer class="footer"></footer>
</div>
</body>
<ml>
html,body {
  height: 100%;
  overflow-y: hidden;
}
.header {
  position: fixed;
  height: 80px;
  width: 100%;
}
.container {
  height: calc(100% - 80px);
  margin-top: 80px;
  overflow-y: auto;
}
.footer {
    height: 100px;
}
.mainCon {
    min-height: calc(100% - 200px);
}
```
