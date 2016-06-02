# 支持功能
1. jade模板引擎
2. es6的支持，会自动转换为es5
3. sass的支持
4. css,js,image增加缓存机制，即增加md5码

# 环境配置
1. 去[nodejs.org](https://nodejs.org/en/)下载node
2. 去[git-scm.com](https://git-scm.com/download/)下载git
3. 打开<code>git bash</code>命令窗口或者cmd窗口
4. 运行<code>git clone https://github.com/jxmyh99/wl-gulp</code>即可
5. 这里推荐您使用<code>cnpm</code>来下载各个组件。天朝，你懂的。
6. 运行<code>gulp install</code>下载<code>node组件</code>
7. 请把<code>node组件备份</code>目录里的三个组件拷贝到<code>node_modules</code>并且替换掉他们

# 工作步骤
提示：请确保没有程序占用到build目录下的文件
1. <code>gulp</code>初始化工作目录并且启动本地服务
    - 清除<code>.tmp</code>、<code>rev</code>和<code>webstart</code>目录下的文件，并且把<code>templter/module</code>里的文件复制到<code>webstart/build</code>目录下
    - 开启服务，监控jade,js,scss以及图片的变化
2. <code>gulp build</code>把<code>.tmp</code>目录的文件拷贝到<code>webstart/dist</code>目录下
    - <code>pack:bower</code> 拷贝bower依赖到指定目录
    - <code>pack:copy</code> 复制文件一指定目录下
    - <code>pack:css</code> 替换css里的图片引用路径的替换
    - <code>pack:ren</code> 替换html里引用的资源文件路径替换
    - <code>gulp zip</code> 把<code>webstart/dist</code>目录的文件打包压缩到<code>./project_zip</code>目录下
    - <code>gulp backup</code> 把<code>wetstart/build</code>目录下的文件打包备份至<code>./project_backup</code>目录下

# 常用组件

    "babel-core": "^6.8.0",
    "babel-preset-es2015": "^6.6.0",
    "babel-register": "^6.8.0",
    "browser-sync": "^2.12.5",
    "event-stream": "^3.3.2",
    "foldero": "^0.1.1",
    "gulp": "^3.9.1",
    "gulp-autoprefixer": "^3.1.0",
    "gulp-babel": "^6.1.2",
    "gulp-cache": "^0.4.4",
    "gulp-concat": "^2.6.0",
    "gulp-copy": "^0.0.2",
    "gulp-cssnano": "^2.1.2",
    "gulp-data": "^1.2.1",
    "gulp-eslint": "^0.13.2",
    "gulp-htmlmin": "^2.0.0",
    "gulp-if": "^2.0.1",
    "gulp-imagemin": "^3.0.1",
    "gulp-inject": "^4.1.0",
    "gulp-jade": "^1.1.0",
    "gulp-load-plugins": "^1.2.2",
    "gulp-plumber": "^1.1.0",
    "gulp-rename": "^1.2.2",
    "gulp-replace": "^0.5.4",
    "gulp-rev": "^7.0.0",
    "gulp-rev-collector": "^1.0.3",
    "gulp-rimraf": "^0.2.0",
    "gulp-sass": "^2.3.1",
    "gulp-size": "^2.1.0",
    "gulp-sourcemaps": "^2.0.0-alpha",
    "gulp-uglify": "^1.5.3",
    "gulp-usemin": "^0.3.23",
    "gulp-useref": "^3.1.0",
    "gulp-zip": "^3.2.0",
    "gulp.spritesmith": "^6.2.1",
    "imagemin-pngquant": "^5.0.0",
    "jade": "^1.11.0",
    "lodash.pickby": "^4.4.0",
    "main-bower-files": "^2.13.0",
    "merge-stream": "^1.0.0",
    "rev-del": "^1.0.5",
    "vinyl-buffer": "^1.0.0",
    "wiredep": "^4.0.0"

#目录结构及文件
<pre>
├─.tmp               ---> 本地服务器
├─./project_backup     ---> 项目源代码存放目录
├─./project_zip        ---> 项目zip压缩存放目录
├─bower_components   ---> bower依赖存放目录
├─templter           ---> 模板文件
|   ├─jade
|   ├─js
|   |  └─public      -- 自定义的公用库
|   ├─module         -- 初始的项目文件及目录
|   |  ├─img         -- 图片存放目录
|   |  |  └─sprite   -- 待压缩的精灵存放地址(请使用.png格式存放)
|   |  ├─js          -- js存放目录
|   |  └─scss        -- sass存放目录
|   └─scss
|      └─public      -- 公用的scss的库
├─rev                ---> md5码(即css,image,js版本控制)
└─webstart
    ├─_data          ---> json文件存放目录
    ├─build          ---> 开发目录
    │  ├─img
    │  │  └─sprite   -- 待合并成雪碧图的图片文件
    │  ├─js          -- js目录
    │  └─scss        -- 待编译的SCSS文件
    ├─resource       ---> 自定义依赖引用
    └─dist           ---> 生产阶段文件存放目录

</pre>