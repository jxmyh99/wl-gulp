'use strict';

import path from 'path';
import del from 'del';
import Msg from 'node-msg';
export default function(gulp, tools, plugins, args, config, project, taskTarget, browserSync) {
  let dirs = config.directories;


  // 清除tmp和build目录
  gulp.task('clean', del.bind(null, [args._[0] == 'reset'?path.join(dirs.source):'',
    path.join(dirs.temporary),
    path.join(dirs.destination)
  ]));
}

