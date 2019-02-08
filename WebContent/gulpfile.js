const gulp = require('gulp');
const cleanCSS = require('gulp-clean-css');
const rename = require("gulp-rename");
const uglify = require('gulp-uglify-es').default;

// Copy third party libraries from /node_modules into /vendor
gulp.task('vendor', function () {
    gulp.src([
        './node_modules/@material/ripple/dist/*.js',
        './node_modules/@material/ripple/dist/*.css'
    ]).pipe(gulp.dest('./vendor/ripple'));

    gulp.src([
        './node_modules/@material/button/dist/*.js',
        './node_modules/@material/button/dist/*.css'
    ]).pipe(gulp.dest('./vendor/button'));

    return gulp.src([
        './node_modules/@material/textfield/dist/*.js',
        './node_modules/@material/textfield/dist/*.css'
    ]).pipe(gulp.dest('./vendor/textfield'))
});

// Minify CSS
gulp.task('css:minify', function () {
    return gulp.src([
        './css/*.css',
        '!./css/*.min.css'
    ])
        .pipe(cleanCSS())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./css'));
});

// CSS
gulp.task('css', gulp.series('css:minify'));

// Minify JavaScript
gulp.task('js:minify', function () {
    return gulp.src([
        './js/*.js',
        '!./js/*.min.js'
    ])
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./js'));
});

// JS
gulp.task('js', gulp.series('js:minify'));

// Default task
gulp.task('default', gulp.parallel('css', 'js', 'vendor'));