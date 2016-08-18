/*
 * @entry: wl-gulp
 * @mdoule: gulpfile
 * @Author: zero
 * @Date:   2016-06-09 10:54:27
 * @Last Modified by:   zero
 * @Last Modified time: 2016-08-16 23:57:01
 */


'use strict'

import path from 'path'; //引入路径模块
import gulp from 'gulp'; //引入gulp
import gulpLoadPlugins from 'gulp-load-plugins'; //引入gulp模块管理模块
import browserSyncLib from 'browser-sync'; //引入sync
import pjson from './package.json'; //引入package.json
import project from './src/_data/project.json'; //引入项目的自定义设置
import minimist from 'minimist'; //解析参数选项
import wrench from 'wrench';
import Msg from 'node-msg'; //引入node的信息提示插件，不能打印出对象
import runSequence from 'gulp-run-sequence'; //控制gulp的task顺序

// 加载各个gulp task
const plugins = gulpLoadPlugins();


//创建karma服务
const KarmaServer = require('karma').Server;


let config = pjson.config,
    args = minimist(process.argv.slice(2)),
    dirs = config.directories,
    taskTarget = args.production ? dirs.destination : dirs.temporary;


// browserSync 的创建
let browserSync = browserSyncLib.create();
// 提取文件的后缀
let tools = {
    // 根据路径获取文件类型
    getType: (function(path) {
        var _type_temp = path.split('.');
        return _type_temp[_type_temp.length - 1];
    }),
    //根据路径获取文件名

    getName: function(path) {

        var _name_temp = path.split('\\');

        return _name_temp[_name_temp.length - 1];

    },
    getPack: function(path) {
        let date = new Date(),
            year = date.getFullYear(),
            month = date.getMonth() + 1;
        return path + '\/' + year + '\/' + month + '月份/';
    },
    checkDateFormat: function(_date) {
        if (_date < 10) {
            _date = '0' + _date;
        }
        return _date;
    },
    getDate: function() {
        let myDate = new Date(),
            year = myDate.getFullYear(),
            month = this.checkDateFormat(myDate.getMonth() + 1),
            day = this.checkDateFormat(myDate.getDay()),
            data = year + '年' + month + '月' + day + '日';
        return data;
    }
}


// gulp : gulp全局变量
// plugins:gulp 模块管理
// args:输入的命令行的查看
// config:package.json里的自定义配置
// taskTarget:是不是要生成生产环境还是编辑环境
// browserSync:刷新浏览器
// tools:是提取文件的一些方法
wrench.readdirSyncRecursive('./gulp').filter((file) => {
    return (/\.(js)$/i).test(file);
}).map(function(file) {
    require('./gulp/' + file)(gulp, tools, plugins, args, config, project, taskTarget, browserSync);
});

// 重置(清除build和tmp目录，复制文件到src目录)
// Clear BUILD and TMP directories, copy files to the SRC directory
gulp.task('reset', (cb) => {
    /*
        args.pname 在后面没带参数的时候，默认为true args.pname != true

     */
    if (args._[0] == 'reset' && /^[a-zA-Z]+\S/gi.test(args.pname) && !!args.pname && args.pname != true) {
        if (args.wl && !(/[0-2]{1}/gi.test(args.pmodule))) {
            Msg.log('请确认' + Msg.green('--pmodule') + '是否输入正确:例如：' + Msg.green('--pmodule只能为[0-2]数字') + '。详细请输入' + Msg.green('gulp help')) + '查看';
            return;
        };
        runSequence('clean', 'copy', 'save', cb);
    } else {
        Msg.log('请确认' + Msg.green('gulp reset --pname xxx --pmodule xxx') + '是否输入:例如：' + Msg.green('gulp reset --pname "you project name" --pmodule "you module name" --wl') + '。详细请输入' + Msg.green('gulp help')) + '查看';
    };
});

// 生产阶段代码
gulp.task('build', (cb) => {
    args.production ? runSequence('sprite', 'imagemin', 'html', 'bower', 'css', 'browserify', cb) : runSequence('sprite', 'imagemin', 'html', 'css', 'browserify', cb);
});


//服务和监控
gulp.task('serve', args.production ? ['sprite', 'imagemin', 'css', 'html', 'bower', 'browserify', 'browserSync', 'watch'] : ['sprite', 'imagemin', 'css', 'html', 'browserify', 'browserSync', 'watch']);


//测试(暂时没有通过)
// Testing ['eslint'],
gulp.task('test', (done) => {
    new KarmaServer({
        configFile: path.join(__dirname, '/karma.conf.js'),
        singleRun: !args.watch,
        autoWatch: args.watch
    }, done).start();
});

// 打包
// pack
gulp.task('pack', ['backup', 'zip']);

// 帮助
// help
gulp.task('help', () => {
    let html = "├─gulp reset               :    重置项目\n";
    html += "│ ├─包含方法\n";
    html += "│ ├─ --pname <name>        :    项目名称(必需)\n";
    html += "│ └─ --wl                  :    是否是网兰项目(可选)\n";
    html += "│      └─ --pmodule <name> :    如果--wl输入后此项必需,参数为0-2之间的数\n";
    html += "├─gulp build               :    生产阶段代码\n";
    html += "├─gulp serve               :    生产阶段代码\n";
    html += "│ ├─包含方法\n";
    html += "│ ├─ --open                :    打开浏览器窗口\n";
    html += "│ └─ --production          :    以build为服务器目录\n";
    html += "├─gulp create              :    创建模块或者单页\n";
    html += "│ ├─包含方法\n";
    html += "│ ├─ --p <name>            :    创建页面，存放在src目录下\n";
    html += "│ ├─ --m <name>            :    创建模块，放在_modules目录下\n";
    html += "│ └─ --<sass>              :    选择所使用的css的编写语言，默认为css\n";
    html += "├─gulp test                :    测试代码\n";
    html += "│ ├─包含方法\n";
    html += "│ └─ --watch               :    监控源文件\n";
    html += "└─gulp pack                :    打包代码\n";
    Msg.log(Msg.green(html));
});

// 保存项目名，如果是网兰的项目还要保存模块名
// save data
// 判断在默认情况下，让json格式里的数据初始化，以防读取json文件时出错
// 此方法不能单独运行
gulp.task('save', () => {
    let _project, banner, banner1;
    if (args._[0] == 'reset') {

        gulp.src(path.join(dirs.source, dirs.data, 'project.json')) //读取project.json文件
            .pipe(plugins.plumber())
            .pipe(plugins.replace(/\$e1+/gi, /^[a-zA-Z]+\S/gi.test(args.pname) ? args.pname : "$e1")) //替换pname
            .pipe(plugins.replace(/\$e2+/gi, /[0-2]{1}/gi.test(args.pmodule) ? config.wl.modules[args.pmodule] : "$e2")) //替换pmodule
            .pipe(plugins.replace(/false/gi, !!args.wl ? 'true' : 'false')) //替换wl
            .pipe(plugins.replace(/\$dc+/gi, tools.getDate())) //替换创建日期
            .pipe(gulp.dest(path.join(dirs.source, dirs.data)))
            .on('end', () => {
                _project = {
                    'pname': args.pname,
                    'author': config.author,
                    'create': tools.getDate(),
                    'link': config.url

                };
                banner = [
                    '@charset "UTF-8";',
                    '/**',
                    ' * @entry <%= pkg.pname %>',
                    ' * @author <%= pkg.author %>',
                    ' * @create <%= pkg.create %>',
                    ' * @link <%= pkg.link %>',
                    ' */',
                    ''
                ].join('\n');
                banner1 = [
                    '"use strict" ;',
                    '/**',
                    ' * @entry <%= pkg.pname %>',
                    ' * @author <%= pkg.author %>',
                    ' * @create <%= pkg.create %>',
                    ' * @link <%= pkg.link %>',
                    ' */',
                    ''
                ].join('\n');
                gulp.src(['./src/_styles/' + pjson.config.entries.css, './src/_scripts/' + pjson.config.entries.js])
                    .pipe(plugins.if('*.{scss,sass,less,css,styl}', plugins.header(banner, { pkg: _project })))
                    .pipe(plugins.if('*.{js,coffee}', plugins.header(banner1, { pkg: _project })))
                    .pipe(plugins.if('*.js', gulp.dest('./src/_scripts/')))
                    .pipe(plugins.if('*.scss', gulp.dest('./src/_styles/')));
                args.wl ? Msg.log("您的项目名为" + Msg.green(args.pname) + "您的模块名为" + Msg.green(config.wl.modules[args.pmodule])) : Msg.log("您的项目名为" + Msg.green(args.pname));
            });


    } else {
        Msg.log('请确认' + Msg.green('gulp reset --pname xxx') + '是否输入:例如：' + Msg.green('gulp reset --pname "you project name" --pmodule "you module name" --wl') + '。详细请输入' + Msg.green('gulp help')) + '查看';
    };
});
