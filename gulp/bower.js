import Msg from 'node-msg';
import path from 'path';
import {
    stream as wiredep
} from 'wiredep';
export default function(gulp, tools, plugins, args, config, project, taskTarget, browserSync) {
    let dirs = config.directories;
    let dest = path.join(taskTarget);
    let entries = config.entries,
        wldirs = config.wl,
        pname = project.wlEntry.pname,
        pmodule = project.wlEntry.pmodule,
        piswl = project.wlEntry.iswl;
    gulp.task('bower',['html'], () => {
        return gulp.src(path.join(dest, '**/*.html'))
            .pipe(plugins.useref({
                searchPath: ["tmp","src","."],
            }))
            .pipe(plugins.if('*.js', plugins.uglify()))
            .pipe(plugins.if('*.css', plugins.cssnano()))
            .pipe(plugins.size({ title: 'build', gzip: true }))
            .pipe(gulp.dest(dest)).on('end', () => {
                console.log(dest);
            })
    })

}
