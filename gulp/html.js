'use strict';

import fs from 'fs';
import path from 'path';
import foldero from 'foldero';
import jade from 'jade';
import yaml from 'js-yaml';
import Msg from 'node-msg';
import gulpif from 'gulp-if';
import {
    stream as wiredep
} from 'wiredep';


export default function(gulp, tools, plugins, args, config, project, taskTarget, browserSync) {
    let dirs = config.directories,
        dest = path.join(taskTarget),
        pname = project.wlEntry.pname,
        pmodule = project.wlEntry.pmodule,
        piswl = project.wlEntry.iswl,
        wlEntry = project.wlEntry,
        isReplace = piswl && args.production,
        // wl的专用path
        wldirs = config.wl,
        // data数据存放
        dataPath = path.join(dirs.source, dirs.data);

    // template编译
    gulp.task('html', () => {
        // data数据的定义
        let siteData = {};
        // 判断data是否有
        if (fs.existsSync(dataPath)) {
            siteData = foldero(dataPath, {
                recurse: true,
                whitelist: '(.*/)*.+\.(json|ya?ml)$',
                loader: function loadAsString(file) {
                    let json = {};
                    try {
                        if (path.extname(file).match(/^.ya?ml$/)) {
                            json = yaml.safeLoad(fs.readFileSync(file, 'utf8'));
                        } else {
                            json = JSON.parse(fs.readFileSync(file, 'utf8'));
                        }
                    } catch (e) {
                        console.log('Error Parsing JSON/YAML file: ' + file);
                        console.log('==== Details Below ====');
                        console.log(e);
                    }
                    return json;
                }
            });
        }

        // 添加 --debug这个命令来查看gulp任务
        // 以下是加载到您的模板中的数据
        if (args.debug) {
            Msg.success('==== 提示: site.data 将被注入到您的模板中 ====');
            console.log(siteData);
            Msg.success('\n==== 提示: package.json 自定义项将注入到您的模板中 ====');
            console.log(config);
        }


        return gulp.src([
                path.join(dirs.source, '**/*.jade'),
                '!' + path.join(dirs.source, '{**/\_*,**/\_*/**}')
            ])
            .pipe(plugins.changed(dest))
            .pipe(plugins.plumber())
            .pipe(plugins.jade({
                jade: jade,
                pretty: true,
                locals: {
                    config: config,
                    project: project,
                    debug: true,
                    site: {
                        data: siteData
                    }
                }
            }))
            .pipe(plugins.htmlmin({
                collapseBooleanAttributes: true,
                conservativeCollapse: true,
                removeCommentsFromCDATA: true,
                removeEmptyAttributes: true,
                removeRedundantAttributes: true
            }))
            .pipe(gulpif(isReplace, plugins.replace(/images\//gi, wldirs.img + '/' + pmodule + '/' + pname + '/')))
            .pipe(gulpif(isReplace, plugins.replace(/styles\//gi, wldirs.css + '/' + pmodule + '/' + pname + '/')))
            .pipe(gulpif(isReplace, plugins.replace(/scripts\//gi, wldirs.js + '/' + pmodule + '/' + pname + '/')))
            .pipe(wiredep({
                ignorePath: /^(\.\.\/)*\.\./
            }))
            .pipe(gulp.dest(dest))
            .on('end', browserSync.reload);
    });

}
