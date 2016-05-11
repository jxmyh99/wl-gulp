'use strict';

// 引入gulp和gulp的一些插件
import gulp from 'gulp'; //gulp
import gulpLoadPlugins from 'gulp-load-plugins'; //统一管理gulp的插件
import browserSync from 'browser-sync'; //浏览器同步测试工具
import pngquant from "imagemin-pngquant"; //深度压缩图片
import bf from "vinyl-buffer"; //流缓存
import merge from "merge-stream"; //合并流
import {
	stream as wiredep
} from 'wiredep';

// 定义常量
const $ = gulpLoadPlugins(); //使用$来代替gulp-load-plugins，使用$.xxxx()这样来导入gulp的插件
const reload = browserSync.reload; //浏览器同步刷新

/*
 *	路径变量
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
	dist = 'webstart/dist/' + zip_project + '/', //输出目录
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

/*开发阶段*/

// 生成类

// sass
gulp.task('sass', () => {
	return gulp.src(path.s_sass + '**/*.scss')
		.pipe($.plumber())
		.pipe($.sourcemaps.init())
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
		.pipe(reload({
			stream: true
		}));
});

//jade
gulp.task('jade', () => {
	return gulp.src(build + "**/*.jade")
		.pipe($.plumber())
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

//es6 to es5
gulp.task('es5_to_es5', () => {
	return gulp.src(path.s_js + '**/*.js')
		.pipe($.plumber())
		.pipe($.sourcemaps.init())
		.pipe($.babel({
			presets: ['es2015']
		}))
		.pipe($.sourcemaps.write())
		.pipe(gulp.dest(path.server_js))
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
/*生产阶段*/

// 合并文件
gulp.task('concat', ['clean', 'concat_js', 'concat_css']);

gulp.task('concat_js', () => {
	return gulp.src(path.server_js + '*.js')
		.pipe($.concat(zip_project + '.js', {
			newLine: ';'
		}))
		.pipe(gulp.dest(path.d_js));
});

gulp.task('concat_css', () => {
	return gulp.src(path.server_css + '*.css')
		.pipe($.concat(zip_project + '.css'))
		.pipe(gulp.dest(path.d_css));
})

// sprite生成
/*
 *	使用scss模板不能生成2倍的图片的scss，后面要处理
 *
 */
gulp.task('sprite', () => {
	return gulp.src(path.s_simg + "*.png").pipe($.spritesmith({
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

// 压缩图片

gulp.task('imagemin', () => {
	return gulp.src(path.s_img + '*')
		.pipe($.plumber())
		.pipe($.imagemin({
			progressive: true,
			svgoPlugins: [{
				removeViewBox: false
			}],
			use: [pngquant()]
		}))
		.pipe(gulp.dest(path.server_img));
});

// 压缩css
gulp.task('cssmin', () => {
	return gulp.src(path.server_css + '*.css')
		.pipe($.plumber())
		.pipe($.sourcemaps.init())
		.pipe($.rename({
			// dirname: "main/text/ciao",   //目录名
			// basename: "aloha",           //基本命名
			// prefix: "bonjour-",          //前缀
			suffix: ".min" //后缀
				// extname: ".md"               //拓展名
		}))
		.pipe($.cssnano())
		.pipe($.sourcemaps.write('.'))
		.pipe(gulp.dest(path.d_css));
});

// 压缩js
gulp.task('jsmin', () => {
	return gulp.src(path.server_js + '*.js')
		.pipe($.plumber())
		.pipe($.sourcemaps.init())
		.pipe($.rename({
			// dirname: "main/text/ciao",   //目录名
			// basename: "aloha",           //基本命名
			// prefix: "bonjour-",          //前缀
			suffix: ".min" //后缀
				// extname: ".md"               //拓展名
		}))
		.pipe($.uglify({
			mangle: true, //类型：Boolean 默认：true 是否修改变量名
			compress: true //类型：Boolean 默认：true 是否完全压缩
		}))
		.pipe($.sourcemaps.write('.'))
		.pipe(gulp.dest(path.d_js));
});

// 打包文件

gulp.task('zip', () => {
	return gulp.src(dist + '/**/*')
		.pipe($.plumber())
		.pipe($.zip(zip_project + '.zip'))
		.pipe(gulp.dest(save_project));
});

/*测试阶段*/

// 验证js
function lint(files, options) {
	return () => {
		return gulp.src(files)
			.pipe(reload({
				stream: true,
				once: true
			}))
			.pipe($.eslint(options))
			.pipe($.eslint.format())
			.pipe($.if(!browserSync.active, $.eslint.failAfterError()));
	};
}

let LintOptions = {
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
	baseConfig: {
		//parser: 'babel-eslint',
	},
	envs: [
		'browser', 'es6'
	]
}
gulp.task('lint', lint(path.server_js + '*.js', LintOptions));

// 生成到测试目录 生产阶段的所有task全部这里集合
// 使用phantomJS来测试
// 生成测试报告

/*上线阶段*/

// ftp上传
// 替换路径

// 本地起服务


gulp.task('serve', ['jade', 'sass', 'es5_to_es5'], () => {
	browserSync({
		notify: false,
		port: 9000,
		server: {
			baseDir: [server_root]
		}
	});

	gulp.watch([
		path.s_sass + "**/*.scss",
		build + "**/*.jade",
		path.s_js + "**/*.js",
		path.server_img + "**/*",
		path.server_js + "**/*",
		path.server_css + "**/*",
		server_root + '*.html'
	]).on('change', reload);

	gulp.watch(build + "**/*.jade", ['jade']);
	gulp.watch(path.s_sass + "**/*.scss", ['sass']);
	gulp.watch(path.s_js + "**/*.js", ['es5_to_es5']);
	// gulp.watch('bower.json', ['wiredep', 'fonts']);
});

// 帮助说明
gulp.task('help', () => {
	console.log("scss_2_cs : SCSS文件编译为CSS文件到开发目录");
	console.log("cssmin    : 压缩CSS文件到生产目录");
	console.log("uglify    : 压缩JS文件到生产目录");
	console.log("imagemin  : 压缩png文件到生产目录");
	console.log("sprite    : 雪碧图生成到生成目录");
	console.log("es6_2_es5 : es6转为ES5");
	console.log("serve     : 本地静态服务器");
	console.log("rimraf    : 删除生成目录所有文件");

});