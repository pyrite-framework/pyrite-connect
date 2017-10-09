var gulp = require('gulp');
var ts = require('gulp-typescript');
var changed = require('gulp-changed');
var browserSync = require('browser-sync').create();

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: './'
        }
    });
});

gulp.task('scripts-ts', () => {
    gulp.src(['./src/**/*.ts'])
        .pipe(ts({
            noImplicitAny: true,
            module: 'commonjs',
            target: 'es6',
            sourceMap: true
        }))
        .pipe(gulp.dest('./lib/'));
});

gulp.task('scripts-ts-example', () => {
    gulp.src(['./src/**/*.ts'])
        .pipe(ts({
            noImplicitAny: true,
            module: 'commonjs',
            target: 'es6',
            sourceMap: true
        }))
        .pipe(gulp.dest('./dist/lib'));

    gulp.src(['./example/**/*.ts'])
        .pipe(ts({
            noImplicitAny: true,
            module: 'commonjs',
            target: 'es6',
            sourceMap: true
        }))
        .pipe(gulp.dest('./dist/example'));
});

gulp.task('htmlpage', () => {
    var htmlSrc = './example/**/*.html',
        htmlDst = './dist';

    gulp.src(htmlSrc)
        .pipe(changed(htmlDst))
        .pipe(gulp.dest(htmlDst));
});

gulp.task('build', ['scripts-ts']);

gulp.task('default', ['htmlpage', 'scripts-ts-example'], () => {
    browserSync.init({
        server: './dist'
    });

    gulp.watch(['./src/**/*.ts', './example/**/*.ts'], ['scripts-ts-example', browserSync.reload]);
    gulp.watch('./example/**/*.html', ['htmlpage', browserSync.reload]);
});