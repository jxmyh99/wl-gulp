'use strict';

import path from 'path';
import Msg from 'node-msg';
export default function(gulp, tools, plugins, args, config, project, taskTarget, browserSync) {
    let dirs = config.directories,
        templter = dirs.templter,
        dest = path.join(dirs.source, args.p ? args.p : '_modules/' + args.m),
        style,
        srcDir;
    let _project = {
        'pname': args.m,
        'author': config.author,
        'create': tools.getDate(),
        'link': config.url

    };
    let banner = [
        '@charset "UTF-8";',
        '/**',
        ' * @entry <%= pkg.pname %>',
        ' * @author <%= pkg.author %>',
        ' * @create <%= pkg.create %>',
        ' * @link <%= pkg.link %>',
        ' */',
        ''
    ].join('\n');
    let banner1 = [
        '"use strict" ;',
        '/**',
        ' * @entry <%= pkg.pname %>',
        ' * @author <%= pkg.author %>',
        ' * @create <%= pkg.create %>',
        ' * @link <%= pkg.link %>',
        ' */',
        ''
    ].join('\n');
    if (args.css) {
        style = 'css';
    } else if (args.less) {
        style = 'less';
    } else if (args.stylus) {
        style = 'stylus';
    } else {
        style = 'scss';
    }

    if (/^[a-zA-Z]+\S/gi.test(args.p) && !!args.p && args.p != true) {
        srcDir = 'page';
    } else if (/^[a-zA-Z]+\S/gi.test(args.m) && !!args.m && args.m != true) {
        srcDir = 'module';
    }
    let src = path.join(templter, 'create/' + srcDir + '/**/*');
    let argsAll = args.p || args.m;
    // 拷贝其它文件到src目录下,伪装成创建命令
    gulp.task('create', () => {
        return gulp.src([src])
            .pipe(plugins.plumber())
            .pipe(plugins.replace(srcDir, argsAll))
            .pipe(plugins.if(!!args.m, plugins.replace('Module', argsAll.replace(/(\w)/, function(v) {
                return v.toUpperCase()
            }))))
            .pipe(plugins.if('*.{scss,sass,less,css,styl}', plugins.header(banner, { pkg: _project })))
            .pipe(plugins.if('*.{js,coffee}', plugins.header(banner1, { pkg: _project })))
            .pipe(plugins.rename(function(path) {
                // 替换文件名
                if (path.dirname == 'tests') {
                    path.basename = argsAll + '.test';
                    return false;
                }
                if (!!args.p) {
                    path.basename = argsAll;
                    return false;
                }

            }))
            .pipe(plugins.if('*.scss', plugins.rename((path) => {
                path.extname = '.' + style;
            })))
            .pipe(gulp.dest(dest))
            .on('end', () => {
                console.log(!!args.m)
            })
    });
}
