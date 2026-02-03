'use strict';

import plugins       from 'gulp-load-plugins';
import yargs         from 'yargs';
import gulp          from 'gulp';
import del           from 'del';
import yaml          from 'js-yaml';
import fs            from 'fs';
import webpackStream from 'webpack-stream';
import webpack2      from 'webpack';
import named         from 'vinyl-named';
import path          from 'path';
import webp          from 'gulp-webp';
import header        from 'gulp-header';
import debug         from 'gulp-debug';
import flatmap       from 'gulp-flatmap';
import rename        from 'gulp-rename';

import sass          from 'gulp-sass';
import dartSass      from 'sass';

// Carga todos los plugins de GULP en una variable
const $ = plugins();

const sassCompiler = sass(dartSass); 

function loadConfig() {
  let ymlFile = fs.readFileSync('config.yml', 'utf8');
  return yaml.load(ymlFile);
}

// Cargar configuraciones desde config.yml
const { COMPATIBILITY, PORT, UNCSS_OPTIONS, PATHS } = loadConfig();

// Busca el indicardor --production para saber si estamos en desarrollo o en producción
const PRODUCTION  = !!( yargs.argv.production );

// Si existe la carpeta del THEME de wordpress
const THEME       = fs.existsSync( PATHS.theme ) ? PATHS.theme : null;

// Tarea para la ejecución a producción
gulp.task( 'build' , gulp.series( clean , gulp.parallel( icons , iconsCustom , sasssync , javascript, imagesGIFSVG , imagesJPGPNG , copy ) ) );

// Tarea por defecto para la ejecución en desarrollo
gulp.task( 'default' , gulp.series( gulp.parallel( icons , iconsCustom , sasssync , javascript, imagesGIFSVG , imagesJPGPNG , copy ) , watch ) );

// Tarea para la ejecución a producción (solo CSS)
gulp.task( 'css' , gulp.series( gulp.parallel( sasssync ) ) );

// Tarea para la ejecución a producción (solo JS)
gulp.task( 'js' , gulp.series( gulp.parallel( javascript ) ) );

// Tarea para la ejecución a producción (solo CSS y JS)
gulp.task( 'jscss' , gulp.series( gulp.parallel( sasssync , javascript ) ) );

// Tarea para la ejecución a producción (solo images)
gulp.task( 'images' , gulp.series( gulp.parallel( imagesGIFSVG , imagesJPGPNG ) ) );

// Tarea para la ejecución de los iconos custom
gulp.task( 'iconsc' , gulp.series( gulp.parallel( iconsCustom ) ) );

// [OK] Limpia las carpetas de producción antes de la ejecución evitando posible caché
function clean( done ) {
  return del( PATHS.clean , { force : true } );
}

// [OK] Copia los archivos seleccionados en el GLOBAL del YAML en su directorio correspondiente
function copy() {
  var keys = Object.keys( PATHS.global );
  var response = [];
  keys.forEach( function ( index ) {
    response = gulp.src( PATHS.global[index] )
      .pipe( gulp.dest( THEME + '/' + ( index !== 'assets' ? 'assets/' : '' ) + index ) );
  });
  return response;
}

// [OK] Compila SASS en CSS
function sasssync() {
  return gulp.src( PATHS.sass.archives )
    .pipe( debug({ title: 'SASS:' }) )
    .pipe( $.sourcemaps.init() )
    .pipe(flatmap(function(stream, file){
      var show = file.dirname.split( '/' );
      return stream
            // .pipe( header('$show: "' + show.slice(-1).pop() + '";\n') )
            .pipe( sassCompiler({includePaths: PATHS.sass.includes }).on( 'error' , sassCompiler.logError ) );
    }))
    .pipe( $.autoprefixer( {
      browsers: COMPATIBILITY
    } ) )
    .pipe( $.if( PRODUCTION , $.cleanCss( { compatibility : 'ie9' } ) ) )
    .pipe( $.if( !PRODUCTION , $.sourcemaps.write() ) )
    .pipe( gulp.dest( THEME + '/assets/css' ) );
}

let webpackConfig = {
  externals: {
    jquery: 'jQuery'
  },
  mode: !PRODUCTION ? 'development' : 'production',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
          }
        ],
      },
      {
        test: /\.js$/,
        include: /node_modules\/chart\.js/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              '@babel/plugin-proposal-class-properties',
              '@babel/plugin-proposal-private-methods'
            ]
          }
        }
      }
    ]
  }
}

// [OK] Combina JavaScript en un solo archivo
function javascript() {
  return gulp.src( PATHS.js.archives )
    .pipe( named( ) )
    .pipe( $.sourcemaps.init() )
    .pipe( webpackStream( webpackConfig , webpack2 ) )
    .pipe( $.if( PRODUCTION , $.uglify( {
      compress: {
        drop_console: true
      }
    } ).on( 'error' , e => { console.log( e ); } )
    ) )
    .pipe( $.if( !PRODUCTION , $.sourcemaps.write() ) )
    .pipe( gulp.dest( THEME + '/assets/js' ) );
}

// [OK] Copia y minimiza las imágenes GIF y SVG 
function imagesGIFSVG() {
  return gulp.src( PATHS.images.archives )
  .pipe( $.if( PRODUCTION , $.imagemin([
    $.imagemin.svgo({
      plugins: [
        { removeViewBox: false },
        { removeDimensions: true },
        { removeUselessStrokeAndFill: true },
        { cleanupIDs: false },
        { removeEmptyAttrs: true },
     ]
   }),
   $.imagemin.gifsicle({interlaced:true}) ,
   $.imagemin.jpegtran({progressive:true}),
   $.imagemin.optipng({optimizationLevel:5})
  ])))
  .pipe( gulp.dest( THEME + '/assets/images' ) );
}

// [OK] Copia y minimiza las imágenes GIF y SVG 
function imagesJPGPNG() {
  return gulp.src( PATHS.images.webp )
  .pipe( webp( ) )
  .pipe( gulp.dest( THEME + '/assets/images' ) );
}

// [OK] Genera el archivo de iconos
function icons(){
  return gulp
    .src( PATHS.icons.file )
    .pipe($.svgstore({inlineSvg:true}))
    .pipe($.cheerio({
      run: function ($) {
        $('svg').attr('style','width:0;height:0;display:none!important;');
        var symbol = $('svg > symbol > symbol').clone();
        $('svg > symbol > symbol').remove();
        symbol.each( function( index ){
          var id = $( this ).attr( 'id' );
          var regex = new RegExp('(chevron-down|chevron-up|chevron-left|chevron-right|bag|facebook|instagram|pinterest|youtube|whatsapp|twitter-x|tiktok|spotify)');
          // console.log( 'id => ' , id , regex.test( id ) );
          if( regex.test( id ) ){
            $( this ).appendTo( $('svg > symbol') );
          }
        });
      },
      parserOptions: { xmlMode: true }
    }))
    .pipe( rename( function( path ){
      path.basename = "icons";
      path.extname  = ".svg";
    }) )
    .pipe( gulp.dest( THEME + '/assets/' + PATHS.icons.render ) );
}

// [OK] Genera el archivo de iconos customizados
function iconsCustom(){
  return gulp
    .src( PATHS.icons.archives )
    .pipe($.if(PRODUCTION,$.svgmin(function (file) {
      var prefix = path.basename(file.relative, path.extname(file.relative));
      return {
        plugins: [
          { removeTitle: true },
          { removeDimensions: true },
          { removeUselessStrokeAndFill: true },
          { removeEmptyAttrs: true },
          { removeAttrs: { attrs: [ 'clip-rule' , 'fill-rule' , 'data-name' ] } },
          { cleanupIDs: { prefix: prefix + '-' , minify: true } }
        ]
      }
    })))
    .pipe($.svgstore({inlineSvg:true}))
    .pipe($.cheerio({
      run: function ($) {
        $('svg').attr('style','width:0;height:0;display:none!important;');
        $('svg > symbol').map(function(){
          var $this = $( this );
          $this.attr( 'class' , PATHS.icons.prefix + ' ' + PATHS.icons.prefix + '-' + $this.attr( 'id' ) );
          // $this.attr( 'viewBox' , '0 0 16 16' );
        });
      },
      parserOptions: { xmlMode: true }
    }))
    .pipe( rename( function( path ){
      path.basename = "icons-custom";
      path.extname  = ".svg";
    }) )
    .pipe( gulp.dest( THEME + '/assets/' + PATHS.icons.render ) );
}

// [OK] Ver los cambios en los elementos estáticos, las páginas, Sass, Iconos y JavaScript
function watch() {
  var keys = Object.keys( PATHS.global );
  var response = [];
  keys.forEach( function ( index ) {
    response = response.concat( PATHS.global[index] );
  });
  gulp.watch( response ).on( 'all' , gulp.series( copy ) );
  gulp.watch( PATHS.js.watcher ).on('all', gulp.series( javascript ) );
  gulp.watch( PATHS.images.archives ).on('all', gulp.series( imagesGIFSVG ) );
  gulp.watch( PATHS.images.webp ).on('all', gulp.series( imagesJPGPNG ) );
  gulp.watch( PATHS.sass.watcher ).on('all', gulp.series( sasssync ) );
  gulp.watch( PATHS.icons.watcher ).on('all', gulp.series( iconsCustom ) );
}
