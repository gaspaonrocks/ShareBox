var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var concatCss = require('gulp-concat-css');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var pump = require('pump');
var inject = require('gulp-inject');

gulp.task('lint', function() {
  return gulp.src('./frontend/*/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('scripts', function () {
	return gulp.src('./frontend/*/*.js')
		.pipe(concat('index.js'))
		.pipe(gulp.dest('./dist/'));
});

gulp.task('css', function () {
	return gulp.src('./frontend/**/*.css')
		.pipe(concatCss("bundle.css"))
		.pipe(gulp.dest('./dist/'));
});

gulp.task('minify-css', function () {
	return gulp.src('./dist/bundle.css')
		.pipe(cleanCSS({
			compatibility: 'ie8'
		}))
		.pipe(gulp.dest('./dist/bundle.min.css'));
});

gulp.task('compress', function (callback) {
	pump([
			gulp.src('./dist/index*.js'),
			uglify(),
			gulp.dest('./dist/index.min.js')
		],
		callback
	);
});

gulp.task('index', function () {
	var target = gulp.src('./frontend/index.html');
	var sources = gulp.src(['./dist/index.min.js', './dist/bundle.min.css'], {
		read: false
	});

	return target.pipe(inject(sources))
		.pipe(gulp.dest('./frontend/index.html'));
});