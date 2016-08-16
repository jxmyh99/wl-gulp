import path from 'path';
import Msg from 'node-msg';
import merge from 'merge-stream';
import pngquant from 'imagemin-pngquant';
export default function(gulp, tools, plugins, args, config, project, taskTarget, browserSync) {
    let dirs = config.directories;
    //sprite
    // 后期考虑加入3倍的图片
    // 考虑加入判断所使用的是less,stylus,css等其它方法的兼容
    gulp.task('sprite', () => {
        let spriteData = gulp.src(path.join(dirs.source, dirs.sprite, '**/*.png')).pipe(plugins.changed(path.join(dirs.source, dirs.sprite, '**/*.png'))).pipe(plugins.spritesmith({
                retinaSrcFilter: args.x2 ? path.join(dirs.source, dirs.sprite, '**/*@2x.png') : '',
                imgName: 'sprite.png', //生成的精灵图文件名
                retinaImgName: args.x2 ? 'sprite@2x.png' : '',
                cssName: 'sprite.scss', //精灵图生成的样式文件
                cssTemplate: path.join(dirs.source, dirs.sprite) + '/scss_maps_retina.template.handlebars', //各个生成的样式模板
                algorithm: 'binary-tree', //精灵图合并的方式，详情请查看https://www.npmjs.com/package/gulp.spritesmith
                // cssOpts: 'spriteSrc', //生成的变量名
                cssVarMap: function(sprite) {
                    sprite.name = 'icon-' + sprite.name
                }
            })),
            imgSteam = spriteData.img.pipe(gulp.dest(path.join(dirs.source, dirs.images))),
            cssSteam = spriteData.css.pipe(gulp.dest(path.join(dirs.source, dirs.styles)));
        return merge(imgSteam, cssSteam);
    })

}
