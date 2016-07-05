'use strict';

import path from 'path';
import Msg from 'node-msg';
export default function(gulp, tools, plugins, args, config, project, taskTarget, browserSync) {
    let dirs = config.directories,
        templter = dirs.templter,
        dest = path.join(dirs.source, args.p ? args.p : '_modules/' + args.m),
        style,
        srcDir;
    if (args.sass || args.scss) {
        style = 'sass';
    } else if (args.less) {
        style = 'less';
    } else if (args.stylus) {
        style = 'stylus';
    } else {
        style = 'css';
    }

    if (/^[a-zA-Z]+\S/gi.test(args.p) && !!args.p && args.p != true) {
        srcDir = 'page';
    } else if (/^[a-zA-Z]+\S/gi.test(args.m) && !!args.m && args.m != true) {
        srcDir = 'module';
    }
    let src = path.join(templter, 'create/' + srcDir + '/**/*');
    // 拷贝其它文件到src目录下,伪装成创建命令
    gulp.task('create', () => {
        return gulp.src([src])
            .pipe(plugins.replace(srcDir, args.p || args.m))
            .pipe(plugins.replace('Module', args.m.replace(/(\w)/, function(v) {
                return v.toUpperCase() })))
            .pipe(plugins.rename(function(path) {
                // 替换文件名
                path.basename = args.p || args.m;
            }))
            .pipe(plugins.if('*.scss', plugins.rename((path) => {
                path.extname = '.' + style;
            })))
            .pipe(gulp.dest(dest));
    });
}
