var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');

var paths = {
    sass: ['./scss/**/*.scss']
};

var bower_components = ['./bower_components/leaflet.markercluster/dist/leaflet.markercluster.js',
    './bower_components/leaflet-pip/leaflet-pip.min.js',
    './bower_components/angular-material/angular-material.min.css',
    './bower_components/leaflet.markercluster/dist/MarkerCluster.Default.css',
    './bower_components/leaflet.markercluster/dist/MarkerCluster.css',
    './bower_components/ionic/js/ionic.bundle.js',
    './bower_components/ionic/scss/**/*',
    './bower_components/ionic/fonts/*',
    './bower_components/mdi/scss/*',
    './bower_components/mdi/fonts/*',
    './bower_components/leaflet.markercluster/dist/leaflet.markercluster.js',
    './bower_components/leaflet-pip/leaflet-pip.min.js',
    './bower_components/angular-resource/angular-resource.min.js',
    './bower_components/angulartics/dist/angulartics.min.js',
    './bower_components/angulartics/dist/angulartics-piwik.min.js',
    './bower_components/angular-aria/angular-aria.min.js',
    './bower_components/angular-messages/angular-messages.min.js',
    './bower_components/angular-material/angular-material.js',
    './bower_components/ngCordova/dist/ng-cordova.min.js'
];

gulp.task('default', ['move', 'sass']);

gulp.task('move', function (done) {
    gulp.src(bower_components, {base: './'})
        .pipe(gulp.dest('www/lib'))
        .on('end', done);
});

gulp.task('sass', ['move'], function (done) {
    gulp.src('./scss/ionic.app.scss')
        .pipe(sass())
        .pipe(gulp.dest('./www/css/'))
        .pipe(minifyCss({
            keepSpecialComments: 0
        }))
        .pipe(rename({extname: '.min.css'}))
        .pipe(gulp.dest('./www/css/'))
        .on('end', done);
});

gulp.task('watch', function () {
    gulp.watch(paths.sass, ['sass']);
});

gulp.task('install', ['git-check'], function () {
    return bower.commands.install()
        .on('log', function (data) {
            gutil.log('bower', gutil.colors.cyan(data.id), data.message);
        });
});

gulp.task('git-check', function (done) {
    if (!sh.which('git')) {
        console.log(
            '  ' + gutil.colors.red('Git is not installed.'),
            '\n  Git, the version control system, is required to download Ionic.',
            '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
            '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
        );
        process.exit(1);
    }
    done();
});

gulp.task('ngdocs', [], function () {
    var gulpDocs = require('gulp-ngdocs');

    var options = {
        scripts: [
            'http://ajax.googleapis.com/ajax/libs/angularjs/1.5.8/angular.min.js',
            'http://ajax.googleapis.com/ajax/libs/angularjs/1.5.8/angular-animate.min.js'
        ]
    };

    return gulp.src('www/js/**/*.js')
        .pipe(gulpDocs.process(options))
        .pipe(gulp.dest('./docs'));
});
gulp.task('connect_ngdocs', function() {
    var connect = require('gulp-connect');
    connect.server({
        root: 'docs',
        livereload: false,
        fallback: 'docs/index.html',
        port: 8083
    });
});