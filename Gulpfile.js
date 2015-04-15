var gulp = require('gulp'),
    cp = require('child_process'),
    browserSync = require('browser-sync'),
    plugins = require('gulp-load-plugins')();

// Build the Jekyll Site
gulp.task('jekyll-build', function (done) {
    return cp.spawn('jekyll', ['build'], { stdio: 'inherit' })
        .on('close', done);
});

// Rebuild Jekyll & do page reload when changes happen
gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
    browserSync.reload();
});

// Wait for jekyll-build, then launch the browser-sync server
gulp.task('browser-sync', ['build', 'jekyll-build'], function() {
    browserSync({
        server: {
            baseDir: '_site'
        }
    });
});

// Build task
gulp.task('build', ['styles']);

// Styles task
gulp.task('styles', function() {
    gulp.src('sass/**/*.scss')
        .pipe(plugins.sass({
            errLogToConsole: true,
            onError: browserSync.notify
        }))
        .pipe(plugins.autoprefixer({
            browsers: ['> 1%','last 4 versions'],
            cascade: false
        }))
        .pipe(plugins.minifyCss())
        .pipe(gulp.dest('_site/stylesheets/'))
        .pipe(browserSync.reload({stream:true}))
        .pipe(gulp.dest('./stylesheets/'));
});

// Image task
gulp.task('images', function() {
    gulp.src('images/**/*')
        .pipe(plugins.imagemin({
            svgoPlugins: [{removeViewBox: false}]
        }))
        .pipe(gulp.dest('_site/images'))
        .pipe(browserSync.reload({ stream: true }))
        .pipe(gulp.dest('./images'));
})

// Watch task
gulp.task('watch', function () {
    gulp.watch('sass/**/*.scss',['styles']);
    gulp.watch('images/**/*',['images']);
    gulp.watch(['**/*.html', '_config.yml'], ['jekyll-rebuild']);
});

// Default task
gulp.task('default', ['browser-sync', 'watch']);
