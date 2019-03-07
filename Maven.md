# Maven
三大特性：属性、Profile和资源过滤

## 属性
六种
* 内置属性：${basedir}表示项目根目录，${version}表示项目版本。
* POM属性：pom中对应元素的值。例如${project.artifactId}对应了<project><artifactId>元素的值。
* 自定义属性：在pom中<properties>元素下自定义的Maven属性。例如

```mxl
<properties>  
	<my.prop>hello</my.prop>  
</properties>
```
* Settings属性：与POM属性同理。如${settings.localRepository}指向用户本地仓库的地址。
* Java系统属性：所有Java系统属性都可以使用Maven属性引用，例如${user.home}指向了用户目录。可以通过命令行mvn help:system查看所有的Java系统属性
* 环境变量属性：所有环境变量都可以使用以env.开头的Maven属性引用。例如${env.JAVA_HOME}指代了JAVA_HOME环境变量的值。也可以通过命令行mvn help:system查看所有环境变量。

## 资源过滤
自动替换配置文件中以${}包裹的变量
* 默认情况下，Maven属性只有在POM中才会被解析。资源过滤就是指让Maven属性在资源文件(src/main/resources、src/test/resources)中也能被解析。

```xml
<build>
	<resources>
		<resource>
			<directory>src/main/resources</directory>
			<filtering>true</filtering>
		</resource>
	</resources>
	<testResources>
		<testResource>
			<directory>src/test/resources</directory>
			<filtering>true</filtering>
		</testResource>
	</testResources>
</build>
```
* Maven除了可以对主资源目录、测试资源目录过滤外，还能对Web项目的资源目录(如css、js目录)进行过滤。这时需要对maven-war-plugin插件进行配置

```xml
<plugin>  
    <groupId>org.apache.maven.plugins</groupId>  
    <artifactId>maven-war-plugin</artifactId>  
    <version>2.1-beta-1</version>  
    <configuration>  
        <webResources>  
            <resource>  
                <directory>src/main/webapp</directory>  
                <filtering>true</filtering>  
                <includes>  
                    <include>**/*.css</include>  
                    <include>**/*.js</include>  
                </includes>  
            </resource>  
        </webResources>  
    </configuration>  
</plugin>
```

## MAVEN PROFILE
* 每个Profile可以看作是POM的一部分配置，我们可以根据不同的环境应用不同的Profile，从而达到不同环境使用不同的POM配置的目的。
* clean package -P test -Dmaven.test.skip=true
* package命令完成了项目编译、单元测试、打包功能，但没有把打好的可执行jar包（war包或其它形式的包）布署到本地maven仓库和远程maven私服仓库
* install命令完成了项目编译、单元测试、打包功能，同时把打好的可执行jar包（war包或其它形式的包）布署到本地maven仓库，但没有布署到远程maven私服仓库
* deploy命令完成了项目编译、单元测试、打包功能，同时把打好的可执行jar包（war包或其它形式的包）布署到本地maven仓库和远程maven私服仓库　

```xml
<properties>
    <jdbc.url>jdbc:mysql://localhost:3306/abc</jdbc.url>
    <jdbc.username>root</jdbc.username>
    <jdbc.password>root</jdbc.password>
</properties>
<profiles>
	<profile>
		<id>product</id>
		<properties>
			<jdbc.url>jdbc:mysql://localhost:3306/abc123</jdbc.url>
			<jdbc.username>rootuser</jdbc.username>
			<jdbc.password>rootpwd</jdbc.password>
		</properties>
	</profile>
</profiles>
```
* 操作系统环境激活

```xml
<profiles>  
	<profile>  
		<activation>  
			<os>  
				<name>Windows XP</name>  
				<family>Windows</family>  
				<arch>x86</arch>  
				<version>5.1.2600</version>  
			</os>  
		</activation>  
	</profile>  
</profiles>
```
* 系统属性激活

```xml
<profiles>  
	<profile>  
		<activation>  
			<property>  
				<name>actProp</name>  
				<value>x</value>  
			</property>  
		</activation>  
	</profile>  
</profiles>
```
这里的family值包括Window、UNIX和Mac等，而其他几项对应系统属性的os.name、os.arch、os.version

## Maven打包

```xml
<build>
	<resources>
		<resource>
			<directory>src/main/resources</directory>
			<filtering>true</filtering>
		</resource>
	</resources>
	<plugins>
		<!-- 打包jar文件时，配置manifest文件，加入lib包的jar依赖 -->
		<plugin>
			<groupId>org.apache.maven.plugins</groupId>
			<artifactId>maven-jar-plugin</artifactId>
			<configuration>
				<classesDirectory>target/classes/</classesDirectory>
				<archive>
					<manifest>
						<mainClass>com.rbsn.tms.sdk.device.service.Service</mainClass>
						<!-- 打包时 MANIFEST.MF文件不记录的时间戳版本 -->
						<useUniqueVersions>false</useUniqueVersions>
						<addClasspath>true</addClasspath>
						<classpathPrefix>lib/</classpathPrefix>
					</manifest>
					<manifestEntries>
						<Class-Path>.</Class-Path>
					</manifestEntries>
				</archive>
			</configuration>
		</plugin>
		<plugin>
			<groupId>org.apache.maven.plugins</groupId>
			<artifactId>maven-dependency-plugin</artifactId>
			<executions>
				<execution>
					<id>copy-dependencies</id>
					<phase>package</phase>
					<goals>
						<goal>copy-dependencies</goal>
					</goals>
					<configuration>
						<type>jar</type>
						<includeTypes>jar</includeTypes>
						<outputDirectory>
							${project.build.directory}/lib
						</outputDirectory>
					</configuration>
				</execution>
			</executions>
		</plugin>
	</plugins>
</build>
```
