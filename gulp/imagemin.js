'use strict';

import path from 'path';
import gulpif from 'gulp-if';
import pngquant from 'imagemin-pngquant';
import Msg from 'node-msg';

export default function(gulp, tools, plugins, args, config, project, taskTarget, browserSync) {
    let dirs = config.directories,
        pname = project.wlEntry.pname,
        pmodule = project.wlEntry.pmodule,
        piswl = project.wlEntry.iswl,
        // wl的专用path
        wldirs = config.wl,
        dest;

    // wl和production都为true的时候，才会生成wl的目录
    if (piswl && args.production) {
        if (pmodule && pname) {
            dest = path.join(taskTarget, dirs.images.replace(/^_images/, ''), wldirs.img, pmodule, pname);
        } else {
            Msg.log('请确认' + Msg.green('gulp reset --pname xxx --pmodule xxx --wl') + '是否输入:例如：' + Msg.green('gulp reset --pname "you project name" --pmodule "you module name" --wl') + '。详细请输入' + Msg.green('gulp help')) + '查看';
        }
    } else {
        dest = path.join(taskTarget, dirs.images.replace(/^_/, ''));
    }

    // Imagemin
    if (dest) {
        gulp.task('imagemin', () => {
            return gulp.src(path.join(dirs.source, dirs.images, '**/*.{jpg,jpeg,gif,svg,png}'))
                .pipe(plugins.changed(dest))
                .pipe(gulpif(args.production, plugins.imagemin({
                    progressive: true,
                    svgoPlugins: [{ removeViewBox: false }],
                    use: [pngquant({ speed: 10 })]
                })))
                .pipe(gulp.dest(dest));
        });
    }
}
