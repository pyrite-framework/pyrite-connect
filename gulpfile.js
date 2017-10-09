var gulp = require('gulp');
var ts = require('gulp-typescript');
var changed = require('gulp-changed');
var browserSync = require('browser-sync').create();
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var gulpSequence = require('gulp-sequence')

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: './dist'
        }
    });
});

gulp.task('scripts-ts', () => {
    gulp.src(['./src/**/*.ts'])
        .pipe(ts({
            noImplicitAny: true,
            sourceMap: true
        }))
        .pipe(gulp.dest('./lib/'));
});

gulp.task('scripts-ts-example', () => {
    gulp.src(['./example/main.ts'])
        .pipe(ts({
            noImplicitAny: true,
            sourceMap: true,
            allowJs: true
        }))
        .pipe(gulp.dest('./example-lib/'));
});

gulp.task('scripts', () => {
    browserify('example-lib/main.js')
    .bundle()
    .pipe(source('./main.js'))
    .pipe(gulp.dest('./dist/main'));
});

gulp.task('htmlpage', () => {
    var htmlSrc = './example/**/*.html',
        htmlDst = './dist';

    gulp.src(htmlSrc)
        .pipe(changed(htmlDst))
        .pipe(gulp.dest(htmlDst));
});

gulp.task('build', ['scripts-ts']);

gulp.task('watch', gulpSequence('scripts-ts', 'scripts-ts-example', 'scripts'));

gulp.task('default', ['htmlpage', 'watch', 'browser-sync'], () => {
    gulp.watch(['./src/**/*.ts'], ['watch', browserSync.reload]);
    gulp.watch(['./example/**/*.ts'], ['watch', browserSync.reload]);
    gulp.watch('./example/**/*.html', ['htmlpage', browserSync.reload]);
});
