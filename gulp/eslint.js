/*eslint no-process-exit:0 */

'use strict';

import path from 'path';
import gulpif from 'gulp-if';
import Msg from 'node-msg';

export default function(gulp, tools, plugins, args, config, project, taskTarget, browserSync) {
    let dirs = config.directories;
    let option = {
        "parser": "babel-eslint",
        "env": {
            "browser": true,
            "node": true,
            "es6": true
        },
        "globals": {
            "DocumentFragment": true,
            "expect": true,
            "it": true,
            "describe": true,
            "beforeEach": true,
            "runs": true,
            "spyOn": true,
            "spyOnEvent": true,
            "waitsFor": true,
            "expect": true,
            "afterEach": true,
            jQuery: true
        },
        "rules": {
            "indent": [2, 2],
            "valid-jsdoc": 0,
            "brace-style": [1, "stroustrup"],
            "no-constant-condition": 1,
            "no-underscore-dangle": 0,
            "no-use-before-define": 1,
            "func-names": 0,
            "semi": [2, "always"],
            "no-new": 0,
            "new-parens": 2,
            "no-ternary": 0,
            "new-cap": 0,
            "no-unused-vars": [1, { "vars": "local", "args": "none" }],
            "quotes": [2, "single"],
            "one-var": 0,
            "space-infix-ops": 0,
            "strict": 0,
            "camelcase": [2, { "properties": "never" }]
        }
    };
    // ESLint
    gulp.task('eslint', () => {
        return gulp.src([
                path.join('gulpfile.js'),
                path.join(dirs.source, '**/*.js'),
                // 忽略vendor里的文件
                '!' + path.join('**/vendor/**', '*')
            ])
            .pipe(browserSync.reload({ stream: true, once: true }))
            .pipe(plugins.eslint(option))
            .pipe(plugins.eslint.format())
            .pipe(gulpif(!browserSync.active, plugins.eslint.failAfterError()))
            .on('error', function() {
                if (!browserSync.active) {
                    process.exit(1);
                }
            });
    });
}
