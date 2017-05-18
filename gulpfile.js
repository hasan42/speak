//npm i gulp --save-dev
//npm i --save-dev gulp-less browser-sync gulp-concat gulp-uglify gulp-cssnano gulp-rename del gulp-imagemin imagemin-pngquant gulp-cache gulp-autoprefixer gulp-stylelint

var gulp = require('gulp'), // Подключаем Gulp
    pug = require('gulp-pug'), //Подключаем pug пакет,
    less = require('gulp-less'), //Подключаем Less пакет,
    browserSync = require('browser-sync'), // Подключаем Browser Sync
    concat = require('gulp-concat'), // Подключаем gulp-concat (для конкатенации файлов)
    uglify = require('gulp-uglify'), // Подключаем gulp-uglifyjs (для сжатия JS)
    cssnano = require('gulp-cssnano'), // Подключаем пакет для минификации CSS
    rename  = require('gulp-rename'), // Подключаем библиотеку для переименования файлов
    del = require('del'), // Подключаем библиотеку для удаления файлов и папок
    imagemin = require('gulp-imagemin'), // Подключаем библиотеку для работы с изображениями
    pngquant = require('imagemin-pngquant'), // Подключаем библиотеку для работы с png
    cache = require('gulp-cache'), // Подключаем библиотеку кеширования
    cache = require('gulp-cache'), // Подключаем библиотеку кеширования;
    autoprefixer = require('gulp-autoprefixer'); // Подключаем библиотеку для автоматического добавления префиксов

gulp.task('pug', function(){ // Создаем таск "pug"
    return gulp.src('www/views/**/*.pug') // Берем источник
        .pipe(pug()) // Преобразуем pug в html посредством gulp-pug
        .pipe(gulp.dest('www/')) // Выгружаем результата в папку www
        .pipe(browserSync.reload({stream: true})) // Обновляем html на странице при изменении
});

gulp.task('less', function(){ // Создаем таск "less"
    return gulp.src('www/less/**/*.less') // Берем источник
        .pipe(less()) // Преобразуем less в CSS посредством gulp-less
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) // Создаем префиксы
        .pipe(gulp.dest('www/css')) // Выгружаем результата в папку www/css
        .pipe(browserSync.reload({stream: true})) // Обновляем CSS на странице при изменении
});

gulp.task('scripts', function() {
    return gulp.src([ // Берем все необходимые библиотеки
        'www/js/jquery.min.js' // Берем jQuery
        ])
        .pipe(concat('libs.min.js')) // Собираем их в кучу в новом файле libs.min.js
        .pipe(uglify()) // Сжимаем JS файл
        .pipe(gulp.dest('www/js')); // Выгружаем в папку app/js
});

gulp.task('css-libs', ['less'], function() {
    return gulp.src('www/css/libs.css') // Выбираем файл для минификации
        .pipe(cssnano()) // Сжимаем
        .pipe(rename({suffix: '.min'})) // Добавляем суффикс .min
        .pipe(gulp.dest('www/css')); // Выгружаем в папку www/css
});

gulp.task('browser-sync', function() { // Создаем таск browser-sync
    browserSync({ // Выполняем browser Sync
        server: { // Определяем параметры сервера
            baseDir: 'www' // Директория для сервера - app
        },
        notify: false // Отключаем уведомления
    });
});

gulp.task('watch', ['browser-sync', 'css-libs', 'scripts'], function() {
    gulp.watch('www/less/**/*.less', ['less']); // Наблюдение за less файлами
    gulp.watch('www/views/**/*.pug', ['pug']); // Наблюдение за less файлами
    gulp.watch('www/*.html', browserSync.reload); // Наблюдение за HTML файлами в корне проекта
    gulp.watch('www/js/**/*.js', browserSync.reload); // Наблюдение за JS файлами в папке js
    // Наблюдение за другими типами файлов
});

gulp.task('clean', function() {
    return del.sync('dist'); // Удаляем папку dist перед сборкой
});

gulp.task('img', function() {
    return gulp.src('www/images/**/*') // Берем все изображения из app
        .pipe(cache(imagemin({  // Сжимаем их с наилучшими настройками с учетом кеширования
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('dist/images')); // Выгружаем на продакшен
});

gulp.task('build', ['clean', 'img', 'pug', 'less', 'scripts'], function() {

    var buildCss = gulp.src('www/css/**/*')// Переносим библиотеки в продакшен
    .pipe(gulp.dest('dist/css'))

    var buildFonts = gulp.src('www/fonts/**/*') // Переносим шрифты в продакшен
    .pipe(gulp.dest('dist/fonts'))

    var buildJs = gulp.src('www/js/**/*') // Переносим скрипты в продакшен
    .pipe(gulp.dest('dist/js'))

    var buildHtml = gulp.src('www/*.html') // Переносим HTML в продакшен
    .pipe(gulp.dest('dist'));

});

gulp.task('clear', function () {
    return cache.clearAll();
})

gulp.task('default', ['watch']);