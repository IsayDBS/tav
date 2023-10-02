/*
* Plugin jsVisualArray, el cual hace una colección de cuadrados de colores
* Parámetros:
*           -random: booleano que nos dice la colección será al azar, por default es true, significando que es al azar, false es que no lo es
*           y espera un valor en los dos siguientes parámetros
*           -arreglo: una lista de listas de 4*4, con numeros que representan los colores de la siguiente manera.
*                0: 'grey',
*                1: 'red',
*                2: 'green',
*                3: 'blue',
*                4: 'purple',
*                5: 'yellow',
*                6: 'black',
*           -posicionDelCirculo: una lista con dos elementos, donde el primer elemento es el renglón y el segundo es la columna
*
* Valores de salida:
*                   arreglo: el arreglo con código html que se imprime en pantalla.
*                   color: color de la posición actual que será circulado.
*                   posicionCirculo: una lista de dos elementos, renglón y columna, donde nos dice que posición del arreglo será ciruclado.
*/
var jsVisualArray = (function (jspsych){
    "use strict"

    const info = {
        name: 'Visual Array',
        parameters:{
            random:{
                type: jspsych.ParameterType.BOOL,// nos dice si el array se hara al azar
                default: true,
            },
            arreglo:{
                type: jspsych.ParameterType.OBJECT, //0 no hay cambio de color, 1 rojo, 2 verde, 3 azul, 4 morado, 5 amarillo, 6 negro
                default: [
                    [0,0,0,0],
                    [0,0,0,0],
                    [0,0,0,0],
                    [0,0,0,0]
                ]
            },
            posicionDelCirculo:{
                type: jspsych.ParameterType.OBJECT,//lista con [renglon,columna] del que sera circulado
                default: []
            }
        }
    }

    class VisualArray{

        /*
        * Constructor estándar, siempre que se crea un pulgin personalizado
        * este es obligatorio
        */
        constructor(jsPsych){
            this.jsPsych = jsPsych;
        }

        /*
        * Funcion usada para cambiar el arreglo, de numeros a etiquetas de html
        * nos regresa el color de la celda que va a cambiar el color
        * que seria la primer posicion del arreglo
        */
        coloresArreglo(arreglo, posicion){
            var aux = 'color'
            var auxDiccionario = {
                0: 'grey',
                1: 'red',
                2: 'green',
                3: 'blue',
                4: 'purple',
                5: 'yellow',
                6: 'black',
            }
            for(var i = 0; i < arreglo.length; i++){
                for(var j = 0; j < arreglo[i].length; j++){
                    if(i == posicion[0] && j == posicion[1]){
                        aux = auxDiccionario[arreglo[i][j]]
                    }
                    arreglo[i][j] = `
                    <div class="parent">
                        <img src="img/grey.png" class="image1" />
                        <img src="img/${auxDiccionario[arreglo[i][j]]}.png" class="image2" />
                    </div>
                    `
                }
            }
            return aux;
        }

        /*
        * Método trial, en este método va todo lo que hará nuestro plugin
        * display_element es un objeto que utilizamos para mostrar elementos html
        * trial es un objeto que sus atributos son los parámetros
        */
        trial(display_element, trial){
            //Lista donde guardaremos las posiciones de los recuadros pintados
            //de la forma [renglo, columna]
            var posColores = []

            var colorCirculo = 'color'

            /*
            * Preguntamos si el programador puso random en true
            */
            if(trial.random){
                //Revisamos si nos dieron cuantos cuadros tendra, en caso de que no, le damos un valor
                //al azar entre 4 y 12
                var cuadros = Math.floor(Math.random()*12) + 4
                //Agregamos esto al arreglo, en caso de que pasen algo al arreglo
                trial.arreglo = [
                    [0,0,0,0],
                    [0,0,0,0],
                    [0,0,0,0],
                    [0,0,0,0]
                ]
                /*
                *Llena aleatoriamente el arreglo con numeros del 1 al 6
                * que representan colores de la siguiente manera
                * 0: 'grey',
                * 1: 'red',
                * 2: 'green',
                3: 'blue',
                4: 'purple',
                5: 'yellow',
                6: 'black',
                * Llenamos posColores con las posiciones de los colores
                * */
                while(cuadros > 0){
                    var row = Math.floor(Math.random()*4)
                    var col = Math.floor(Math.random()*4)
                    if(trial.arreglo[row][col] == 0){
                        posColores.push([row,col])
                        trial.arreglo[row][col] = Math.floor(Math.random() * 6) + 1
                        cuadros--;
                    }
                }
                /*
                * Hace un shuffle al arreglo
                * Dejandonos el que está en la posicion posColores[0] como el que podria cambiar de color
                */
                posColores = jsPsych.randomization.shuffle(posColores) 

                //Colorea nuestro arreglo, de numeros a html
                colorCirculo = this.coloresArreglo(trial.arreglo, posColores[0])
            }else{

                //Colorea nuestro arreglo, de numeros a html, con la posicion del circulo 
                colorCirculo = this.coloresArreglo(trial.arreglo, trial.posicionDelCirculo)
                
                //Utilizamos la lista para simplificar codigo, solo utilizamos el primer elemento
                posColores.push(trial.posicionDelCirculo)
            }

            
            /*
            *Arreglo convertido en html
            */
            var html_content = `
            <table>
              <tr>
                <td>
                    ${trial.arreglo[0][0]}
                </td>
                <td>
                    ${trial.arreglo[0][1]}
                </td>
                <td>
                    ${trial.arreglo[0][2]}    
                </td>
                <td>
                    ${trial.arreglo[0][3]}
                </td>
              </tr>
              <tr>
                <td>
                    ${trial.arreglo[1][0]}
                </td>
                <td>
                    ${trial.arreglo[1][1]}
                </td>
                <td>
                    ${trial.arreglo[1][2]}    
                </td>
                <td>
                    ${trial.arreglo[1][3]}
                </td>
              </tr>
              <tr>
                <td>
                    ${trial.arreglo[2][0]}
                </td>
                <td>
                    ${trial.arreglo[2][1]}
                </td>
                <td>
                    ${trial.arreglo[2][2]}    
                </td>
                <td>
                    ${trial.arreglo[2][3]}
                </td>
              </tr>
              <tr>
                <td>
                    ${trial.arreglo[3][0]}
                </td>
                <td>
                    ${trial.arreglo[3][1]}
                </td>
                <td>
                    ${trial.arreglo[3][2]}    
                </td>
                <td>
                    ${trial.arreglo[3][3]}
                </td>
              </tr>
            </table>
            `

            /*
            * Pasamos la variable html_content a pantalla
            */
            display_element.innerHTML = html_content;

            /*
            * Final de método trial
            * En este caso, se esperará 1000 ms
            */
            this.jsPsych.pluginAPI.setTimeout(() =>{
                this.jsPsych.pluginAPI.clearAllTimeouts();
                display_element.innerHTML = "";
                var trial_data = {
                    rt: info.rt,             //Tiempo de la prueba (1000 ms)
                    arreglo: trial.arreglo, //arreglo convertido en html
                    color: colorCirculo,    //Color de la posicion que sera circulada, es decir, posColores[0]
                    posicionCirculo: posColores[0], //primera posicion que es la que se va a circular
                };

                /*
                * Finalizamos el plugin, pasamos el objeto creado anteriormente como parámetro
                */
                this.jsPsych.finishTrial(trial_data);
            }, 1000);
        }
    }

    //Final de plugin
    VisualArray.info = info;

    return VisualArray

})(jsPsychModule)