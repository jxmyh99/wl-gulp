'use strict';

// 引入gulp和gulp的一些插件
import gulp from 'gulp'; //gulp
import gulpLoadPlugins from 'gulp-load-plugins'; //统一管理gulp的插件
import browserSync from 'browser-sync'; //浏览器同步测试工具
import pngquant from "imagemin-pngquant"; //深度压缩图片
import revDev from "rev-del";
import bf from "vinyl-buffer"; //流缓存
import merge from "merge-stream"; //合并流
import bowerFiles from "main-bower-files";
import {
    stream as wiredep
} from 'wiredep';
// 定义常量
const $ = gulpLoadPlugins(); //使用$来代替gulp-load-plugins，使用$.xxxx()这样来导入gulp的插件
const reload = browserSync.reload; //浏览器同步刷新

/*
* activity : 活动页面(自有的)
* module   : 自有的页面
* partner  : 合作伙伴的页面
* project_name : 项目名字
 */
let wl = true,//是否是网兰老的目录
    htmlmin = false,//html压缩
    arr = ['activity','module','partner'],
    project_name = 'abc',
    dist_file = wl ? arr[0] +'/'+project_name+'/' : ' ';


/*
 *  路径变量
 *
 */
let date = new Date(), //获取日期
    year = date.getFullYear(), //获取年份
    month = date.getMonth() + 1, //获取月份
    day = date.getDate(), //获取日
    zip_day = project_name, //组成唯一的目录即日加上小时
    o_path = '../project_zip', //项目存档的初始地址
    save_project = o_path + '\/' + year + '\/' + month + '月份/', //项目存档的目录 目录地址为 初始地址+年份+月份
    zip_project = project_name, //压缩生成的文件名
    build = 'webstart/build/', //开发目录
    dist = 'webstart/dist/' + year + '\/' + month + '月份/' + zip_day + '/', //输出目录
    backup = '../project_backup/' + year + '\/' + month + '月份/' + zip_day + '/', //输出目录
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
    gulp.src([path.s_js + '**/*.js'])
        .pipe($.plumber())
        .pipe($.sourcemaps.init())
        .pipe($.babel({
            presets: ['es2015']
        }))
        .pipe($.sourcemaps.write())
        .pipe($.rename({
            suffix: ".min" //后缀
        }))
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
            vrowser: ['last 2 version', '> 5%', 'safari 5', 'ios 6', 'android 4']
        }))
        .pipe($.sourcemaps.write())
        .pipe($.rename({
            suffix: ".min" //后缀
        }))
        .pipe($.cssnano())
        .pipe(gulp.dest('./css'))
        .pipe(reload({
            stream: true
        }));
});
// 合并css
gulp.task('css',['sass'],()=>{
    // 生成在主目录css
    gulp.src('./css/*')
        .pipe($.concat('main.css'))
        .pipe($.rename({suffix:'.min'}))
        .pipe($.cssnano())
        .pipe(gulp.dest(path.server_css))
        .pipe($.rev())
        .pipe($.rev.manifest())
        .pipe(gulp.dest('./rev/css'));
    // 清除主目录css的所有文件
    gulp.src(['./css'], {
                read: false
            })
            .pipe($.plumber())
            .pipe($.rimraf({
                force: true
            }));

})
// 合并JS
gulp.task('js',['script'],()=>{
    if(!wl){
         // 生成在主目录css
        gulp.src('./js/*')
            .pipe($.concat('main.js'))
            .pipe($.rename({suffix:'.min'}))
            .pipe($.cssnano())
            .pipe(gulp.dest(path.server_css))
            .pipe($.rev())
            .pipe($.rev.manifest())
            .pipe(gulp.dest('./rev/js'));
        // 清除主目录css的所有文件
        gulp.src(['./js'], {
                    read: false
                })
                .pipe($.plumber())
                .pipe($.rimraf({
                    force: true
                }));
            }
})
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
// 压缩图片
gulp.task('imagemin', () => {
    return gulp.src([path.s_img + '**/*.{jpg,jpeg,gif,svg,png}',"!"+path.s_simg+"*"])
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

//jade
gulp.task('jade',() => {
    return gulp.src([build + "**/*.jade", './rev/**/*'])
        .pipe($.plumber())
        .pipe($.revCollector())
        .pipe($.sourcemaps.init())
        .pipe($.jade({
            pretty: true
        }))
        .pipe($.sourcemaps.write())
        .pipe($.inject(gulp.src(require('main-bower-files')('**/*'),{read:false}),{relative:true}))
        .pipe(gulp.dest(server_root))
        .pipe(reload({
            stream: true
        }));
});


gulp.task('clean',['clean:server','clean:build','clean:rev']);
//删除文件
gulp.task('clean:server', () => {
    return gulp.src([server_root], {
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
//删除rev目录文件
gulp.task('clean:rev', () => {
    return gulp.src('./rev/*', {
            read: false
        })
        .pipe($.plumber())
        .pipe($.rimraf({
            force: true
        }));
});
//删除dist目录文件
gulp.task('clean:dist', () => {
    return gulp.src(dist+'/*', {
            read: false
        })
        .pipe($.plumber())
        .pipe($.rimraf({
            force: true
        }));
});
// 拷贝模板文件到工作目录
gulp.task('copy',['clean'],()=>{
    return gulp.src('./templter/module/**/*').pipe(gulp.dest(build));
})


// 生产阶段拷贝文件
gulp.task('pack:copy',()=>{
    let img = wl ? dist + 'Images/'+dist_file : dist+'img',
        js = wl ? dist + 'Scripts/'+dist_file : dist+'js';

    // 修改img文件里的img引用
    gulp.src([path.server_img + "**/*"]).pipe(gulp.dest(img));
    // 拷贝js文件到指定目录
    gulp.src(path.server_js+'*.js').pipe(gulp.dest(js));
    // 拷贝公用文件到指定目录
    if(wl){
        gulp.src('./webstart/resource/**/*').pipe(gulp.dest(dist));
    }

})

// css文件内的图片资源替换名
gulp.task('pack:css',()=>{
    let img = wl ? '../../../Images/'+dist_file : '../img',
        css = wl ? dist + 'Content/'+dist_file : dist+'css';
    return gulp.src(path.server_css+'*.css').pipe($.replace('img/',img)).pipe(gulp.dest(css));
})

// 拷贝main-bower-fles
gulp.task('pack:bower',() => {
    let css = wl ? dist + 'Content/public/' : dist + 'css/public',
        js = wl ? dist + 'Scripts/public/' : dist + 'js/public',
        cssFiles = gulp.src(bowerFiles('**/*.css', function(err) {})).pipe(gulp.dest(css)),
        jsFiles = gulp.src(bowerFiles('**/*.js', function(err) {})).pipe($.uglify()).pipe(gulp.dest(js));
    return gulp.src(server_root+'*.html')
    .pipe($.inject(gulp.src(bowerFiles(),{read:false},{relative:true,empty:true})))
    .pipe($.inject(merge(cssFiles,jsFiles)))
    .pipe(gulp.dest(dist));
})

gulp.task('wiredep', () => {
  gulp.src(server_root+'*.html')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)*\.\./
    }))
    .pipe(gulp.dest(server_root));
});

// 生产阶段替换资源文件名
gulp.task('pack:ren',['pack:bower','pack:copy','pack:css'],()=>{
    let dir_name = '\"/' + dist,
        css = wl ? '\"Content/'+dist_file : '\"css/';
  return gulp.src(dist+ "**/*.html")
    .pipe($.replace('\"css/',css))
    .pipe($.replace('\"img/',wl ? '\"Images/'+dist_file : '\"img/'))
    .pipe($.replace('\"js/',wl ? '\"Scripts/'+dist_file : '\"js/'))
    .pipe($.replace('\"./webstart/resource/','\"'))
    .pipe($.replace(dir_name,'\"'))
    .pipe($.if('*.html', $.htmlmin({ //如有需要，请开启
            collapseWhitespace: htmlmin
        })))
    .pipe(gulp.dest(dist));
})

// 打包文件
gulp.task('zip', () => {
    return gulp.src(dist + '/**/*')
        .pipe($.plumber())
        .pipe($.zip(zip_project + '.zip'))
        .pipe(gulp.dest(save_project));
});

//备份到备份目录
gulp.task('backup', () => {
    return gulp.src(build + '**/*')
        .pipe($.plumber())
        .pipe(gulp.dest(backup));
});

// 其它文件一次输出到生产目录
gulp.task('extras', () => {
    return gulp.src([
        server_root+'*.*',
        '!tmp/*.html'
    ], {
        dot: true
    }).pipe(gulp.dest(dist));
});


// 本地起服务
/*
更多信息请查看 https://www.npmjs.com/package/gulp-usemin
如果bower不能及时生成 。把jade 改为 pack:bower
 */
gulp.task('serve', ['js','css','jade'], () => {
    browserSync.init({
        notify: true,
        open: false,
        port: 3000,
        // 自己在局域网中的ip地址
        host: '10.0.0.189',
        logLevel: "debug",
        //记录连接
        logConnections: true,
        server: {
            baseDir: ['./.tmp'],
            routes: {
                '/bower_components': 'bower_components',
                '/webstart/resource':'webstart/resource/'
            }
        }
    });

    gulp.watch([
        server_root + '**/*.html',
        path.s_img + "**/*.{jpg,jpeg,gif,svg,png}",
        'app/fonts/**/*'
    ]).on('change', reload);

    gulp.watch(path.s_sass + "**/*.scss", ['css']);
    gulp.watch(build + "**/*.jade", ['jade']);
    gulp.watch(path.s_js + "**/*.js", ['script']);
    gulp.watch([path.s_img + "**/*.{jpg,jpeg,gif,svg,png}",'!'+path.s_simg +'*'], ['imagemin']);
    gulp.watch(server_root+'fonts/**/*', ['fonts']);
    gulp.watch('bower.json', ['wiredep']);
});


// 初始化步骤
gulp.task('default',['copy','serve']);

// 针对没有带依赖的打包
gulp.task('build',['pack:ren']);

// 最后的打包
gulp.task('build:end',['backup','zip']);

// 帮助说明
gulp.task('help', () => {
    console.log("css         :sass编译");
    console.log("jade        :jade编译");
    console.log("js          :es6转es5(带eslint验证)");
    console.log("clean       :删除调试目录文件和输出目录文件");
    console.log("clean:build :删除开发目录文件");
    console.log("sprite      :精灵图生成");
    console.log("sprite:ret  :精灵图和2倍精灵图生成");
    console.log("zip         :从输出目录zip压缩输出");
    console.log("serve       :本地服务带监控");
    console.log("help        :输出帮助信息");
    console.log("backup      :备份工作目录");
});