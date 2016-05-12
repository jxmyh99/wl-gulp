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
module.exports = gulp;
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
	dist = 'webstart/dist/' + year + '\/' + month + '月份/' + zip_day + '/', //输出目录
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
		.pipe($.rev())
		.pipe(gulp.dest(path.server_css))
		.pipe($.rev.manifest()) //- 生成一个rev-manifest.json
		.pipe(gulp.dest('./rev/css')) //- 将 rev-manifest.json 保存到 rev 目录内
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
gulp.task('es6_to_es5', () => {
	return gulp.src(path.s_js + '**/*.js')
		.pipe($.plumber())
		.pipe($.sourcemaps.init())
		.pipe($.babel({
			presets: ['es2015']
		}))
		.pipe($.sourcemaps.write())
		.pipe($.rev())
		.pipe(gulp.dest(path.server_js))
		.pipe($.rev.manifest()) //- 生成一个rev-manifest.json
		.pipe(gulp.dest('./rev/js')) //- 将 rev-manifest.json 保存到 rev 目录内
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
// 清除md5文件的json数据
gulp.task('clean:rev', () => {
	return gulp.src(['rev/**/*.json'], {
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

/*生产阶段*/

// sprite生成
/*
 *	使用scss模板不能生成2倍的图片的scss，后面要处理
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
		.pipe($.rev())
		.pipe(gulp.dest(path.server_img))
		.pipe($.rev.manifest()) //- 生成一个rev-manifest.json
		.pipe(gulp.dest('./rev/img')); //- 将 rev-manifest.json 保存到 rev 目录内
});

// 压缩css
gulp.task('cssmin', () => {
	return gulp.src(path.server_css + '*.css')
		.pipe($.plumber())
		.pipe($.sourcemaps.init())
		.pipe($.concat(zip_project + '.css'))
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
//替换css和js的文件名
gulp.task('html', () => {
	return gulp.src(server_root + "**/*.html")
		.pipe($.replace(/\w+([-+.]\w+)*(.css)/g, zip_project + ".min.css"))
		.pipe($.replace(/\w+([-+.]\w+)*(.js)/g, zip_project + ".min.js"))
		.pipe(gulp.dest(dist));
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
		.pipe(gulp.dest(path.d_js));
});

// 生成md5码
gulp.task('rev', () => {
	gulp.src(['rev/**/*.json', server_root + '**/*.html'])
		.pipe($.plumber())
		//- 读取 rev-manifest.json 文件以及需要进行css名替换的文件
		.pipe($.revCollector())
		//- 执行文件内css名的替换
		.pipe(gulp.dest(server_root));
	//- 替换后的文件输出的目录
});
//生成md5码集合，清除json文件，再jade生成html，最后替换文件名
gulp.task('rev_res', ['clean:rev', 'jade', 'rev']);


// 打包文件
gulp.task('zip', () => {
	return gulp.src(dist + '/**/*')
		.pipe($.plumber())
		.pipe($.zip(zip_project + '.zip'))
		.pipe(gulp.dest(save_project));
});
// 打包到生产目录
gulp.task('zip:dist', ['cssmin', 'jsmin', 'html'], () => {
	return gulp.src(path.server_img + "*").pipe($.plumber()).pipe(gulp.dest(path.d_img));
});
/*测试阶段*/

// 验证js
/*
 * 验证task有误
 * 
 */
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
	baseConfig: {
		parser: 'babel-eslint',
	},
	envs: [
		'browser', 'es6'
	]
}
gulp.task('lint', lint(path.s_js + '**/*.js', LintOptions));
gulp.task('lint:test', lint('test/spec/**/*.js', testLintOptions));

// 生成到测试目录 生产阶段的所有task全部这里集合
// 使用phantomJS来测试
// 生成测试报告

/*上线阶段*/

//字体文件生成
gulp.task('fonts', () => {
	return gulp.src(require('main-bower-files')('**/*.{eot,svg,ttf,woff,woff2}', function(err) {})
			.concat(build + 'fonts/**/*'))
		.pipe(gulp.dest(server_root + 'fonts'))
		.pipe(gulp.dest(dist + 'fonts'));
});
// 本地起服务

gulp.task('serve', ['sass', 'es6_to_es5', 'imagemin', 'rev_res'], () => {
	browserSync({
		notify: false,
		port: 9000,
		server: {
			baseDir: [server_root]
		}
	});

	gulp.watch([
		path.s_sass + "**/*.scss",
		path.s_js + "**/*.js",
		path.s_img + "**/*",
		// path.s_simg + "**/*",
		path.server_img + "**/*",
		path.server_js + "**/*",
		path.server_css + "**/*",
		build + "**/*.jade",
		server_root + '*.html'
	]).on('change', reload);

	gulp.watch(path.s_sass + "**/*.scss", ['sass']);
	gulp.watch(path.s_js + "**/*.js", ['es5_to_es5']);
	// gulp.watch(path.s_simg + "*", ['imagemin']);
	gulp.watch(path.s_img + "*", ['imagemin']);
	gulp.watch(build + "**/*.jade", ['jade']);
	gulp.watch('bower.json', ['wiredep', 'fonts']);
});
//检查输出目录
gulp.task('serve:dist', () => {
	browserSync({
		notify: false,
		port: 9000,
		server: {
			baseDir: [dist]
		}
	});
});

// bower组件
gulp.task('wiredep', () => {
	gulp.src(server_root + '**/*.html')
		.pipe(wiredep({
			ignorePath: /^(\.\.\/)*\.\./
		}))
		.pipe(gulp.dest('templter/js/public/'));
});

// 默认


//测试js

// 帮助说明
gulp.task('help', () => {
	console.log("es6_to_es5 : es6转为ES5");
	console.log("serve      : 本地静态服务器");
	console.log("clean      : 删除服务目录");
	console.log('clean:build: 删除工作目录')
});