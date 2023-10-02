/*
* La prueba visual de arreglo (TAV) es un experimento, en el cual el usuario
* intenta percibir los cambios entre dos imagenes, en este caso, es una colección
* de cuadros de diferentes colores
*/

/*
* Variable jsPsych que utilizaremos a lo largo de programa, es lo mínimo requerido 
* para un programa jspsych
* el parámetro on_finish es una función que se ejecuta al terminar el experimento
* Crea un archivo csv con con nombre informacion.csv
*/
var jsPsych = initJsPsych();

/*
* Variable timeline que es una lista que dice en que 
* orden va nuestro experimento
*/
var timeline = [];

/*
* Lista de las imagenes que serán utilizadas a lo largo del experimento
*/
var imagenes = ["img/blue.png",  
"img/black.png", 
"img/yellow.png", 
"img/green.png", 
"img/red.png", 
"img/purple.png", 
"img/circle.png"]

/*
* Plugin que nos ayuda a carga archivos multimedia antes de usarlos 
* en nuesto experimento
*/
var preload = {
  type: jsPsychPreload,
  images: imagenes,
  auto_preload: true, //si es true, carga las imagenes antes de que sean llamadas
};

/*
* Estructuras auxiliares
*/

/*
* Diccionario: Numeros utilizados para representar los colores
*/
var auxDiccionario = {
  0: 'grey',
  1: 'red',
  2: 'green',
  3: 'blue',
  4: 'purple',
  5: 'yellow',
  6: 'black',
}

/*
* Agregamos la variable preload a timeline
*/
timeline.push(preload)

/*
* Plugin utilizado para conseguir información del participante
*/
var cuestionario = {
  type: jsPsychSurveyText,
  questions: [
    {prompt: 'Escribe tu nombre', name: 'Nombre'},
    {prompt: 'Escribe tu edad', name: 'Edad'}
  ]
}

/*
* Pasamos el plugin cuestionario a timeline
*/
timeline.push(cuestionario)

/*
* Plugin que presenta las isntrucciones en pantalla
*/
var bienvenida = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
  <p>En este experimento, apareceran distintos cuadros en la pantalla de diferentes colores,</p>
  <p>estos estaran presentes por 1 segundo, despues, aparecera una cruz en medio, tras cual apareceran de nuevo,</p>
  <p>el objetivo de esto, es apretar las teclas <strong>S</strong> si cambia el color del recuadro circulado</p>
  <p> o <strong>K</strong> en caso de que no haya cambios.</p>`
}

/*
* Agregamos la variable bienvenida a timeline
*/
timeline.push(bienvenida)

/*
* Plugin que presenta una colección de cuadros de diferentes colores
* Los parámetros son 
* random: al ser false, tendremos que escribirlo a mano
* arreglo: es una lista de listas, donde los números representan un color, revisar auxDiccionario para ver los colores
* posicionDelCirculo: lista de dos elementos que nos dice donde va estar el círculo
* la primera posición nos dice la lista, la segunda es la posición dentro de la lista
*/
var arregloCuadros = {
  type: jsVisualArray,
  random: false,
  arreglo: [[1,0,0,1],
            [4,1,1,4],
            [4,1,1,4],
            [1,0,0,1]],
  posicionDelCirculo: [1,2],
}

/*
* Empujamos la varibale arregloCuadros a timeline
*/
timeline.push(arregloCuadros)

/*
* Plugin que solo presenta una cruz en la pantalla por 1000 ms
*/
var fixation = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: function(){
    return '<div style="font-size:40px;">+</div>'
  },
  choices: "NO_KEYS", //Esto nos dice que no puede recibir valores del teclado
  trial_duration: 1000, //cuanto dura la prueba
  data: {
    task: 'fixation'    //Solo nos dice como se llamará en el csv el plugin
  }
}

/*
* Agregamos fixation a timeline
*/
timeline.push(fixation)

/*
* Plugin que circula un cuadrado y espera la respuesta del participante
* Como parámetros recibe
* posicion: utilizamos una funcion, la cual es una lista de dos elementos, que nos dice donde estará circulada
* arreglo: Es la lista de listas que se hizo en el plugin anterior
* cambioColor: valor booleano, true si hay cambio de color, false si no hay cambio
* colorPosicion: color actual de la celda a circular
* color: Color al que se va a cambiar la posicion circulada
*
* La funcion jsPsych.data.get().last(2).values()[0] nos devuelve una lista, donde el primer elemento es
* un objeto, con las columnas del segundo renglon de abajo a arriba del csv, es decir, este objeto tendra
* la informacion del plugin jsVisualArray, y los llamamos como si fueran un atributo de dicho objeto
*/
var revision = {
  type: jsVisualArrayResponse,
  posicion: function(){
    return jsPsych.data.get().last(2).values()[0].posicionCirculo 
  },
  arreglo: function(){
    return jsPsych.data.get().last(2).values()[0].arreglo
  },
  cambioColor: true,
  colorPosicion: function(){
    return jsPsych.data.get().last(2).values()[0].color
  },
  color: function(){    //Funcion que prueba si hay un color diferente
    if('red' === jsPsych.data.get().last(2).values()[0].color){//el color es el mismo, hacmeos un random
      var aux = auxDiccionario[Math.floor(Math.random()*6) + 1]//Declaramos un color haciendo uso de auxDiccionario
      while(aux == 'red'){                                     //Bucle para evitar que se repita el mismo color
        aux = auxDiccionario[Math.floor(Math.random()*6) + 1]  //Sale del bucle hasta que se tenga un color diferente
      }
      return aux
    }else{// los colores no son iguales, seguimos normal
      return 'red'
    } 
  }
}

/*
* Agregamos la variable revision a timeline
*/
timeline.push(revision)

/*
var arregloCuadros1 = {
  type: jsVisualArray,
  random: ,
  arreglo: ,
  posicionDelCirculo: ,
}

var revision1 = {
  type: jsVisualArrayResponse,
  posicion: function(){
    return jsPsych.data.get().last(2).values()[0].posicionCirculo// no podemos acceder directamente a ellos, necesitamos una funcion
  },
  arreglo: function(){
    return jsPsych.data.get().last(2).values()[0].arreglo
  },
  cambioColor: ,
  colorPosicion: function(){
    return jsPsych.data.get().last(2).values()[0].color
  },
  color: function(){
    if(COLOR A CAMBIAR == jsPsych.data.get().last(2).values()[0].color){//el color es el mismo, hacmeos un random
      var aux = auxDiccionario[Math.floor(Math.random()*6) + 1]//Declaramos un color haciendo uso de auxDiccionario
      while(aux == COLOR A CAMBIAR){                                     //Bucle para evitar que se repita el mismo color
        aux = auxDiccionario[Math.floor(Math.random()*6) + 1]  //Sale del bucle hasta que se tenga un color diferente
      }
      return aux
    }else{// los colores no son iguales, seguimos normal
      return COLOR A CAMBIAR
    } 
  }
}
*/

/*
* Final de nuestro programa, corre lo que hay en timeline
*/
jsPsych.run(timeline);