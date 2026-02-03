# ACTYCREA: Desarrollo Modular para WordPress Multisitio.

Este es el Boilerplate oficial que vamos a utilizar para **todos los proyectos de WordPress Multisitio** que implementemos. Estas son las dependencias a utilizar: 

- [ZURB Foundation](https://foundation.zurb.com/sites/docs/index.html) como framework de interfaz de usuario. 
- [SASS](http://sass-lang.com/documentation/file.SASS_REFERENCE.html) como preprocesador y compilador de CSS para FRONT, LOGIN y ADMIN.
- **WEBPACK** como constructor de dependecias de JavaScript.
- Generador de un SPRITE de iconos automático, que el render viajará a la carpeta `partials` dentro de nuestro tema.
- Distintos tipos de compilación, dependiendo de los entornos. Donde para producción está habilitado lo siguiente:
  - Compresión y minificado de CSS.
  - Compresión y minificado de JS.
  - Compresión de imágenes y SVG.
  - Copia de plantillas SCSS para compilar desde el CMS.

## Instalación de dependencias

Para usar este BoilerPlate necesitas:

- [NodeJS](https://nodejs.org/en/) (0.12 o superior)
- [GIT](https://git-scm.com/)
- [composer](https://getcomposer.org/) cliente para la incluir las librerías dependientes de **PHP** que utilizamos en nuestro proyecto.

Hemos implementado un compilador para realizar esta tarea de forma más sencilla. Ejecutando el siguiente comando:

```bash
make
```

Te aparecerá todas las opciones del compilador. Relatamos una a una.

- Instalar todas las dependencias del proyecto.

```bash
make install
```

- Compilación en desarrollo.

```bash
make watch
```

- Compilación en producción.

```bash
make build
```

- Compilación una vez desarrollado todo el proyecto para su puesta en producción.

```bash
make all
```

## composer.json

Se utiliza para instalar las librerías de **PHP** de terceros que vamos a utilizar. Para ello deberás tener instalado primeramente **composer** en tu maquina. Sigue las instrucciones de instalación en la página de composer. Una vez instalado, deberas cambiar la ruta del directorio VENDOR donde se incluirán las librerias. Deberas entonces EDITAR el fichero **composer.json** y cambiar el valor `config/vendor-dir` por el `PATH` correcto de tu proyecto. Dentro de `require` incorporaremos las librerías a utilizar.

## config.yml

Fichero que tiene toda la configuración de nuestra ejecución en **GULP**. Antes del comienzo de cada proyecto, no esta de más echarle un vistazo.

## htaccess

```bash
# AddType application/vnd.ms-fontobject     .eot
# AddType application/x-font-ttf            .ttf  
# AddType image/svg+xml                     .svg
AddType application/x-font-woff           .woff
AddType application/x-font-woff2          .woff2

# BEGIN WordPress
RewriteEngine On
RewriteBase /
RewriteRule ^index\.php$ - [L]

# add a trailing slash to /wp-admin
RewriteRule ^wp-admin$ wp-admin/ [R=301,L]

RewriteCond %{REQUEST_FILENAME} -f [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]
RewriteRule ^(wp-(content|admin|includes).*) $1 [L]
RewriteRule ^(.*\.php)$ $1 [L]
RewriteRule . index.php [L]
# END WordPress
```

## Framework de maquetación

## Estrutura del Theme

## Utilidades para el desarrollo

Estas son unas cuantas utilidades que serán muy útiles a la hora de desarrollar el proyecto:

- [SASS Meister](https://www.sassmeister.com/) para poder probar distintos códigos de SASS, antes de utilizarlos o incluirlos en tu proyecto. 
- [Transfonter](https://transfonter.org/) generador de fuentes para WEB.
- [Share Link Generator](http://www.sharelinkgenerator.com/) desde aquí puedes generar los LINKS a las RRSS.
- [Spinner Generator](https://loading.io/) generador de Spinner muy chulos. ÇLos puedes descargar en diferentes formatos.
- [RegExp Generator](http://regexr.com/) generador de expresiones regulares.
- [Composer Schema](https://getcomposer.org/doc/04-schema.md0) Esquema de la opciones que tiene composer para su configuración.
