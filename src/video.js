"use strict";

import { VideoClip } from './video_clip';


class Escena {
  #tInicio;
  #tFin;

  constructor(tInicio, tFin) {
    this.#tInicio = tInicio;
    this.#tFin = tFin;
  }

  get tInicio() {
    return this.#tInicio;
  }

  get tFin() {
    return this.#tFin;
  }
}


class Dado extends EventTarget {
  #elementoDOM;
  #estaGirando;

  get #caras() { return 3; }
  get #tiempoGiro() { return 1000; }

  constructor(elementoDOM) {
    super();
    this.#elementoDOM = elementoDOM;
    this.#estaGirando = false;

    this.#agregarEscuchaEventos();
  }

  mostrarDado() {
    this.#elementoDOM.style.display = 'block';
  }

  #agregarEscuchaEventos() {
    let girarEnlazada = this.#girar.bind(this);

    this.#elementoDOM.addEventListener('click', girarEnlazada);
  }

  #girar() {
    if (!this.#estaGirando) {
      console.log('Good luck!');
      this.#iniciarGiro();
      // Es necesario hacer este enlace para que al agregarse el escucha, this en
      // #reproduccionVideoClip apunte al videoClip y no al elementoDOM, porque this
      // depende desde donde se llama, al llamarse desde el evento timeupdate de elementoDOM
      // this apunta a este último elemento. Se usa una arrow function porque estas funciones
      // no tienen su contexto y buscan el this hacia arriba en la jerarquia como si
      // fuera otra variable (https://stackoverflow.com/a/38931751/1647238 redireccionado de https://stackoverflow.com/a/30448329/1647238)
      // let reproduccionVideoClipEnlazada = () => this.#reproduccionVideoClip();
      let finalizarGiroEnlazada = this.#finalizarGiro.bind(this);
      window.setTimeout(finalizarGiroEnlazada, this.#tiempoGiro);
    }
  } // https://stackoverflow.com/a/1527820/1647238

  #iniciarGiro() {
    this.#estaGirando = true;
  }

  #finalizarGiro() {
    this.#estaGirando = false;
    this.#ocultarDado();
    let resultadoDado = Math.floor(Math.random() * this.#caras + 1);
    this.#notificarResultado(resultadoDado);
  }

  #notificarResultado(resultadoGiro) {
    //let evt = new CustomEvent('numeroGenerado', { detail: resultadoGiro });
    let evt = new CustomEvent('numeroGenerado', { detail: 1 });
    this.dispatchEvent(evt);
  }

  #ocultarDado() {
    this.#elementoDOM.style.display = 'none';
  }
}

class ComandoReproductor {
  _videoClip;
  _escena;

  constructor(videoClip, escena) {
    this._videoClip = videoClip;
    this._escena = escena;
  }

  async ejecutar() {
    console.log('Ejecución comando no definida');
  }
}

class ComandoReproducirEscena extends ComandoReproductor {
  constructor(videoClip, escena) {
    super(videoClip, escena);
  }

  async ejecutar() {
    await this._videoClip.reproducirEscena(this._escena);
  }
}

class ComandoBucleEscena extends ComandoReproductor {
  constructor(videoClip, escena) {
    super(videoClip, escena);
  }

  async ejecutar() {
    await this._videoClip.bucleEscena(this._escena);
  }
}

class Reproductor {
  #comandos;

  constructor() {
    this.#comandos = [];
  }

  agregarComando(comando) {
    this.#comandos.push(comando);
  }

  async iniciaReproduccion() {
    while (this.#comandos.length) {
      console.log('Ejecución comando iniciada');
      await this.#comandos.shift().ejecutar();
      console.log('Ejecución comando finalizada');
    }
  }
}

let videoClip;
let dado;


let escenaInicioTablero = new Escena(1, 3.999);
let escenaBucleTablero = new Escena(4, 4.999);
let escenaFinTablero = new Escena(5, 6);


let escenas = [
  //new Escena(8, 30),
  new Escena(8, 10),
  new Escena(42, 60),
  new Escena(77, 100)
];

document.addEventListener('DOMContentLoaded', function () {
  let videoClipE = document.getElementById('obra_teatro');
  videoClip = new VideoClip(videoClipE);

  let dadoE = document.getElementById('dado');
  dado = new Dado(dadoE);

  let reproductor = new Reproductor();

  dado.addEventListener('numeroGenerado', (evt) => agregarEscena(evt.detail));

  // videoClip.addEventListener('bucleFinalizado', () => console.log("It's over my loop"));
  // videoClip.addEventListener('escenaFinalizada', () => console.log("It's over my scene"));

  function agregarEscena(nEscena) {
    let escena = escenas[nEscena - 1];
    let comandoReproducirEscena = new ComandoReproducirEscena(videoClip, escena);
    let comandoBucleEscena = new ComandoBucleEscena(videoClip, escenaBucleTablero);

    reproductor.agregarComando(comandoReproducirEscena);
    reproductor.agregarComando(comandoBucleEscena);

    reproductor.iniciaReproduccion();
  }

  async function imprimirEscena(nEscena) {

    await videoClip.reproducirEscena(escena);
    console.log('escena 1 finalizada');
    await videoClip.bucleEscena(escenaBucleTablero);
    let tInicio = escena.tInicio;
    let tFin = escena.tFin;
    console.log('Escena: ' + nEscena + ' - inicio: ' + tInicio + ' - fin: ' + tFin);
  }
});