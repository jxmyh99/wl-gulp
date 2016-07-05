'use strict';

import path from 'path';
import Msg from 'node-msg';
export default function(gulp, tools, plugins, args, config, project, taskTarget, browserSync) {
    let dirs = config.directories,
        templter = dirs.templter,
        dest = path.join(taskTarget),
        tmp;
    /*
      --pc 则拷贝templter/pc下面的模板到src
      --mb 则拷贝templter/mobile的文件到src
      --flex 则拷贝temlter/flexible的文件到src
      默认为--mb
     */
    if (args.pc) {
        tmp = 'pc';
    } else if (args.flex) {
        tmp = 'flexible';
    } else {
        tmp = 'mobile';
    }

    let src = args._[0] == 'reset' ? path.join(dirs.templter, tmp, '**/*') : path.join(dirs.source, '**/*');
    // if(args._[0] == 'reset'){
    // 拷贝其它文件到dest目录下
    gulp.task('copy', () => {
        return gulp.src([
                src, '!' + path.join(dirs.source, '{**/\_*,**/\_*/**}'), '!' + path.join(dirs.source, '**/*.jade')
            ])
            .pipe(plugins.changed(args._[0] == 'reset' ? path.join(dirs.source) : dest))
            .pipe(gulp.dest(args._[0] == 'reset' ? path.join(dirs.source) : dest))
            .on('end', () => {
                if (args._[0] == 'reset') {
                    Msg.log('模板来自' + Msg.green('templter/' + tmp) + '。详细请输入' + Msg.green('gulp help') + '查看');
                }
            })
    });
    // }
}
