const gulp = require('gulp');
const ts = require('gulp-typescript');
const minifyCSS = require('gulp-csso');
const install = require('gulp-install');
const tsProject = ts.createProject('tsconfig.json');


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

function css() {
    return gulp.src('src/public/stylesheets/*.css')
        .pipe(minifyCSS())
        .pipe(gulp.dest(PROD_DEST + '/public/stylesheets'))
};

function copyDependency() {
    return gulp.src(['./package.json'])
        .pipe(gulp.dest(PROD_DEST))
        .pipe(install({
            args: ['--only=production']
        }));
};

function adminLTE_css() { 
    return gulp.src('node_modules/admin-lte/dist/css/**/*.css*')
        .pipe(gulp.dest(PROD_DEST + '/public/css'))
};

function adminLTE_js() { 
    return gulp.src('node_modules/admin-lte/dist/js/adminlte*')
        .pipe(gulp.dest(PROD_DEST + '/public/js')) 
};

function adminLTE_plugins() {
    return gulp.src('node_modules/admin-lte/plugins/**/*')
        .pipe(gulp.dest(PROD_DEST + '/public/plugins'))
};

exports.transpile = transpile;
exports.css = css;
exports.copyHandlebars = copyHandlebars;
exports.copyDependency = copyDependency;
exports.adminLTE_css = adminLTE_css;
exports.adminLTE_js = adminLTE_js;
exports.adminLTE_plugins = adminLTE_plugins;
exports.default = gulp.parallel(transpile, copyHandlebars, css, copyDependency, adminLTE_css, adminLTE_js, adminLTE_plugins);