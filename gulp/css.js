'use strict';

import path from 'path';
import autoprefixer from 'autoprefixer';
import Msg from 'node-msg';

export default function(gulp, tools, plugins, args, config, project, taskTarget, browserSync) {
    let dirs = config.directories,
        wldirs = config.wl,
        entries = config.entries,
        pname = project.wlEntry.pname,
        pmodule = project.wlEntry.pmodule,
        piswl = project.wlEntry.iswl,
        src = path.join(dirs.source, dirs.styles, entries.css),
        isReplace = piswl && args.production,
        dest;
    // wl和production都为true的时候，才会生成wl的目录
    if (piswl && args.production) {
        if (pmodule && pname) {
            dest = path.join(taskTarget, dirs.styles.replace(/^_styles/, ''), wldirs.css, pmodule, pname);
        } else {
            Msg.log('请确认' + Msg.green('gulp reset --pname xxx --pmodule xxx --wl') + '是否输入:例如：' + Msg.green('gulp reset --pname "you project name" --pmodule "you module name" --wl') + '。详细请输入' + Msg.green('gulp help')) + '查看';
        }
    } else {
        dest = path.join(taskTarget, dirs.styles.replace(/^_/, ''))
    }

    // 编译
    if (dest) {
        gulp.task('css', () => {
            return gulp.src(src).pipe(plugins.plumber({
                    errorHandler: function(err) {
                        console.log(err);
                        this.emit('end');
                    }
                }))
                .pipe(plugins.sourcemaps.init())
                .pipe(plugins.if('*.{sass,scss}', plugins.sass({
                        outputStyle: 'expanded',
                        precision: 10,
                        includePaths: [
                            path.join(dirs.source, dirs.styles),
                            path.join(dirs.source, dirs.modules)
                        ]
                    }).on('error', plugins.sass.logError)))

                .pipe(plugins.if('*.less', plugins.less({
                    paths: [
                        path.join(dirs.source, dirs.styles),
                        path.join(dirs.source, dirs.modules)
                    ]
                })))
                .pipe(plugins.if('*.styl', plugins.stylus({
                    compress: true,
                    linenos: true
                })))
                .pipe(plugins.postcss([autoprefixer({ browsers: ['last 2 version', '> 5%', 'safari 5', 'ios 6', 'android 4'] })]))
                .pipe(plugins.rename(function(path) {
                    // 替换目录名
                    // 例如: 'src/_styles' --> '/styles'
                    path.dirname = path.dirname.replace(dirs.source, '').replace('_', '');
                }))
                .pipe(plugins.if(isReplace, plugins.replace(/images\//gi, '../../' + wldirs.img + '/' + pmodule + '/' + pname + '/')))
                .pipe(plugins.if(args.production, plugins.cssnano({ rebase: false })))
                .pipe(plugins.sourcemaps.write('./'))
                .pipe(plugins.plumber.stop())
                .pipe(gulp.dest(dest))
                .pipe(browserSync.stream({ match: '**/*.css' }));
            Msg.log(Msg.green("css path:" + dest));
        });
    }
}
