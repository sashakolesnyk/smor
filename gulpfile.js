var gulp 		 = require('gulp'),	 /*подключение модуля, установленного комадной npm install*/
	sass 		 = require('gulp-sass'),
	browserSync  = require('browser-sync'),
	concat		 = require('gulp-concat'),
	uglify		 = require('gulp-uglify'),
	cssnano		 = require('gulp-cssnano'),
	rename		 = require('gulp-rename'),
	del			 = require('del'),
	imagemin	 = require('gulp-imagemin'),
	pngquant	 = require('imagemin-pngquant')
	cache		 = require('gulp-cache')
	autoprefixer = require('gulp-autoprefixer');
	
	
/*npm install -g bower*/ /*Установить глобально бавер - ему нужен гит установлен (у мене стоить)*/
/*Для НАСТРОЙКИ Bower ИСПОЛЬЗУЮ ФАЙЛ .bowerrc в корне проэкта - це типа аксес файла сервера*/
/*в нем настройка - куда будем устанавливать пакеты, скачанные и установленные через бавер*/

/*del - для удаления всего содержимого (очистка папки перед обновлением)
	npm i del --save-dev
*/


/*тепер в консоли пишем bower i jquery magnific-popup*/ /*не нада сейв дев писать, це уже для конкретного сайта*/
/*це установе свежи версии данных библиотек*/

/*
	создание задания (таска) по имени task_name который будет делать то что в ф-и
	чтобы его запустить - в командной консоли пишем gulp task_name +ENTER
*/
gulp.task('task_name', function() {
	/*console.log('Hello, I\'m task');*/
	return gulp.src('source-files') /*src - это взять на обработку - путь к исходным файлам*/
	.pipe() /*pipe - это выхов метода (плагина) для обработки взятых файлов выше*/
	.pipe(gulp.dest('folder')) /*вызов метода dest - он положит обработанные файлы в заданную папку*/
	;
}); /*ВСЕ - ЭТО ОСНОВА 3 ДЕЙСТВИЯ: 1)берем файл, 2)что-то делаем с ним, 3)выводим куда-то результат*/

/*подключение нужных плагинов: npm i gulp-sass --save-dev (--save dev = значит сохранить пакет и версию (записи о них) в нашем файле настроек package.json)*/

gulp.task('sass', function() {
	return gulp.src('app/sass/**/*.sass')  /*взяли файл ДВЕ ЗВЕЗДЫ ОЗНАЧАЮТ ЛЮБУЮ ВЛОЖЕННОСТЬ*/
			   .pipe(sass())			   /*преобразовали его - вызвав подключенный в начале модуль*/
			   .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true}))
			   .pipe(gulp.dest('app/css')) /*указываем ПАПКУ, куда выгрузить обработанный файл (имя оринигала будет)*/
			   .pipe(browserSync.reload({stream: true})) /*через браузер синк при изменении сас/цсс файла подтягнуть его в браузер ДОМ-дерево (релоад-настройка stream позводяет внедрять только изменения, а не всю страницу перезагружать)*/
});




/*СОЗДАНИЕ СЕРВЕРА И АВТО-ОБНОВЛЕНИЕМ ПРИ ИЗМЕНЕНИИ ФАЙЛОВ*/
/*npm install browser-sync --save-dev*/ /*без глобального ключа установка будет только в эту папку-проэкт*/
gulp.task('browser-sync', function() {
	browserSync({ /*вызываем функцию (подключенный модуль) через переменную и задаем ей параметры*/
		server: { /*выбор и настройка сервера*/
			baseDir: 'app'
		},
		notify: false /*отключить инфо-сообщения, шоб не мешали*/
	});
});

/*для формирования единого мин.файла ВСЕХ js библиотек*/
/*gulp-concat соединя вси файлы в один (типа шоб удобно було) === js only*/
/*gulp-uglify МИНИФИЦИРУЕ ФАЙЛ - УДАЛЯ ПРОБЕЛЫ, ПЕРЕНОСЫ И ВСЕ ЛИШНЕ === js only*/
gulp.task('scripts', function() {
	return gulp.src([   /*массив - бо нада выбрать несколько файлов - через кому НО СНАЧАЛА ИХ НАДА БАВЕРОМ УСТАНОВИТЬ, ШОБ БУЛО ШО ПОДКЛЮЧАТЬ*/
		'app/libs/jquery/dist/jquery.min.js',
		'app/libs/magnific-popup/dist/jquery.magnific-popup.min.js'
	])
	.pipe(concat('libs.min.js')) /*тут мы соединаем все эти файлы в 1 c названием libs.min.js*/
	.pipe(uglify()) /*сжимаем - убираем пробелы и все лишнее = минификация файла*/
	.pipe(gulp.dest('app/js'));
});

/*ДЛЯ МИНИФИКАЦИИ CSS И ПЕРЕИМЕНОВАНИЯ ВЫХОДНОГО ФАЙЛА*/
/*npm i gulp-cssnano gulp-rename --save-dev*/
gulp.task('css-libs', ['sass'], function() { /*ПЕРЕД ЭТИМ ТАСКОМ НУЖНО ЗАПУСТИТЬ ТАСК "САСС"*/
	//return gulp.src('app/css/libs.css') /*выбираем файл, который будем сжимать*/
	//.pipe(cssnano()) /*сжимает файл - минифицирует*/
	//.pipe(rename({suffix: '.min'})) /*переименовать файл и добавить суффикс min*/
	//.pipe(gulp.dest('app/css'));
	return gulp.src('app/libs/magnific-popup/dist/magnific-popup.css')
	.pipe(cssnano())
	.pipe(rename({basename: "libs.min", extname: ".css"}))
	.pipe(gulp.dest("app/css"));
	
});

/*ОЧИСТКА ПАПКИ DIST - вызывается в таске билд*/
gulp.task('clean', function() {
	return del.sync('dist'); /*удаля папку дист*/
});

/*!!!!!!!! ВРУЧНУ ОБЯЗЯТЕЛЬНО ПОСЛЕ КАЖДОЙ РАБОТЫ С КАРТИНКАМИ - ОЧИСТКА кеша - работы с картинками (НАДА ВРУЧНУ ЗАПУСКАТЬ)*/
gulp.task('clear', function() {
	return cache.clearAll();
});



/*ОБРАБОТКА ИЗОБРАЖЕНИЙ - ОПТИМИЗАЦИЯ*/ /* - вызываем в билде, только при выгрузке в продакшен 1 раз*/
gulp.task('img', function() {
	return gulp.src('app/img/**/*')
	.pipe(cache(imagemin({
		interlaced: true,
		progressive: true,
		svgoPlugins: [{removeViewBox: false}],
		use: [pngquant()]
	})))
	.pipe(gulp.dest('dist/img'));
});




/*СЛЕДИТ ЗА ИЗМЕНЕНИЕМ ФАЙЛА(-ОВ) == В САМИЙ КОНЕЦ - ЭТО ФИНАЛЬНАЯ ФУНКЦИЯ*/
/*нада запустить browser-sync перед вызовом watch, шоб було подключено и работало
ЦЕ РОБИТЬСЯ В МАССИВЕ НАСТРОЕК - 2-ий аргумент,  там массивом указани таски, яки нада запустить перед watch-ом
*/
/*ТУТ ОТДЕЛЬНО ТАСК "САСС" УБРАЛИ И ПЕРЕНЕСЛИ ЕГО В "ЦСС-ЛИБС"*/
gulp.task('watch', ['browser-sync', 'css-libs', 'scripts'], function() {
	gulp.watch('app/sass/**/*.sass', ['sass']); /*1-ЫЙ АРГУМЕНТ выбираем файл-ы, за которыми будем следить
												*2-ОЙ АГРУМЕНТ массив заданий (таксов), которые нужно сделать
												 *при изменении файла-(ов)*/
	gulp.watch('app/*.html', browserSync.reload); /*следить за изменением всех файлов хтмл в папке арр + 2-ой аргумент функция перезагрузки страницы*/
	gulp.watch('app/js/**/*.js', browserSync.reload);
});

/*ВЫГРУЗКА ПРОЕКТА В ПАПКУ dist*/
gulp.task('build', ['clean', 'img', 'sass', 'scripts'], function() {
	
	/*СТИЛИ*/
	var buildCss = gulp.src([  /*выбираем все цсс файлы в переменную для удобства, яки будем переносить*/
		'app/css/main.css',
		'app/css/libs.min.css',
	])
	.pipe(gulp.dest('dist/css')); /*куда переносим (копируем)*/
	
	/*ШРИФТЫ*/
	var buildFonts = gulp.src('app/fonts/**/*') /*выбрать все, что в папке фонтс*/
	.pipe(gulp.dest('dist/fonts'));
	
	/*JavaScript*/
	var buildJs = gulp.src('app/js/**/*')
	.pipe(gulp.dest('dist/js'));
	
	/*HTML*/
	var buildHtml = gulp.src('app/*.html')
	.pipe(gulp.dest('dist'));
	
});




