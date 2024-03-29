
let project_folder = require('path').basename(__dirname);
let sourse_folder = '#src';

let path = {
    build: {
        html: project_folder + '/',
        css: project_folder + '/style/',
        js: project_folder + '/js/',
        img: project_folder + '/image/',
        fonts: project_folder + '/fonts/',
        media: project_folder + '/media/',
        libs: project_folder + '/librarys/',
    },
    src: {
        html: [sourse_folder + '/*.html', '!' + sourse_folder + '/_*.html'],
        css: sourse_folder+ '/sass/*.sass',
        js: sourse_folder + '/js/*.js',
        img: sourse_folder + '/image/**/*.{jpg,png,svg,giv,ico,webp}',
        fonts: sourse_folder + '/fonts/**/*.ttf',
        media: sourse_folder + '/media/media.css',
        libs: sourse_folder + '/librarys/**/.',
    },
    watch: {
        html: sourse_folder + '/**/*.html',
        css: sourse_folder + '/sass/*.sass',
        js: sourse_folder + '/js/**/*.js',
        img: sourse_folder + '/image/**/*.{jpg,png,svg,gif,ico,webp}',
        media: sourse_folder + '/media/**/*.css',
        fonts: sourse_folder + '/fonts/**/*.ttf',
        libs: sourse_folder + '/librarys/**/*',
    },
    clean: './' + project_folder + '/'
}

let { src, dest } = require('gulp'),
    gulp = require('gulp'),
    browsersync = require('browser-sync').create(),
    fileinclude = require('gulp-file-include'),
    del = require('del'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    group_media = require('gulp-group-css-media-queries'),
    clean_css = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify-es').default,
    imagemin = require('gulp-imagemin'),
    webp = require('gulp-webp'),
    webphtml = require('gulp-webp-html'),
    webpcss = require('gulp-webpcss'),
    ttf2woff = require('gulp-ttf2woff'),
    ttf2woff2 = require('gulp-ttf2woff2'),
    fonter = require('gulp-fonter');

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
        .pipe(webphtml())
        .pipe(dest(path.build.html))
        .pipe(browsersync.stream())
}
function media() {
    return src(path.src.media)
        .pipe(fileinclude())
        .pipe(dest(path.build.media))
        .pipe(browsersync.stream())
}
function fonts() {
    return src(path.src.fonts)
        .pipe(fileinclude())
        .pipe(dest(path.build.fonts))
        .pipe(browsersync.stream())
}
function libs() {
    return src(path.src.libs)
        .pipe(fileinclude())
        .pipe(dest(path.build.libs))
        .pipe(browsersync.stream())
}
function images() {
    return src(path.src.img)
        .pipe(
            webp({
                quality: 60 // 0 to 100 - качество изображения
            })
    )
        .pipe(dest(path.build.img))
        .pipe(src(path.src.img))
        .pipe(
            imagemin({
                progressive: true,
                svgoPlugins: [{ removeViewBox: false }],
                interlaced: true,
                optimizationLevel: 3 //0 to 7
           }) 
        )
        .pipe(dest(path.build.img))
        .pipe(browsersync.stream())
}

function fonts() {
    src(path.src.fonts)
        .pipe(ttf2woff())
        .pipe(dest(path.build.fonts));
    return src(path.src.fonts)
        .pipe(ttf2woff2())
        .pipe(dest(path.build.fonts));
};

function css() {
    return src(path.src.css)
        .pipe(
            sass({
            outputStyle: 'expanded' 
            })
    )
        .pipe(
            group_media()
        )
        .pipe(
            autoprefixer({
                overrideBrowserslist: ['last 5 versions'],
                cascade: true
            })
    )
        .pipe(webpcss())
        .pipe(dest(path.build.css))
        .pipe(clean_css())
        .pipe(
            rename({
                extname: '.min.css'
            })
        )
        .pipe(dest(path.build.css))
        .pipe(browsersync.stream())  
}

function js() {
    return src(path.src.js)
        .pipe(fileinclude())
        .pipe(dest(path.build.js))
        .pipe(
            uglify()
        )
            .pipe(
            rename({
                extname: '.min.js'
            })
    )
        .pipe(dest(path.build.js))
        .pipe(browsersync.stream())
}

gulp.task('otf2ttf', function () {
    return src([sourse_folder + '/fonts/**/*.otf'])
        .pipe(fonter({
            formats: ['ttf']
        }))
        .pipe(dest(sourse_folder + '/fonts/'));
})

function watchFiles(params) {
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], css);
    gulp.watch([path.watch.js], js);
    gulp.watch([path.watch.media], media);
    gulp.watch([path.watch.fonts], fonts);
    gulp.watch([path.watch.libs], libs);
    gulp.watch([path.watch.img], images);
}
function clean(params) {
    return del(path.clean);
}

let build = gulp.series(clean, gulp.parallel(images, libs, fonts, media, js, css, html, images));
let watch = gulp.parallel(build, watchFiles, browserSync);

exports.fonts = fonts;
exports.images = images;
exports.libs = libs;
exports.media = media;
exports.fonts = fonts;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;
