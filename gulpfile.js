const gulp = require('gulp');
const ts = require('gulp-typescript');
const minifyCSS = require('gulp-csso');
const tsProject = ts.createProject('tsconfig.json');

function transpile() {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest('dist'));
};

function copyPug() {
    return gulp.src('src/views/*.pug')
      .pipe(gulp.dest('dist/views'));
}

function css() {
    return gulp.src('src/public/stylesheets/*.css')
        .pipe(minifyCSS())
        .pipe(gulp.dest('dist/public/stylesheets'))
};

exports.css = css;
exports.copyPug = copyPug;
exports.default = gulp.parallel(transpile, copyPug, css);