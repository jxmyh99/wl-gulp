'use strict';

export default function(gulp, tools, plugins, args, config, project, taskTarget, browserSync) {
    // BrowserSync
    gulp.task('browserSync', () => {
        browserSync.init({
            open: args.open ? 'external' : false,
            // 自己在局域网中的ip地址
            host: config.locahost,
            startPath: config.baseUrl,
            port: config.port || 3000,
            server: {
                baseDir: taskTarget,
                routes: (() => {
                    let routes = {
                        '/bower_components': 'bower_components'
                    };

                    routes[config.baseUrl] = taskTarget;

                    return routes;
                })()
            }
        });
    });
}
