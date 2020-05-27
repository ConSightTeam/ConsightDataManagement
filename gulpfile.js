const gulp = require('gulp');
const ts = require('gulp-typescript');
const minifyCSS = require('gulp-csso');
const install = require('gulp-install');
const tsProject = ts.createProject('tsconfig.json');
const imagemin = require('gulp-imagemin');

const PROD_DEST = 'dist';

function transpile() {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest(PROD_DEST));
};

function copyHandlebars() {
    return gulp.src('src/views/**/*.handlebars')
        .pipe(gulp.dest(PROD_DEST + '/views'));
}

function copyImages() {
    return gulp.src('src/public/images/*.*')
        .pipe(imagemin({imagemin}))
        .pipe(gulp.dest(PROD_DEST + '/public/images'));
}

function copyCSS() {
    return gulp.src('src/public/stylesheets/*.css')
        .pipe(minifyCSS())
        .pipe(gulp.dest(PROD_DEST + '/public/stylesheets'))
};

function copyFavicon() {
    return gulp.src(['src/public/images/favicon.ico'])
          .pipe(gulp.dest(PROD_DEST + '/public'));
};

function copyDependency() {
    return gulp.src(['./package.json'])
        .pipe(gulp.dest(PROD_DEST))
        .pipe(install({
            args: ['--only=production']
        }));
};

function copyCSS2() { 
    return gulp.src('node_modules/admin-lte/dist/css/**/*.css*')
        .pipe(gulp.dest(PROD_DEST + '/public/css'))
};

function copyJavascript() { 
    return gulp.src('node_modules/admin-lte/dist/js/adminlte*')
        .pipe(gulp.dest(PROD_DEST + '/public/js')) 
};

function copyPlugins() {
    return gulp.src(['node_modules/admin-lte/plugins/**/*', '!node_modules/admin-lte/plugins/**/package.json'])
        .pipe(gulp.dest(PROD_DEST + '/public/plugins'))
};

exports.transpile = transpile;
exports.copyCSS = copyCSS;
exports.copyImages = copyImages;
exports.copyFavicon = copyFavicon;
exports.copyHandlebars = copyHandlebars;
exports.copyDependency = copyDependency;
exports.copyCSS2 = copyCSS2;
exports.copyJavascript = copyJavascript;
exports.copyPlugins = copyPlugins;
exports.default = gulp.parallel(transpile, copyHandlebars, copyCSS, copyImages, copyFavicon, copyDependency, copyCSS2, copyJavascript, copyPlugins);