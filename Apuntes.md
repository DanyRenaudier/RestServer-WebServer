# Notas de la seccion 07-RestServer

1. Se creo el servidor con express de la forma tradicional. Se crean las rutas como habiatualmente se hace y lo que en realidad lo distingue de un uso standar de express fue que se crea un cascaron en la carpeta "models", donde se tiene el objeto server, desde donde posteriormente se haran las instancias de nuevos servidores. 

2. Se importó en el archivo de la app (aquel que funcionará como main de la app), el objeto servidor y se crea una nueva instacia del server. Finalmente para que funcione, se ejecuta la funcion .listen() la cual hace el app.listen(port,callback) y lanza el servidor.

3. Dentro del constructor del server podemos ver los middlewares que estará usando el servidor (googlear cors), y el middleware para servir archivos estaticos desde la carpeta publica. Esto es para servir archivos provenientes del front-end.

4. Escaló la cantidad de protocolos por ruta. Es decir, habian muchas requicisiones para una unica ruta. En este caso para la ruta '/api/usuarios' tenia muchas manejos de requests (un get, post, put, patch, delete). Por lo que se uso un middleware condicional. Este middleware condicional=> 

    'this.app.use('/api/usuarios', require('../routes/usuarios'));' 

Es condicional por que unicamente funciona para el path especificado como primer parametro cuando se hagan requests en ese path (no es que va a funcionar permanentemente el middleware), y se identifica como middleware por el ".use". Lo que hace es que para la URL declarada como primer parametro, se le indica en el segundo parametro de donde va a sacar los response de los http requests. Depende el http request que llegue, si existe se declaro el response para el tipo de request. Arroja respuest; Por ej . para el request ".get", existe la ruta definida con un respondes pero no es el caso para un response del tipo ".copy". Realizar un http request de este tipo en postman para el url "http://localhost:8080/api/usuarios" o cualquier url del localhost:8080. El response arrojaria una respuesta de error con status 404 por que no se encuentra un response definido.

Por ultimo, tener en cuenta las anotaciones que se hicieron en usuarios.js de la carpeta "routes" y "controllers";

5. Se pusieron los controladores de cada http request en un archivo aparte para despues exportarlos (usuarios.js desde controllers) e importarlos (usuarios.js rooutes) para que quedara mas limpio el codigo del archivo donde se importan despues las funciones.

6. La lectura y parseo que se usa como middleware es para trer la informacion que llevan consigo los http request del tipo, post, put, delete, etc. Es decir, informacion con la que se va a trabajar y se necesita procesar.

7. El request que se hace en las requisiciones http, se parsea a formato json con el middleware del pto 6. De otra forma solo da undefined cuando se intenta obtener el body del require.

8. Para solicitar los parametros que vienen en la URL. se ultiliza el request y se extraen los parametros de ese request. No depende de ningun middleware, ya es configuracion por defecto de Express, por lo tanto req.params retorna los parametros del URL de forma independiente a las configuraciones del servidor.

9. Para solicitar las adicionales QUE vienen en el URL, de la misma forma que vienen los parametros, se pueden consultar esos valores de las consultas. Es decir desde el request. Por lo dicho anteriormente seria de la sig forma => const {los parametros desestructurados del query para tomar unicamente lo que se necesita}= req.query;

Si no se definen los parametros enviados por medio de la URL, se les puede asignar un valor por defecto al desestructurar el obejeto de la sig forma {nombre="Daniel"}=req.query. No solo en los query funciona la destructuracion, en el .body y en el .params tambien.


#########################################


Explicacion adicional de este caso:

* En el get request se tomaron los parametros que vienen desde el url.

* En el post request se tomaron los datos que vienen en el body del request. 

* En el put request se tomaron los datos del url que hacen referencia a rutas especificas forzadas en los routes. Es decir, no funcionaria el request si no se definieran estos path dentro del url. 
    Estas "extensiones" del url original (tener en cuenta que el url original es el que se definio como middleware condicional, en este caso como /api/usuarios), son paths especificos y para que funcionen los response de los requests .get y
    .post que ya estan definidos ahora pero que no funcionan por que el path varía, hay que hacer algo como lo siguiente en routes/usuarios.js:


    router.get('/:id', usuariosGet);


Asi se llama como response a usuariosGet; en la ruta especifica enviada como primer parametro. En cualquier otra ruta que no haya sido definida, el http .get no va a servir (asi como ningun otro) .



#########################################
#           Seccion 9
#########################################

* Se creo la coneccion con la base de datos en 07-RestServer\database\config.js y se exporto la funcion para que pudiera crearse una coneccion por instancia de servidor

* se utilizo una funcion async para esperar a la coneccion con la base de datos sin que arroje un error por la demora que pudiera generar la coneccion.

* se realiza la importacion al modelo de servidor y se importa la coneccion de a la base de datos dentro de un metodo del objeto servidor. Precisamente en el metodo conectarDB();
Este metodo taambien es asincrono por que depende de la funcion dbConnection() que da una respuesta asincrona.

* Al crear el archivo usuario.js se crea un modelo en la base de datos del cual posteriormente habra una coleccion. Esto quiere decir que se crea un cascaron de usuario de la cual posteriormente habran varios almacenados en la base de datos y por ello es que se llama "coleccion", en este caso coleccion de usuarios (supongo que es como se llama a las clases <<objetos>> en las DB).

* Se crea una nueva instancia del usuario en la que se pasa como paremetro todo el body y mongoose se encarga de solamente tomar los campos requeridos ya definidos en el objeto. Es decir nombre, password, etc... El resto de cosas no definidas en el Schema las ignora. 

Posteriormente y para que quede mas prolijo, se desestructura el body del request y se toman solamente las variables deseadas para pasarlas como paramentros cuando se crea la nueva instancia de la colleccion de usuarios.

* Se instala el paquete bcrypt para hacer el hash unidireccional del password. Es decir se encripta sin posibilidad de poder desencriptarlo y se guarda en la DB


###################  BCRYPT USE  #####################

* La variable salt tiene la cantidad de vueltas en que se encripta el password que por default está en 10. Se puede cambiar la cantidad dentro de los argumentos de la funcion genSaltSync().

* El metodo hashSync(), toma como parametro el password del objeto y el salt previamente definido (explicado anteriormente, leer documentacion ante dudas) y da como resultado un password encriptado. El resultado en este caso se asignó a: usuario.password, para cambiar el valor del objeto y asi preservar encriptada la contraseña.

######################################################

* Se instalo el express-validator del cual se hizo uso de los metodos check() como middleware para corroborar si el mail ingresado es un middleware

* Ya habiendo pasado por los middleware y entrado en el handler del request, es necesario comprobar el estado de los middlewares para checkear si algun error puede causar problemas en la ejecucion del handler del request, lo que haría que la app se rompa. Por lo anterior dicho, se comprueba la existencia de errores en el request (que paso por los middlewares) para hacer un retorno antes de que la ejecucion del codigo alcance un punto en que la app se rompa. 
Al manejar este error, se puede hacer un retorno de un response con un status de acuerdo al error y devolver el error es lo ideal para saber que pasó.

* Para que se pueda aplicar el manejo de errores en todos los requests que se quiera sin necesidad de copiar y pegar codigo, lo que se hizo fue crear un archivo externo dentro de la carpeta middlewares y se exportó la funcion. Esta funcion es la misma que estaba originalmente en el router.post(). Se paso como middleware despues del path y antes del handler. 

Estrategicamente se ubico despues de cada middleware por que al ser un codigo secuencial, a ese punto hace cada uno de los checkeos y postariormente se valida si hay o no error. En caso de que haya se ejecuta el return que termina con la ejecucion del codigo. Se hizo un return de un response con un status y lo recomendado es devolver los errores que se encontraror. 

Si por algun motivo, algun error no fuera manejado, se ejecutaria el codigo de dentro del handler del request y por este motivo se rompería la app.

Cuando en cambio se ejecuta la funcion, en este caso de validacion, y no se encuentran errores, se termina por ejecutar la sentencia next(), que ejecuta el sig middleware en caso de haber. Caso contrario sigue con la ejecucion normal del codigo.

=====> Calling this function invokes the next middleware function in the app. The next() function is not a part of the Node.js or Express API, but is the third argument that is passed to the middleware function. The next() function could be named anything, but by convention it is always named “next”. To avoid confusion, always use this convention.


* Se comenta el check del rop para que cuando se quieran agregar nuevos roles dentro de la vida ultil de la app, no haga falta modificar el array estatico que se establecio y esto no tire la app desde produccion cuando se modifiquen los cambios. 

En cambio se crearon como una nueva colleccion desde MONGO, y se establecieron los nuevos roles. Esto, al momento de querer agregar un nuevo rol, se puede hacer y cuando se cree un usuario con ese nuevo rol, lo que hace la app es chequear que exista en la coleccion. De esta forma, si no existe, arroja un error pero no tira la app cuando se cree el rol necesario. Y si existe el rol en la BD, lo crea con ese rol existente. 

Para crear la nueva coleccion y no desde la DB, leer documentacion de inicio rapido de Mongoose.

Basicamente lo que se deberia hacer desde el codigo es, cuando se crea la conexion a la DB se crea una nueva instancia de la colleccion con los parametros necesarios y se ejecuta el metodo .save(). **Esto es a validar por que lo intente pero dice que el model creado a partir del schema no es un constructor... tengo que verlo mejor**

* Se comento y se cambio el chequeo de la valiza del rol=

        check('rol').custom(esRoleValido);

de esta forma se le pasa al chequeo custom una funcion validadora y queda mas limpio el codigo. 

* .custom((rol)=> esRoleValido(rol)) === .custom(esRoleValido); ya que se obvia la funcion de flecha por que el argumento que se pasa es el mismo. Por lo tanto se puede obviar la funcion y solo pasar el llamado a la funcion sin pasarle parametros.

* El .findByIdAndUpdate() toma como primer parametro el id para saber a que usuario se esta haciendo referencia y el segundo parametro, todo lo que se pasa (en este caso un array), se contrasta con las propiedades del usuario existente. Las propiedades existentes, si se vuelve a pasar como parametro, se actualizan en el usuario ya existente y se excluye, con la destructuracion, lo que no se quiere actualizar.

* se hace el primer check del id para comprobar si es o no un ID valido en la BD y el segundo check es para ver si existe o no en la BD. Con esta validacion se puede saber si es posible trabajar o no con el usuario con el ID dado.

* Se agrego la validacion del rol. No puede estar vacio y debe existir en la BD para que no genere error.

* La destructuracion que se comento en la peticion get, en realidad no deberia de recibir parametros del req.body ya que en el get se obtienen datos sin mandar nada a cambio. Es por eso que enviar un body desde postman esta mal en teoria. Pero se uso para hacer pruebas de como funcionaban las request http y entender la response. Por lo anterior, se comentó la destructuracion y se dejo como registro de lo que se hizo.

* La paginacion de los usuarios se usa para limitar la informacion que el request get trae desde la base de datos. El metodo skip() == desde y limit() == hasta. Ambas reciben un number como parametro. 

Lo que viene del URL es en realidad un string, por lo que se lo convierte a number

* Los metodos (en este caso .find() y countDocuments() aceptan un parametro que actua como filtro a la hora de realizar busqueda).


* **IMPORTANTE**: El await Promise.all() devuelve todas las funciones asincronas pasadas en simultaneo. Como las funciones asincronas son instrucciones bloqueantes, el tiempo de demora de cada una se suma y por esto el tiempo de respuesta es mas lento. En cambio el await Promise.all() (en esta caso del arreglo de funciones asincronas) realiza todas en simultaneo haciendo que el tiempo de respuesta sea menor y devuelve todas al mismo tiempo (el tiempo de la funcion que mas tardó en lugar de la suma de la tardanza individual).


* Hay dos formas de borrar un usuario por el id. Para ambos casos, el id se toma desde req.params (desde el URL) y el usuario puede:

    **Eliminarse (no recomendado)** con .findByIdAndDelete(id)

    **Cambiar el estado** de activo a inactivo con .findByIdAndUpdate(id,{estado:false})

* En los enviroments hay informacion sensible. En este caso esta la coneccion a la base de datos MONGO. Por este motivo se crea y se sube al repositorio y al servidor un example.env donde en realidad no se incluye el URL o cualquier informacion sensible.

Lo que se hace es confirgurar en el servidor las variables de entorno para que no haya necesidad de que las tome del repositorio de github. 

Si estuviera subido a github para despues subirlo al servidor y modificarlo en github para que no esté el url, tambien funcionaria pero seria tedioso hacer siempre el mismo proceso y por eso se configuran las variables de entorno sensibles en el servidor.

**Para ver las variables de entorno** => heroku config

**Para configurar variables de entorno en heroku**: (en el directorio vinculado al proyecto que se hizo el deploy) heroku config:set *nombre de la variable de entorno*=*"valor entre comillas de la variable de entorno"*.

**Borrar las variables de entorno en heroku** => heroku config:unset *nombre de la variable a eliminar*.
