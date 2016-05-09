var gulp = require('gulp'),
	gulpLoadPlugins = require('gulp-load-plugins'),
	browserSync = require('browser-sync'),
	del = require('del'),
	wiredep = require('wiredep').stream,
	$ = gulpLoadPlugins(),
	reload = browserSync.reload;


gulp.task('styles', function() {
	return gulp.src('app/styles/*.scss')
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
		.pipe(gulp.dest('.tmp/styles'))
		.pipe(reload({
			stream: true
		}));
});

gulp.task('scripts', function() {
	return gulp.src('app/scripts/**/*.js')
		.pipe($.plumber())
		.pipe($.sourcemaps.init())
		.pipe($.babel({
			presets: ['es2015']
		}))
		.pipe($.sourcemaps.write('.'))
		.pipe(gulp.dest('.tmp/scripts'))
		.pipe(reload({
			stream: true
		}));
});

// 验证格式
function lint(files, options) {
	return function() {
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

var LintOptions = {
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
gulp.task('lint', lint('app/scripts/**/*.js', LintOptions));

// 生成html
gulp.task('html', ['styles', 'scripts'], function() {
	return gulp.src('app/*.html')
		.pipe($.useref({
			searchPath: ['.tmp', 'app', '.']
		}))
		.pipe($.if('*.js', $.uglify()))
		.pipe($.if('*.css', $.cssnano()))
		.pipe($.if('*.html', $.htmlmin({
			collapseWhitespace: true
		})))
		.pipe(gulp.dest('dist'))
});
/*生成jade模板文件*/
gulp.task('jade', function() {
	return gulp.src('app/*.jade')
		.pipe($.jade({
			pretty: true
		}))
		.pipe(gulp.dest('app/'));
});
// 压缩images
gulp.task('images', function() {
	return gulp.src('app/images/**/*')
		.pipe($.cache($.imagemin({
			progressive: true,
			interlaced: true,
			svgoPlugins: [{
				cleanupIDs: false
			}]
		})))
		.pipe(gulp.dest('dist/images'));
});
//字体设置
gulp.task('fonts', function() {
	return gulp.src(require('main-bower-files')('**/*.{eot,svg,ttf,woff,woff2}', function(err) {})
			.concat('app/fonts/**/*'))
		.pipe(gulp.dest('.tmp/fonts'))
		.pipe(gulp.dest('dist/fonts'));
});
//删除文件
gulp.task('clean', del.bind(null, ['.tmp', 'dist']));
//开启服务器
gulp.task('serve', ['styles', 'scripts', 'fonts', 'jade'], function() {
	browserSync({
		notify: false,
		port: 9000,
		server: {
			baseDir: ['.tmp', 'app'],
			routes: {
				'/bower_components': 'bower_components'
			}
		}
	});

	gulp.watch([
		'app/*.jade',
		'app/*.html',
		'app/images/**/*',
		'.tmp/fonts/**/*'
	]).on('change', reload);
	gulp.watch('app/*.jade', ['jade']);
	gulp.watch('app/styles/**/*.scss', ['styles']);
	gulp.watch('app/scripts/**/*.js', ['scripts']);
	gulp.watch('app/fonts/**/*', ['fonts']);
	gulp.watch('bower.json', ['wiredep', 'fonts']);
});

gulp.task('wiredep', function() {
	gulp.src('app/styles/*.scss')
		.pipe(wiredep({
			ignorePath: /^(\.\.\/)+/
		}))
		.pipe(gulp.dest('app/styles'));

	gulp.src('app/*.jade')
		.pipe(wiredep({
			ignorePath: /^(\.\.\/)*\.\./
		}))
		.pipe(gulp.dest('app'));
});

gulp.task('build', ['lint', 'jade', 'images', 'fonts', 'extras'], function() {
	return gulp.src('dist/**/*').pipe($.size({
		title: 'build',
		gzip: true
	}));
});