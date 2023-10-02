/*
*Plugin jsVisualArrayResponse, el cual hace una colección de cuadrados de colores con una posición circulada
*Parámetros:
*           -arreglo: un arreglo de 4*4, cada elemento es un string en html.
*           -cambioColor: valor booleano, true si hay cambio de color, false si no hay cambio
*           -posicion: la posicion dentro del arreglo que sera circulada en forma de lista con dos elementos [renglon, columna]
*           -colorPosicion: color actual de la celda a circular
*           -color: color al que se va a cambiar la celda circulada
*Salida:
*           -rt: tiempo de respuesta
*           -cambioDeColor: booleano si nos dice si cambia el color, true para si, false para no
*           -correcto: booleano si nos dice si el participante presiono la tecla correcta, true para si, false para no
*           -colorCeldaAntesDePrueba: color antes de circular el cuadrado
*           -colorCeldaDespuesDePrueba: color despues de circular el cuadrado
*           -posicionCelda: posicion del cuadrado circulado, en forma de lista de dos elementos [renglon, columna]
*           -arreglo: arreglo despues de circular el cuadrado
*
*/
var jsVisualArrayResponse = (function (jspsych){
    "use strict"

    const info = {
        name: 'Visual Array Response',
        parameters:{
            arreglo:{
                type: jspsych.ParameterType.OBJECT, //arreglo de 4*4
                default: undefined
            },
            posicion:{
                type: jspsych.ParameterType.OBJECT, //posicion que se cambia de color [renglon, columna]
                default: undefined,
            },
            cambioColor:{
                type: jspsych.ParameterType.BOOL, //nos avisa si se va a cambiar el color o no
                default: undefined,
            },
            colorPosicion:{
                type: jspsych.ParameterType.STRING,//color actual de la celda
                default: undefined
            },
            color:{
                type:jspsych.ParameterType.STRING, //color a cambiar de la posicion del circulo
                default: undefined,
            }
        }
    }

    class VisualArrayResponse{

        /*
        * Constructor estándar, siempre que se crea un pulgin personalizado
        * este es obligatorio
        */
        constructor(jsPsych){
            this.jsPsych = jsPsych;
        }

        /*
        * Funcion que agrega el circulo
        */
        circuloPosicion(arreglo, posicion, color){
            arreglo[posicion[0]][posicion[1]] = `
            <div class="parent">
                <img src="img/circle.png" class="image1" />
                <img src="img/${color}.png" class="image2" />
            </div>
            `
        }

        /*
        * Método trial, en este método va todo lo que hará nuestro plugin
        * display_element es un objeto que utilizamos para mostrar elementos html
        * trial es un objeto que sus atributos son los parámetros
        */
        trial(display_element, trial){
            //Se guarda el arreglo en una constante para poder usarlo más adelante
            const array = trial.arreglo

            //Preguntamos si hay cambio de color en la celda
            if(trial.cambioColor){//si hay cambio de color
                this.circuloPosicion(array, trial.posicion, trial.color)
            }else{//no hay cambio de color
                this.circuloPosicion(array, trial.posicion, trial.colorPosicion)
            }

            /*
            * String html que pone todos los cuadros del arreglo en pantalla
            */
            var html_content = `
            <table>
              <tr>
                <td>
                    ${array[0][0]}
                </td>
                <td>
                    ${array[0][1]}
                </td>
                <td>
                    ${array[0][2]}    
                </td>
                <td>
                    ${array[0][3]}
                </td>
              </tr>
              <tr>
                <td>
                    ${array[1][0]}
                </td>
                <td>
                    ${array[1][1]}
                </td>
                <td>
                    ${array[1][2]}    
                </td>
                <td>
                    ${array[1][3]}
                </td>
              </tr>
              <tr>
                <td>
                    ${array[2][0]}
                </td>
                <td>
                    ${array[2][1]}
                </td>
                <td>
                    ${array[2][2]}    
                </td>
                <td>
                    ${array[2][3]}
                </td>
              </tr>
              <tr>
                <td>
                    ${array[3][0]}
                </td>
                <td>
                    ${array[3][1]}
                </td>
                <td>
                    ${array[3][2]}    
                </td>
                <td>
                    ${array[3][3]}
                </td>
              </tr>
            </table>
            `

            /*
            * Pasamos la variable html_content a pantalla
            */
            display_element.innerHTML = html_content;

            /*
            * Función que es llamada en callback_function al final de trial
            * Le pasamos el parámetro info, el cual tiene dos atributos,
            * key, que es la tecla presionada
            * rt, que es el tiempo que le tomo presionarla 
            */
            const after_key_response = (info) => {
                //Esconde imagen
                display_element.innerHTML = '';
            
                //variable que compara los valores dados por el usuario y el esperado
                var valores = null

                /*
                * Preguntamos si se permitio el cambio de color
                */
                if(trial.cambioColor){
                    valores = this.jsPsych.pluginAPI.compareKeys(info.key,'s')
                }else{
                    valores = this.jsPsych.pluginAPI.compareKeys(info.key,'k')
                }

                //Variable data que se guarda información en el csv
                let data = null

                /*
                * Si cambioColor es false, el colorCeldaDespuesDePrueba es el mismo que colorCeldaAntesDePrueba
                * Si es true, colorCeldaDespuesDePrueba es diferente a colorCeldaAntesDePrueba
                */
                if(trial.cambioColor == false){
                    // informacion que se va a guardar
                    data = {
                        rt: info.rt,
                        cambioDeColor: trial.cambioColor,
                        correcto: valores,
                        colorCeldaAntesDePrueba: trial.colorPosicion, //el color de la celda
                        colorCeldaDespuesDePrueba: trial.colorPosicion,
                        posicionCelda: trial.posicion,
                        arreglo: trial.arreglo,
                    }
                }else{
                    // informacion que se va a guardar
                    data = {
                        rt: info.rt,
                        cambioDeColor: trial.cambioColor,
                        correcto: valores,
                        colorCeldaAntesDePrueba: trial.colorPosicion, //el color de la celda
                        colorCeldaDespuesDePrueba: trial.color,
                        posicionCelda: trial.posicion,
                        arreglo: trial.arreglo,
                    }
                }
            
                // final
                this.jsPsych.finishTrial(data);
              }
            

            /*
            * Final del método trial, en este caso, se espera una respuesta 
            * del teclado
            */
            this.jsPsych.pluginAPI.getKeyboardResponse({
                callback_function: after_key_response,
                valid_responses: ['s','k'],             //respuestas validas
                persist: false,});
        }
    }

    VisualArrayResponse.info = info;

    return VisualArrayResponse

})(jsPsychModule)