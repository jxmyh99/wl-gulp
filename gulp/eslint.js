/*eslint no-process-exit:0 */

'use strict';

import path from 'path';
import gulpif from 'gulp-if';
import Msg from 'node-msg';

export default function(gulp, tools, plugins, args, config, project, taskTarget, browserSync) {
  let dirs = config.directories;

  // ESLint
  gulp.task('eslint', () => {
    return gulp.src([
      path.join('gulpfile.js'),
      path.join(dirs.source, '**/*.js'),
      // 忽略vendor里的文件
      '!' + path.join('**/vendor/**', '*')
    ])
    .pipe(browserSync.reload({stream: true, once: true}))
    .pipe(plugins.eslint({
      useEslintrc: true
    }))
    .pipe(plugins.eslint.format())
    .pipe(gulpif(!browserSync.active, plugins.eslint.failAfterError()))
    .on('error', function() {
      if (!browserSync.active) {
        process.exit(1);
      }
    });
  });
}
