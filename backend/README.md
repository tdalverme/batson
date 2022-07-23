# Backend
La configuración del entorno se selecciona de acuerdo a una variable de entorno ```BATSON_ENV```, por lo tanto para que les funcione tienen que crear la variable de entorno con nombre ```BATSON_ENV``` y valor ```dev```.
Para hacer pruebas localmente ejecutar el script ```app.py```.

## Heroku
En la carpeta ```backend``` se encuentra el archivo Dockerfile que se usa para el deploy al server. En caso de hacer algún cambio en el back y querer hacer el deploy en Heroku:
1. Pararse en la carpeta ```backend``` (```cd ./backend```)
2. Si no se loguearon nunca a heroku, ejecutar el comando ```heroku login```. Les abre el navegador, se loguean y lo pueden cerrar.
3. Ejecutar el comando ```heroku container:push web --app batson-webapp```
4. Ejecutar el comando ```heroku container:release web --app batson-webapp```

Algunos comando útiles de Heroku:
- ```heroku logs --app batson-webapp```
- ```heroku restart --app batson-webapp```
