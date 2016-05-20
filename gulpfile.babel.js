'use strict';

// 引入gulp和gulp的一些插件
import gulp from 'gulp'; //gulp
import gulpLoadPlugins from 'gulp-load-plugins'; //统一管理gulp的插件
import browserSync from 'browser-sync'; //浏览器同步测试工具
import pngquant from "imagemin-pngquant"; //深度压缩图片
import revDev from "rev-del";
import bf from "vinyl-buffer"; //流缓存
import merge from "merge-stream"; //合并流
import {
    stream as wiredep
} from 'wiredep';
module.exports = gulp;
// 定义常量
const $ = gulpLoadPlugins(); //使用$来代替gulp-load-plugins，使用$.xxxx()这样来导入gulp的插件
const reload = browserSync.reload; //浏览器同步刷新

/*
 *  路径变量
 *
 */
let date = new Date(), //获取日期
    year = date.getFullYear(), //获取年份
    month = date.getMonth() + 1, //获取月份
    day = date.getDate(), //获取日
    zip_day = date.getDate() + '-' + date.getHours(), //组成唯一的目录即日加上小时
    o_path = 'D://yeoman', //项目存档的初始地址
    save_project = o_path + '\/' + year + '\/' + month + '月份/', //项目存档的目录 目录地址为 初始地址+年份+月份
    zip_project = year + '-' + month + '-' + day, //压缩生成的文件名
    build = 'webstart/build/', //开发目录
    dist = 'webstart/dist/' + year + '\/' + month + '月份/' + zip_day + '/', //输出目录
    backup = 'webstart/backup/' + year + '\/' + month + '月份/' + zip_day + '/', //输出目录
    server_root = ".tmp/", //静态服务器根目录
    path = {
        s_sass: build + "scss/", //待编译的源文件路径
        s_js: build + "js/", //待转换的ES6文件
        s_img: build + "img/", //待压缩的图片
        s_simg: build + "img/sprite/", //待合并成雪碧图的文件
        d_css: dist + "css/", //输出的文件
        d_img: dist + 'img/',
        d_js: dist + 'js/',
        server_css: server_root + 'css/', //本地服务的文件
        server_js: server_root + 'js/',
        server_img: server_root + 'img/',
    };

// sprite生成
/*
 *  使用scss模板不能生成2倍的图片的scss，后面要处理
 *
 */
gulp.task('sprite', () => {
    return gulp.src(path.s_simg + "*.png").pipe($.plumber()).pipe($.spritesmith({
            imgName: 'sprite.png',
            cssName: 'sprite.scss',
            // cssTemplate: path.s_simg + 'scss.template.handlebars',
            cssSpritesheetName: 'icons',
            cssVarMap: function(sprite) {
                sprite.name = sprite.name.replace('sprite', 'icon');
            },
            cssRetinaSpritesheetName: 'retina-icons',
            cssRetinaGroupsName: 'icon-groups',
            algorithm: 'binary-tree'
        }))
        .pipe(gulp.dest(path.s_img));

});
// 生成两倍
gulp.task('sprite:ret', () => {
    return gulp.src(path.s_simg + "*.png").pipe($.plumber()).pipe($.spritesmith({
            retinaSrcFilter: path.s_simg + '*@2x.png',
            imgName: 'sprite.png',
            retinaImgName: 'sprite@2x.png',
            cssName: 'sprite.scss',
            // cssTemplate: path.s_simg + 'scss.template.handlebars',
            cssSpritesheetName: 'icons',
            cssVarMap: function(sprite) {
                sprite.name = sprite.name.replace('sprite', 'icon');
            },
            cssRetinaSpritesheetName: 'retina-icons',
            cssRetinaGroupsName: 'icon-groups',
            algorithm: 'binary-tree'
        }))
        .pipe(gulp.dest(path.s_img));

});

// 验证js
function lint(files, options) {
    return () => {
        return gulp.src(files)
            .pipe($.plumber())
            .pipe(reload({
                stream: true,
                once: true
            }))
            .pipe($.eslint(options))
            .pipe($.eslint.format())
            .pipe($.if(!browserSync.active, $.eslint.failAfterError()));
    };
}
const testLintOptions = {
    env: {
        mocha: true
    }
};
const LintOptions = {
    rulePaths: [],
    rules: {
        'strict': 0,
    },
    ecmaFeatures: {
        modules: true
    },
    globals: {
        'jQuery': true,
        '$': true
    },
    // baseConfig: {
    //  parser: 'babel-eslint',
    // },
    envs: [
        'browser', 'es6'
    ]
}
gulp.task('lint', lint(path.s_js + '**/*.js', LintOptions));
gulp.task('lint:test', lint('test/spec/**/*.js', testLintOptions));

//es6 to es5
gulp.task('script', ['lint'], () => {
    return gulp.src([path.s_js + '**/*.js'])
        .pipe($.plumber())
        .pipe($.sourcemaps.init())
        .pipe($.babel({
            presets: ['es2015']
        }))
        .pipe($.sourcemaps.write())
        .pipe($.rev())
        .pipe(gulp.dest(path.server_js))
        .pipe($.rev.manifest())
        .pipe(gulp.dest('./rev/js'))
        .pipe(reload({
            stream: true
        }));
});

// sass
gulp.task('sass', ['fonts', 'imagemin'], () => {
    return gulp.src([path.s_sass + '**/*.scss', './rev/img/*.json', './rev/font/*.json'])
        .pipe($.plumber())
        .pipe($.sourcemaps.init())
        .pipe($.revCollector())
        .pipe($.sass.sync({
            outputStyle: 'expanded',
            precision: 10,
            includePaths: ['.']
        })).on('error', $.sass.logError)
        .pipe($.autoprefixer({
            vrowser: ['> 1%', 'last 2 versions', 'Firefox ESR']
        }))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest(path.server_css))
        .pipe($.rev())
        .pipe($.rev.manifest())
        .pipe(gulp.dest('./rev/css'))
        .pipe(reload({
            stream: true
        }));
});


//字体文件生成
gulp.task('fonts', () => {
    return gulp.src(require('main-bower-files')('**/*.{eot,svg,ttf,woff,woff2}', function(err) {})
            .concat(build + 'fonts/**/*'))
        .pipe(gulp.dest(server_root + 'fonts'))
        .pipe(gulp.dest(dist + 'fonts'))
        .pipe($.rev())
        .pipe($.rev.manifest())
        .pipe(gulp.dest('./rev/font'));
});
//jade
gulp.task('jade', ['script', 'sass'], () => {
    return gulp.src([build + "**/*.jade", './rev/**/*'])
        .pipe($.plumber())
        .pipe($.revCollector())
        .pipe($.sourcemaps.init())
        .pipe($.jade({
            pretty: true
        }))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest(server_root))
        .pipe(reload({
            stream: true
        }));
});
//删除文件
gulp.task('clean', () => {
    return gulp.src([server_root, dist], {
            read: false
        })
        .pipe($.plumber())
        .pipe($.rimraf({
            force: true
        }));
});
//删除工作目录的文件
gulp.task('clean:build', () => {
    return gulp.src(build + '/*', {
            read: false
        })
        .pipe($.plumber())
        .pipe($.rimraf({
            force: true
        }));
});
//删除rev文件
gulp.task('clean:rev', () => {
    return gulp.src('./rev/*', {
            read: false
        })
        .pipe($.plumber())
        .pipe($.rimraf({
            force: true
        }));
});
// 压缩集合
gulp.task('compass', ['imagemin', 'cssmin', 'jsmin']);
// 压缩图片
gulp.task('imagemin', () => {
    return gulp.src(path.s_img + '**/*')
        .pipe($.plumber())
        .pipe($.imagemin({
            progressive: true,
            svgoPlugins: [{
                removeViewBox: false
            }],
            use: [pngquant()]
        }))
        .pipe(gulp.dest(path.server_img))
        .pipe($.rev())
        .pipe($.rev.manifest())
        .pipe(gulp.dest('./rev/img'));

});
// 压缩css
gulp.task('cssmin', () => {
    return gulp.src(path.server_css + '*.css')
        .pipe($.plumber())
        .pipe($.sourcemaps.init())
        .pipe($.concat(zip_project+'.css'))
        .pipe($.rename({
            // dirname: "main/",   //目录名
            // basename: "aloha",           //基本命名
            // prefix: "bonjour-",          //前缀
            suffix: ".min" //后缀
                // extname: ".md"               //拓展名
        }))
        .pipe($.cssnano())
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest(path.d_css))
        .pipe($.rev())
        .pipe($.rev.manifest())
        .pipe(gulp.dest('./rev/css'));
});


// 压缩js
gulp.task('jsmin', () => {
    return gulp.src(path.server_js + '*.js')
        .pipe($.plumber())
        .pipe($.sourcemaps.init())
        .pipe($.uglify({
            mangle: true, //类型：Boolean 默认：true 是否修改变量名
            compress: true //类型：Boolean 默认：true 是否完全压缩
        }))
        .pipe($.concat(zip_project + '.js', {
            newLine: ';'
        }))
        .pipe($.rename({
            // dirname: "main/text/ciao",   //目录名
            // basename: "aloha",           //基本命名
            // prefix: "bonjour-",          //前缀
            suffix: ".min" //后缀
                // extname: ".md"               //拓展名
        }))
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest(path.d_js))
        .pipe($.rev())
        .pipe($.rev.manifest())
        .pipe(gulp.dest('./rev/js'));
});

// 压缩html
gulp.task('htmlmin', ['jade', 'cssmin', 'jsmin'], () => {
    return gulp.src(server_root + "**/*.html")
        .pipe($.htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest(dist));
})

// 打包文件
gulp.task('zip', ['pack:dist'], () => {
    return gulp.src(dist + '/**/*')
        .pipe($.plumber())
        .pipe($.zip(zip_project + '.zip'))
        .pipe(gulp.dest(save_project));
});

// 打包到生产目录
gulp.task('pack:dist', ['htmlmin','extras'], () => {
    return gulp.src(save_project + "**/*")
        .pipe($.plumber())
        .pipe(gulp.dest(dist));
});

//备份到备份目录
gulp.task('backup', () => {
    return gulp.src(build + '**/*')
        .pipe($.plumber())
        .pipe(gulp.dest(backup));
})

// 其它文件一次输出到生产目录
gulp.task('extras', () => {
    return gulp.src([
        '.tmp/*.*',
        '!tmp/*.html'
    ], {
        dot: true
    }).pipe(gulp.dest(dist));
});

// 本地起服务

gulp.task('watch', ['jade'], () => {
    browserSync({
        notify: false,
        port: 9000,
        server: {
            baseDir: ['.tmp'],
            routes: {
                '/bower_components': 'bower_components'
            }
        }
    });

    gulp.watch([
        path.s_sass + "**/*.scss",
        path.s_js + "**/*.js",
        path.s_img + "**/*",
        build + "**/*.jade",
        server_root + '**/*.html',
        server_root + 'fonts/**/*'
    ]).on('change', reload);

    gulp.watch(path.s_sass + "**/*.scss", ['sass']);
    gulp.watch(build + "**/*.jade", ['jade']);
    gulp.watch(path.s_js + "**/*.js", ['script']);
    gulp.watch(path.s_img + "*", ['imagemin']);
    gulp.watch('.tmp/fonts/**/*', ['fonts']);
});


// 默认

gulp.task('build', ['zip']);

// 帮助说明
gulp.task('default', () => {
    console.log("sass       :sass编译");
    console.log("jade       :jade编译");
    console.log("script     :es6转es5(带eslint验证)");
    console.log("clean      :删除调试目录文件和输出目录文件");
    console.log("clean:build :删除开发目录文件");
    console.log("sprite         :精灵图生成");
    console.log("sprite:ret     :精灵图和2倍精灵图生成");
    console.log("compress   :压缩集合");
    console.log("imagemin   :图片压缩");
    console.log("cssmin         :css压缩");
    console.log("jsmin      :js压缩");
    console.log("replace        :html页面内的css,js资源替换名字");
    console.log("zip        :从输出目录zip压缩输出");
    console.log("pack:dist   :打包到输出目录");
    console.log("lint       :eslint验证");
    console.log("font       :字体打包");
    console.log("serve      :本地服务带监控");
    console.log("serve:dist     :输出目录启动本地服务");
    console.log("wiredep        :bower组件资源替换并且下载到templter/js/public/目录下");
    console.log("help       :输出帮助信息");
    console.log("backup       :备份工作目录");
});


/*
1.精灵图合并（区分是不是要生成2倍精灵图）
2.启用本地服务

3.输出
    - 把本地服务目录拷贝到输出目录
        -   js不压缩
        -   html不压缩
        -   css压缩  合并后的文件名为'年-月-日'格式，待优化
        -   图片压缩
    - 把工作目录备份拷贝到webstart/backup/zip/save_project/zip_project目录下
4.测试输出目录
5.压缩输出
 */
