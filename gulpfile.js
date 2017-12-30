const gulp = require('gulp');
const plumber = require('gulp-plumber');  //中断处理
const ts = require('gulp-typescript');
const uglify = require('gulp-uglify'); //js压缩插件
const rename = require('gulp-rename');


gulp.task('transfrom', function () {
    gulp.src('./src/*.ts')
        .pipe(plumber())
        .pipe(ts({ module: "amd" }))
        .pipe(gulp.dest("./dist/"))
})
gulp.task('uglify', function () {
    gulp.src('./src/*.ts')
        .pipe(plumber())
        .pipe(ts({ module: "amd" }))
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest("./dist/"))
})

gulp.task('build', ['uglify'])
gulp.task('default', ['transfrom']);