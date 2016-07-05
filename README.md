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

# 工作步骤

1. <code>gulp reset --pname <string> --wl <boolean> --pmodule <number(0-2)><code>初始化项目
    <code>--pname</code> 项目名称<必填>
    <code>--wl</code>    是否是网兰项目<选填>
    <code>--pmodule</code>   存放的模块<如果--wl存在的话，此项必填>
    <code>--pc</code>    建立一个pc端的项目
    <code>--flex</code>  建立一个使用[flexible](https://github.com/amfe/lib-flexible)的手机端项目
    --mb:建立一个手机端项目(此项为默认项)
    例如：
    <code>gulp reset --pname demo</code>建立一个demo项目
    <code>gulp reset --pnane demo --wl --pmodule 1</code>建立一个为网兰的项目
    <code>gulp reset --pname demo --</code>
2. <code>gulp serve</code>开启本地服务及监控文件
    <code>--open</code> 打开浏览器
    <code>--production</code>   代码生成build(生产阶段)目录
3. <code>gulp pack</code>打包本地代码
4. <code>gulp build</code>生成文件到build目录
5. <code>gulp test</code>测试js代码
    <code>--watch</code>监控测试代码
***添加了 `--debug` 来查看额外的调试信息（例如数据回到您的模块中）***

# 目录结构及文件
<pre>
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
    ├─flexible              -- 使用flexible的手机端模板文件
    ├─mobile                -- 原生的手机端模板文件
    └─pc                    -- pc端模板文件