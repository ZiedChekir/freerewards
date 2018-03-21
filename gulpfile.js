var gulp = require('gulp')
var browserSync = require('browser-sync').create()
var sass = require('gulp-sass')

gulp.task('sass',function(){
    return gulp.src(['public/scss/style.scss'])
    .pipe(sass())
    .pipe(gulp.dest("public/css"))
    .pipe(browserSync.stream())
})

gulp.task('js',function(){
    return gulp.src(['node_modules/bootstrap/dist/js/bootstrap.min.js','node_modules/jquery/dist/jquery.min.js','node_modules/tether/dist/js/tether.min.js'])   
    .pipe(gulp.dest("public/js"))
    .pipe(browserSync.stream())
})


gulp.task('serve',['sass'],function(){

    browserSync.init({
        server:"./public"
    })
    gulp.watch(['node_modules/bootstrap/scss/bootstrap.scss','public/scss/*.scss'],['sass'])
})

gulp.task('default',['js','serve'])







