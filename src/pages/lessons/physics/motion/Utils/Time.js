// current time
// elapsed time
// delta time between frames

import EventEmitter from "./EventEmitter";

export default class Time extends EventEmitter {
  constructor() {
    super();

    // when everything began
    this.start = Date.now();
    // current timestamp
    this.current = this.start;
    // time elapsed since everything began
    this.elapsed = 0;
    // delta time between two frames
    this.delta = 16; // approximation for 60fps screens. Don't put 0 here - bugs.

    // waiting one frame before calling the tick
    window.requestAnimationFrame(() => this.tick());
  }

  tick() {
    const currentTime = Date.now();
    this.delta = currentTime - this.current;
    this.current = currentTime;
    this.elapsed = this.current - this.start;
    this.trigger("tick");
    window.requestAnimationFrame(() => this.tick());
  }
}