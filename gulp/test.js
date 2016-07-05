import Msg from 'node-msg';
export default function(gulp, tools, plugins, args, config, project, taskTarget, browserSync) {
    let dirs = config.directories;
    gulp.task('help1'), () => {
        return gulp.src('templter/pc/pc.txt')
            .pipe(gulp.dest('templter/pc'))
            .on('end', () => {
                let html = "gulp reset  :  重置项目";
                Msg.log("gulp reset  :  重置项目");
                console.log(args);
            })
console.log(args);
    }
}
