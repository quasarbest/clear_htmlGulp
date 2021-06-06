let project_folder = 'dist';
let sourse_folder = '#src';

let path = {
    build: {
        html: project_folder + '/',
        css: project_folder + '/style/',
        js: project_folder + '/js/',
        img: project_folder + '/image/',
        fonts: project_folder + '/fonts/',
        media: project_folder + '/media/',
    },
    src: {
        html: [sourse_folder + '/*.html', '!' + sourse_folder + '/_*.html'],
        css: sourse_folder+ '/style/style.css',
        js: sourse_folder + '/js/script.js',
        img: sourse_folder + '/image/**/*.{jpg,png,svg,giv,ico,webp}',
        fonts: sourse_folder + '/fonts/*.ttf',
        media: sourse_folder + '/media/media.css',
    },
    watch: {
        html: sourse_folder + '/**/*.html',
        css: sourse_folder+ '/style/**/*.sass',
        js: sourse_folder + '/js/**/*.js',
        img: sourse_folder + '/image/**/*.{jpg,png,svg,gif,ico,webp}',
        media: sourse_folder + '/media/**/*.css',
    },
    clean: './' + project_folder + '/'
}

let { src, dest } = require('gulp'),
    gulp = require('gulp'),
    browsersync = require('browser-sync').create(),
    fileinclude = require('gulp-file-include'),
    del = require('del'),
    sass = require('gulp-sass');

    

function browserSync(params) {
    browsersync.init({
        server: {
            baseDir: './' + project_folder + '/'
        },
        port: 3000,
        notify: false
    })
}

function html() {
    return src(path.src.html)
        .pipe(fileinclude())
        .pipe(dest(path.build.html))
        .pipe(browsersync.stream())
}

function css() {
    return src(path.src.css)
        .pipe(
            sass({
               outputStyle: 'expanded' 
            })
        )
        .pipe(dest(path.build.css))
        .pipe(browsersync.stream())  
}

function watchFiles(params) {
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], css);
    
}
function clean(params) {
    return del(path.clean);
}

let build = gulp.series(clean, gulp.parallel(css, html));
let watch = gulp.parallel(build, watchFiles, browserSync);

exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;