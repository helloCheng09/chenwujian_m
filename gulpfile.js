let gulp = require("gulp");
let babel = require("gulp-babel");
let uglify = require("gulp-uglify");
let concat = require('gulp-concat');
let cleanCSS = require('gulp-clean-css')
let jsRemove = require('gulp-remove-logging')
var strip = require("gulp-strip-debug")

const folder = {
    src: "./src/",
    build: "./build/"
}

// html
gulp.task("html", () => {
    return gulp.src(folder.src + "html/*.html")
        .pipe(gulp.dest(folder.build + "html"))
})

// css
gulp.task("css", () => {
    return gulp.src(folder.src + "css/*.css")
        .pipe(cleanCSS({
            compatibility: 'ie8'
        }))
        .pipe(gulp.dest(folder.build + "css"))
})
// img
gulp.task("img", () => {
    return gulp.src(folder.src + "img/*")
        .pipe(gulp.dest(folder.build + "img"))
})
// concat
gulp.task("concat", () => {
    return gulp.src([folder.src + "js/click.js", folder.src + "js/index.js"])
        .pipe(concat('all.js'))
        .pipe(gulp.dest(folder.src + "js"))
})      
// js
gulp.task("js", () => {
     return gulp.src([ folder.src + "js/*.js" ])
        .pipe(strip())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglify())
        .pipe(gulp.dest(folder.build + "js"))
})
// layui
gulp.task("layui", () => {
    return gulp.src(folder.src + "js/layui/")
        .pipe(gulp.dest(folder.build + "js/layui/"))
})
// gulp.task("default", ["html", "css", "img", "js", "layui"])
gulp.task("default", ["css", "js"])