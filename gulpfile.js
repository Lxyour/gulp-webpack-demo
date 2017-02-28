var gulp = require('gulp');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var clean = require('gulp-clean');
var cleanCSS = require('gulp-clean-css');
var minifyCSS = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();

var fs = require('fs');
var path = require('path');
var merge = require('merge-stream');
var concat = require('gulp-concat');
var rename = require('gulp-rename');

function getFolders(dir) {
    return fs.readdirSync(dir)
      .filter(function(file) {
        return fs.statSync(path.join(dir, file)).isDirectory();
      });
}

gulp.task('scripts', function() {
	 var scriptsPath = 'src/js';
   var folders = getFolders(scriptsPath);
   var tasks = folders.map(function(folder) {
      return gulp.src(path.join(scriptsPath, folder, '/*.js'))
        .pipe(concat(folder + '.js'))
        .pipe(gulp.dest(scriptsPath))
        .pipe(uglify())
        .pipe(rename(folder + '.min.js'))
        .pipe(gulp.dest(scriptsPath));
   });
   return merge(tasks);
});


gulp.task('css', function () {
	var cssPath = 'src/css';
	var folders = getFolders(cssPath);
	var tasks = folders.map(function (folder) {
		return gulp.src(path.join(cssPath, folder, '/*.css'))
			.pipe(concat(folder + '.css'))
			.pipe(gulp.dest(cssPath))
			.pipe(minifyCSS())
			.pipe(rename(folder + '.min.css'))
			.pipe(gulp.dest(cssPath));
	})
	return merge(tasks);
})

gulp.task('browserSync', function() {
	browserSync.init({
		server: {
			baseDir: '.'
		}
	});
});

gulp.task('sass', function() {
	return gulp.src('./src/scss/**/*.scss')
		.pipe(sass())
		.pipe(autoprefixer())
		.pipe(gulp.dest('./src/css'))
		.pipe(browserSync.reload({
			stream: true
		}));
});

gulp.task('watch', ['browserSync', 'sass'], function() {
	gulp.watch('./src/scss/**/*.scss', ['sass']);
	gulp.watch('./*.html', browserSync.reload);
	gulp.watch('./src/js/**/*.js', browserSync.reload);
});

gulp.task('dev', ['watch'], function() {
	console.log( 'default task...' );
});

gulp.task('clean', function(){
	return gulp.src('dist/*', {read: false})
		.pipe( clean() );
});

gulp.task('build', ['clean'], function(){
	gulp.src( 'src/css/**/*.css' )
		.pipe( cleanCSS() )
		.pipe( gulp.dest('dist/src/css') );
	gulp.src( ['src/css/**/*.*', '!src/css/**/*.css'] )
		.pipe( gulp.dest('dist/src/css') );
	gulp.src( 'src/img/**/*.*' )
		.pipe( gulp.dest('dist/src/img') );
	gulp.src( 'src/js/**/*.js' )
		.pipe( uglify() )
		.pipe( gulp.dest('dist/src/js') );
	gulp.src( './*.html' )
		.pipe( gulp.dest('dist') );
});
