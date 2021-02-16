"use strict";

class VideoClip {
  #elementoDOM;
  #esFinBucle;

  constructor(elementoDOM) {
    this.#elementoDOM = elementoDOM;
    this.#esFinBucle = false;
  }

  /* Métodos públicos */
  reproducirEscena(escena) {
    let self = this;

    this.#elementoDOM.currentTime = escena.tInicio;
    this.#elementoDOM.play();

    let tFin = escena.tFin;

    return new Promise(function (cumplir, rechazar) {
      self.#elementoDOM.addEventListener('timeupdate', function timeupdate() {
        if (self.#elementoDOM.currentTime >= tFin) {
          self.#elementoDOM.pause();
          self.#elementoDOM.removeEventListener('timeupdate', timeupdate);
          cumplir();
        }
      });
    })
  }

  bucleEscena(escena) {
    let self = this;

    this.#elementoDOM.currentTime = escena.tInicio;
    this.#elementoDOM.play();

    let tFin = escena.tFin;

    return new Promise(function (cumplir, rechazar) {
      self.#elementoDOM.addEventListener('timeupdate', function timeupdate() {
        if (self.#elementoDOM.currentTime >= tFin) {
          if (self.#esFinBucle) {
            self.#elementoDOM.removeEventListener('timeupdate', timeupdate);
            cumplir();
          } else {
            self.#elementoDOM.currentTime = escena.tInicio;
          }
        }
      });
    });
  }

  indicarFinalizacionBucle() {
    this.#esFinBucle = true;
  }
}

export { VideoClip }