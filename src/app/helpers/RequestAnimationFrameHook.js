

class RequestAnimationFrameHook {
  constructor() {
    let $this = this;

    //Inner array to take the listeneres
    this.listeneres = [];


    window.requestAnimationFrame(timestamp => {
      _step.apply($this, [timestamp])
    });
  }

  subscribe(ref, fn) {
    this.listeneres.push({
      'ref': ref,
      'fn': fn
    });
  }

  unsubscribe(ref) {
    let item = this.listeneres.filter(x => x.ref === ref).shift();

    if(item) {
      this.listeneres.splice(this.listeneres.indexOf(item), 1);
    }
  }
}

/**
 * Step function, called on each frame
 * @param timestamp
 * @private
 */
function _step(timestamp) {
  let $this = this;

  for(let listener of this.listeneres) {
    listener.fn.apply(listener.ref, [timestamp]);
  }

  window.requestAnimationFrame(timestamp => {
    _step.apply($this, [timestamp]);
  });
}

//Singleton mode
export const requestAnimationFrameHookInstance = new RequestAnimationFrameHook();