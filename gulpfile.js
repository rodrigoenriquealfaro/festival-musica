const { src, dest, watch, parallel } = require("gulp")
const sass = require("gulp-sass")(require('sass'))
const plumber = require('gulp-plumber')
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')
const postcss = require('gulp-postcss')
const sourcemaps = require('gulp-sourcemaps')
const cache = require('gulp-cache')
const imagemin = require('gulp-imagemin')
const webp = require('gulp-webp')
const avif = require('gulp-avif')
const terser = require('gulp-terser-js')

const css = (done) => {
    src('src/scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(plumber())
        .pipe(sass())
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('build/css'))

    done()
}

const imagenes = (done) => {
    const opciones = {
        optimizationLevel: 3
    }
    src('src/img/**/*.{png,jpg}')
        .pipe(cache(imagemin(opciones)))
        .pipe(dest('build/img'))

    done()
}

const versionWebp = (done) => {
    const opciones = {
        quality: 50
    }

    src('src/img/**/*.{png,jpg}')
        .pipe(webp(opciones))
        .pipe(dest('build/img'))

    done()
}

const versionAvif = (done) => {
    const opciones = {
        quality: 50
    }

    src('src/img/**/*.{png,jpg}')
        .pipe(avif(opciones))
        .pipe(dest('build/img'))

    done()
}

const javascript = (done) => {
    src('src/js/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(terser())
        .pipe(sourcemaps.write('.'))
        .pipe(dest('build/js'))

    done()
}

const dev = (done) => {
    watch('src/scss/**/*.scss', css)
    watch('src/js/**/*.js', javascript)

    done()
}

exports.css = css
exports.javascript = javascript
exports.imagenes = imagenes
exports.versionWebp = versionWebp
exports.versionAvif = versionAvif
exports.dev = parallel(imagenes, versionWebp, versionAvif, javascript, dev)