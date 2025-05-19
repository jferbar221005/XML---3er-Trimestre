let preguntas = [];
let indicePregunta = 0;
let puntuacion = 0;
let segundos = 0;
let timer = null;

const preguntaDiv = document.getElementById("pregunta");
const opcionesDiv = document.getElementById("opciones");
const siguienteBtn = document.getElementById("siguiente");
const relojDiv = document.getElementById("reloj");
const resultadoDiv = document.getElementById("resultado");
const idiomaSelect = document.getElementById("idioma");

function cargarPreguntas(idioma) {
  const xhr = new XMLHttpRequest();
  const url = idioma === "es" ? "preguntas_es.xml" : "preguntas_en.xml";
  xhr.open("GET", url, true);
  xhr.responseType = "document";
  xhr.overrideMimeType('text/xml');
  xhr.onload = function () {
    if (xhr.status === 200) {
      const xml = xhr.responseXML;
      preguntas = Array.from(xml.getElementsByTagName("question"));
      indicePregunta = 0;
      puntuacion = 0;
      segundos = 0;
      resultadoDiv.textContent = "";
      siguienteBtn.disabled = true;
      mostrarPregunta();
      iniciarReloj();
    } else {
      preguntaDiv.textContent = "Error al cargar preguntas.";
    }
  };
  xhr.onerror = function () {
    preguntaDiv.textContent = "Error en la petición AJAX.";
  };
  xhr.send();
}

function mostrarPregunta() {
  if (indicePregunta >= preguntas.length) {
    finalizarTest();
    return;
  }
  const q = preguntas[indicePregunta];
  const wording = q.getElementsByTagName("wording")[0].textContent;
  const choices = q.getElementsByTagName("choice");

  preguntaDiv.textContent = `${indicePregunta + 1}. ${wording}`;
  opcionesDiv.innerHTML = "";

  for (let i = 0; i < choices.length; i++) {
    const btn = document.createElement("button");
    btn.textContent = choices[i].textContent;
    btn.dataset.correct = choices[i].getAttribute("correct");
    btn.onclick = seleccionarRespuesta;
    opcionesDiv.appendChild(btn);
  }
  siguienteBtn.disabled = true;
}

function seleccionarRespuesta(event) {
  const botones = opcionesDiv.querySelectorAll("button");
  botones.forEach(b => b.disabled = true);

  const seleccionado = event.target;
  if (seleccionado.dataset.correct === "yes") {
    puntuacion++;
    seleccionado.style.backgroundColor = "#a6e6a1"; 
  } else {
    seleccionado.style.backgroundColor = "#f7a1a1"; 
  
    botones.forEach(b => {
      if (b.dataset.correct === "yes") {
        b.style.backgroundColor = "#a6e6a1";
      }
    });
  }
  siguienteBtn.disabled = false;
}

function siguientePregunta() {
  indicePregunta++;
  mostrarPregunta();
}

function iniciarReloj() {
  clearInterval(timer);
  segundos = 0;
  relojDiv.textContent = "Tiempo: 00:00";
  timer = setInterval(() => {
    segundos++;
    const min = String(Math.floor(segundos / 60)).padStart(2, "0");
    const sec = String(segundos % 60).padStart(2, "0");
    relojDiv.textContent = `Tiempo: ${min}:${sec}`;
  }, 1000);
}

function finalizarTest() {
  clearInterval(timer);
  preguntaDiv.textContent = "¡Test finalizado!";
  opcionesDiv.innerHTML = "";
  siguienteBtn.disabled = true;
  resultadoDiv.textContent = `Puntuación: ${puntuacion} / ${preguntas.length} - Tiempo: ${relojDiv.textContent.slice(7)}`;
}

idiomaSelect.addEventListener("change", () => {
  cargarPreguntas(idiomaSelect.value);
});

siguienteBtn.addEventListener("click", siguientePregunta);

cargarPreguntas(idiomaSelect.value);