var autoprefixer = require('gulp-autoprefixer');
var browserSync  = require('browser-sync');
var cache        = require('gulp-cached');
var combineMq    = require('gulp-combine-mq');
var concat       = require('gulp-concat');
var config       = require('./config.json');
var cssminifiy   = require('gulp-clean-css');
var gulp         = require('gulp');
var gutil        = require('gulp-util');
var notify       = require('gulp-notify');
var plumber      = require('gulp-plumber');
var reload       = browserSync.reload;
var rename       = require('gulp-rename');
var runSequence  = require('run-sequence');
var sass         = require('gulp-sass');
var sourcemaps   = require('gulp-sourcemaps');
var uglify       = require('gulp-uglify');





// > Manage task's errors
var onError = function (err) {
	gutil.beep();
	console.log(err);
};




// > Copy humansTXT
gulp.task('humansTXT', function () {
	return gulp.src(config.humansTXT.src)
		.pipe(gulp.dest(config.humansTXT.dest))
		.pipe(notify({message: '>> ✔︎ Humans txt', onLast: true}));
});





// > Process SASS/SCSS files to generate final css files in 'public' folder
gulp.task( 'styles' , function(cb) {
	return gulp.src(config.styles.src)
		.pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
		.pipe(sass({
			outputStyle: 'compressed',
		}))
		.pipe(combineMq({
			beautify: false
		}))
		.pipe(autoprefixer({
			browsers: [
				'last 2 versions',
				'ie >= 10'
			],
			cascade: false
		}))
		.pipe(cssminifiy())
		.pipe(gulp.dest(config.styles.dest))
		.pipe(browserSync.reload({ stream:true }))
		.pipe(notify({message: 'CSS OK', onLast: true}));
});





// > Process plugins into a single JS file inside 'assets/js' folder
gulp.task('plugins', function(){
	return gulp.src(config.plugins.src)
		.pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
		.pipe(concat('plugins.js'))
		//.pipe(uglify())
		.pipe(gulp.dest(config.plugins.dest))
		.pipe(browserSync.reload({ stream:true }))
		.pipe(notify({message: 'PLUGINS OK', onLast: true}));
});





// > Process JS scripts into a single JS file inside 'assets/js' folder
gulp.task('scripts', function(){
	return gulp.src(config.scripts.src)
		.pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
		.pipe(concat('main.js'))
		//.pipe(uglify())
		.pipe(gulp.dest(config.scripts.dest))
		.pipe(browserSync.reload({ stream:true }))
		.pipe(notify({message: 'JS OK', onLast: true}));
});





// > Create a development server with BrowserSync
gulp.task('go', ['default'], function () {
	browserSync.init({
		server : {
			baseDir: ""
		},
		ghostMode: false,
		online: true
	});
	gulp.watch(config.watch.images, ['bs-reload']);
	gulp.watch(config.watch.vendorJS, ['bs-reload']);
	gulp.watch(config.watch.humansTXT, ['humansTXT']);
	gulp.watch(config.watch.styles, ['styles']);
	gulp.watch(config.watch.scripts, ['scripts', 'plugins']);
	gulp.watch(config.watch.html, ['bs-reload']);
});





// > Force a browser page reload
gulp.task('bs-reload', function () {
	browserSync.reload();
});





// > Generate 'public' folder
gulp.task('default', function (cb) {
	runSequence('styles', ['humansTXT', 'plugins', 'scripts'], cb);
});
