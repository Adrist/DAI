// ast26@alu.ua.es
// var flickr_key = "8098bd8f4e4081e0c8fbf98f62418a89";
var contador = 1;
window.onload = init;

function init() {
  var bloques = document.querySelectorAll(".bloque");
  var cuestionarios = document.querySelectorAll("section");
  document.querySelector("input[name=crea]").addEventListener("click", addCuestionario);
  bloques.forEach(function(bloque) {
    addCruz(bloque);
  });
  cuestionarios.forEach(function(cuestionario) {
    addFormPregunta(cuestionario);
    // addWikipedia(cuestionario.id, cuestionario.querySelector(".formulario"));
    // addFlickr(cuestionario.id, cuestionario.querySelector(".icono"));
  });
}

function addCuestionario(evento) {
  var formulario = document.querySelector("#nuevoCuestionario");
  var tema = formulario.querySelector("input[name=tema]");
  var imagen = "https://eoimages.gsfc.nasa.gov/images/imagerecords/57000/57723/globe_east_540.jpg";
  if(tema.value == "") {
    window.alert("Por favor, rellena los campos.");
  } else {
    var cuestionario = document.createElement("section");
    var html = "<encabezado-cuestionario tema=\"" + tema.value + "\"></encabezado-cuestionario>"
    // var html =  "<h2>" +
    //               "<img class=\"icono\" src=\"" + imagen.value + "\" alt=\"Un icono de " + tema.value + ".\">" +
    //               "Cuestionario sobre " + tema.value +
    //             "</h2>";
    cuestionario.setAttribute("id", "c" + contador);
    cuestionario.innerHTML = html;
    insertAsLastChild(document.body.querySelector("main"), cuestionario);
    var indice = document.body.querySelector("nav > ul");
    var li = document.createElement("li");
    var a = document.createElement("a");
    var texto = document.createTextNode(tema.value);
    a.setAttribute("href", "#c" + contador);
    insertAsLastChild(a, texto);
    insertAsLastChild(li, a);
    insertAsLastChild(indice, li);
    addFormPregunta(cuestionario);
    // addWikipedia(tema.value, cuestionario.querySelector(".formulario"));
    // addFlickr(tema.value, cuestionario.querySelector(".icono"));
    tema.value = "";
    imagen.value = "";
    contador++;
  }
}

function addFormPregunta(cuestionario) {
  var formulario = document.createElement("div");
  var tema = cuestionario.getAttribute("id");
  var html =  "<ul>" +
                "<li>" +
                  "<label>Enunciado de la pregunta:</label>" +
                  "<input type=\"text\" name=\"" + tema + "_pregunta\">" +
                "</li>" +
                "<li>" +
                  "<label>Respuesta:</label>" +
                  "<input type=\"radio\" name=\"" + tema + "_respuesta\" value=\"verdadero\" checked>Verdadero" +
                  "<input type=\"radio\" name=\"" + tema + "_respuesta\" value=\"falso\">Falso" +
                "</li>" +
                "<li>" +
                  "<input type=\"button\" value=\"Añadir nueva pregunta\">" +
                "</li>" +
              "</ul>";
  formulario.classList.add("formulario");
  formulario.innerHTML = html;
  formulario.querySelector("input[type=button]").addEventListener("click", addPregunta);
  insertBeforeChild(cuestionario, cuestionario.children[1], formulario);

  return formulario;
}

// function addWikipedia(cadena, formulario) {
//   var cuestionario = queryAncestorSelector(formulario, "section");
//   var descripcion = document.createElement("div");
//   descripcion.textContent = "";
//   descripcion.classList.add("wiki");
//   fetch('https://es.wikipedia.org/w/api.php?origin=*&format=json&action=query&prop=extracts&exintro&explaintext&continue&titles=' + cadena)
//   .then(validateResponse)
//   .then(function(responseAsJson) {
//     for (page in responseAsJson.query.pages) {
//       descripcion.textContent += responseAsJson.query.pages[page].extract;
//     }
//   })
//   .catch(logError);
//   insertBeforeChild(cuestionario, cuestionario.children[1], descripcion);
// }
//
// function addFlickr(cadena, icono) {
//   var cuestionario = queryAncestorSelector(icono, "section");
//   var src = "https://eoimages.gsfc.nasa.gov/images/imagerecords/57000/57723/globe_east_540.jpg";
//   fetch('https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=' + flickr_key + '&tags=' + cadena + '&format=json&nojsoncallback=1')
//   .then(validateResponse)
//   .then(function(responseAsJson){
//     var id = responseAsJson.photos.photo[0].id;
//     fetch('https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=' + flickr_key + '&photo_id=' + id + '&format=json&nojsoncallback=1')
//     .then(validateResponse)
//     .then(getFlickrIcon) //Recupera la primera imagen del recurso en Flickr:API
//     .then(function(url) {
//       src = url;
//       icono.src = src;
//     })
//     .catch(logError)
//   })
//   .catch(logError);
//   icono.src = src;
// }
//
// function getFlickrIcon(responseAsJson) {
//   return responseAsJson.sizes.size[0].source;
// }

function addPregunta(evento) {
  var cuestionario = queryAncestorSelector(this, "section");
  var formulario = queryAncestorSelector(this, ".formulario");
  var enunciado = formulario.querySelector("input[type=text]");
  var verdadero = formulario.querySelector("input[type=\"radio\"]");
  if(enunciado.value == "") {
    window.alert("Por favor, introduce un enunciado.");
  } else {
    var bloque = document.createElement("div");
    var html =  "<div class=\"pregunta\">" +
                  enunciado.value +
                "</div>" +
                "<div class=\"respuesta\" data-valor=\"" + verdadero.checked + "\"></div>";
    bloque.classList.add("bloque");
    bloque.innerHTML = html;
    insertAsLastChild(cuestionario, bloque);
    addCruz(bloque);
    enunciado.value = "";
    verdadero.checked = true;
  }
}

function addCruz(bloque) {
  var elemento =  document.createElement("div");
  elemento.classList.add("borra");
  elemento.textContent = "\u2612";
  elemento.addEventListener("click", borraPregunta);
  insertAsFirstChild(bloque, elemento);
}

function borraPregunta(evento) {
  var pregunta = queryAncestorSelector(this, ".bloque");
  var cuestionario = queryAncestorSelector(this, "section");
  var tema = "#" + cuestionario.getAttribute("id");
  var indices = document.body.querySelectorAll("a");
  removeElement(pregunta);
  if(cuestionario.querySelector(".bloque") == null) {
    removeElement(cuestionario);
    for(i in indices) {
      var referencia = indices[i].getAttribute("href");
      if(referencia == tema) {
        removeElement(indices[i]);
        break;
      }
    }
  }
}

function queryAncestorSelector(node,selector) {
  var parent= node.parentNode;
  var all = document.querySelectorAll(selector);
  var found= false;
  while (parent !== document && !found) {
    for (var i = 0; i < all.length && !found; i++) {
      found= (all[i] === parent)?true:false;
    }
    parent= (!found)?parent.parentNode:parent;
  }
  return (found)?parent:null;
}

// Modulos FETCH ///////////////////////////////////////////////////////////
// function logResult(result) {
//   console.log(result);
// }
//
// function logError(error) {
//   console.log('Ha habido un problema: \n', error);
// }
//
// function validateResponse(response) {
//   if(!response.ok) {
//     throw Error(response.statusText);
//   }
//   return readResponseAsJSON(response);
// }
//
// function readResponseAsJSON(response) {
//   return response.json();
// }
//
// function readResponseAsBlob(response) {
//   return response.blob();
// }

// Modulos DOM /////////////////////////////////////////////////////////////
function insertAsLastChild(padre,nuevoHijo) {
  padre.appendChild(nuevoHijo);
}

function insertAsFirstChild(padre,nuevoHijo) {
  var primerHijo = padre.children[0];
  padre.insertBefore(nuevoHijo, primerHijo);
}

function insertBeforeChild(padre,hijo,nuevoHijo) {
  padre.insertBefore(nuevoHijo, hijo);
}

function removeElement(nodo) {
  nodo.parentNode.removeChild(nodo);
}
