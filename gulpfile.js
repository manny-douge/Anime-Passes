var gulp        = require('gulp');
var browserSync = require('browser-sync').create();

browserSync.init({
  server: {
        baseDir: "./app"
          }
});

gulp.task('serve', function() {
    gulp.watch("app/css/*.css").on('change', browserSync.reload);
    gulp.watch("app/js/*.js").on('change', browserSync.reload);
    gulp.watch("app/*.html").on('change', browserSync.reload);
});
