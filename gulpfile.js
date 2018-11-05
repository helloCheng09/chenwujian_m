let gulp = require("gulp");
let babel = require("gulp-babel");
let uglify = require("gulp-uglify");
let cleanCSS = require('gulp-clean-css')
let jsRemove = require('gulp-remove-logging')
var strip = require("gulp-strip-debug")
var rev = require('gulp-rev')
var revCollector = require('gulp-rev-collector')

const folder = {
    src: "./src/",
    build: "./build/",
    rev: "./rev/"
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
        // .pipe(rev())
        .pipe(gulp.dest(folder.build + "css"))
        .pipe(rev.manifest())
        .pipe(gulp.dest(folder.rev + 'css'))

})
// img
gulp.task("img", () => {
    return gulp.src(folder.src + "img/*")
        .pipe(gulp.dest(folder.build + "img"))
})
// js
gulp.task("js", () => {
    return gulp.src(folder.src + "js/index.js")
        .pipe(strip())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglify())
        // .pipe(rev())
        .pipe(gulp.dest(folder.build + "js"))
        .pipe(rev.manifest())
        .pipe(gulp.dest(folder.rev + 'js'))
})

gulp.task('rev', function () {
    return gulp.src(['rev/**/*.json', 'src/html/*.html'])
        .pipe(revCollector({
            replaceReved: true,
            dirReplacements: {
                'css': folder.build + "css",
                'js/': folder.build + "js",
                'cdn/': function (manifest_value) {
                    return '//cdn' + (Math.floor(Math.random() * 9) + 1) + '.' + 'exsample.dot' + '/img/' + manifest_value;
                }
            }
        }))
        .pipe(gulp.dest(folder.build + 'html'));
})


// layui
gulp.task("layui", () => {
    return gulp.src(folder.src + "js/layui/")
        .pipe(gulp.dest(folder.build + "js/layui/"))
})
// gulp.task("default", ["html", "css", "img", "js", "layui"])
gulp.task("default", ["css", "js"])