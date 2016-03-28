var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var uglify = require('gulp-uglifyjs');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var minify = require('gulp-minify');

// Static Server + watching scss/html files
gulp.task('serve', ['sass', 'js'], function() {

    browserSync.init({
        server: "./app"
    });

    gulp.watch("src/img/*", ['images']);
    gulp.watch("src/scss/*.scss", ['sass']);
    gulp.watch("src/js/*.js", ['js']);
    gulp.watch("app/*.html").on('change', browserSync.reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src("src/scss/*.scss")
        .pipe(sass())
        .pipe(gulp.dest("app/css"))
        .pipe(browserSync.stream());
});

// JS minify and concat
gulp.task('js', function() {
    gulp.src('src/js/*.js')
    .pipe(concat('all.js'))
    .pipe(gulp.dest('app/js/'));
});

// Optimise images
gulp.task('images', function() {
	return gulp.src('src/img/*')
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		}))
		.pipe(gulp.dest('app/img'));
});

gulp.task('default', ['serve']);