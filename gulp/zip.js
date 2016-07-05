import Msg from 'node-msg';
export default function(gulp, tools, plugins, args, config, project, taskTarget, browserSync) {
    let dirs = config.directories;

    let iswl = project.wlEntry.iswl;
    let ename = project.wlEntry.pname;
    if (ename) {
        gulp.task('zip', () => {
            return gulp.src(taskTarget)
                .pipe(plugins.plumber())
                .pipe(plugins.sourcemaps.init())
                .pipe(plugins.zip(args.pname + '.zip'))
                .pipe(plugins.sourcemaps.write('./'))
                .pipe(gulp.dest(tools.getPack('../project_zip')))
                .on('end', () => {
                    Msg.log(Msg.green(tools.getPack('../project_zip')));
                });
        })
    } else {
        Msg.log('请确认' + Msg.green('gulp reset --pname') + '是否输入:例如：' + Msg.green('gulp reset --pname "you project name"') + '。详细请输入' + Msg.green('gulp help')) + '查看';

    }

}
