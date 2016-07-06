# gulp支持功能

+ jade模板引擎支持
+ ES6编译
+ sass、less和stylus编译支持
+ eslint测试支持
+ bower包管理支持
+ jade引入json文件支持
+ shims测试支持

# 环境配置

+ 去[nodejs.org](https://nodejs.org/en/)下载node
+ 去[git-scm.com](https://git-scm.com/download/)下载git
+ 打开<code>git bash</code>命令窗口或者cmd窗口
+ 运行<code>git clone https://github.com/jxmyh99/wl-gulp</code>即可
+ 这里推荐您使用<code>cnpm</code>来下载各个组件。天朝，你懂的。
+ 运行<code>cnpm install</code>下载<code>node组件</code>

# gulp工作流程

###gulp reset 初始化项目

| task | 介绍 | 是否必填 | 参数类型 |
|---------|-------
| --pname    | 项目名称 | true | string
| --wl    | 项目名称 | false | boolean
| --pmodule    | 资源存放处<0-2>取值范围 | false,如果--wl为true时，此项为true | number
| --pc    | 拷贝pc项目 | false | boolean
| --flex    | 拷贝含有[flexible](https://github.com/amfe/lib-flexible)的移动端项目 | false | boolean
| --mb    | 拷贝移动端项目(此项为默认值) | false | boolean

> 例如：
> <code>gulp reset --pname demo</code>建立一个demo项目
> <code>gulp reset --pnane demo --wl --pmodule 1</code>建立一个为网兰的项目
> <code>gulp reset --pname demo --pc</code>建立一个pc端的demo项目
> <code>gulp reset --pnane demo --wl --pmodule 1 --flex</code>建立一个含有[flexible](https://github.com/amfe/lib-flexible)移动端名为demo的网兰项目

###gulp sprite 生成精灵图

| task | 介绍 | 是否必填 | 参数类型 |
|---------|-------|---------|---------
| --x2    | 生成2倍精灵图 | false | boolean

> 例如：
> <code>gulp sprite</code>生成精灵图
> <code>gulp sprite --x2</code>生成2倍精灵图，请保存在_sprite目录下含有*@2.png的图片

###gulp serve 开启本地服务及监控文件

| task | 介绍 | 是否必填 | 参数类型 |
|---------|-------|---------|---------
| --open    | 打开浏览器 | false | boolean
| --production    | 代码生成build(生产阶段)目录 | false | boolean

> 例如：
> <code>gulp serve --open</code>开启本地服务并且打开浏览器
> <code>gulp serve --production</code>代码生成至build目录并且以此目录为服务目录，无监控文件

###gulp pack 打包代码

含有的task
| task | 介绍 |
|---------|-------
| backup    | 备份源代码至project_backup目录下
| zip    | 打包和压缩即(zip)代码至project_zip目录下

***代码会打包至'XXXX(年)/XX月份/'目录下***

<!-- ###gulp build 打包代码至build目录 -->

###gulp test 测试单元代码

| task | 介绍 | 是否必填 | 参数类型 |
|---------|-------|---------|---------
| --watch    | 监控测试代码 | false | boolean

> 例如：
> <code>gulp test --watch</code> 测试单元代码并且监控代码

***添加了 `--debug` 来查看额外的调试信息（例如数据回到您的模块中）***

# 目录结构及文件

```
├─../project_backup         ---> 项目源代码存放目录
├─../project_zip            ---> 项目zip压缩存放目录
├─bower_components          ---> bower依赖存放目录
├─gulp                      ---> gulp各个task文件夹
├─build                     ---> 生产阶段代码文件夹
├─tmp                       ---> 暂存代码文件夹
├─src                       ---> 模板文件
|   ├─_data                 ---> jade数据存放处及项目信息存放处
|   |  └─project.json       -- 项目资料存放及js,css头部内容
|   ├─_images               -- 图片资源存放
|   ├─_layouts              -- 初始的项目文件及目录
|   ├─_modules              -- 模块存放处
|   ├─_scripts              -- js文件夹
|   ├─_sprite               -- 待合并sprite(精灵图)文件夹
|   └─_styles               -- css文件夹
└─templter                  ---> 模板文件存放处
    ├─create                -- json文件存放目录
    |  ├─module             -- 模块创建的模板
    │  │  ├─tests           -- 单元测试目录
    │  │  ├─modules.jade    -- jade模板文件
    │  │  ├─modules.js      -- js模板文件
    │  │  └─modules.scss    -- sass模板文件(默认为sass编译，需要其它查看[工作步骤](#工作步骤))
    │  └─page               -- 单页模板存放处
    ├─flexible              -- 使用flexible的移动端模板文件
    ├─mobile                -- 原生的移动端模板文件
    └─pc                    -- pc端模板文件
```
