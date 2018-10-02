import { Quad } from 'rdf-js';
import { Writable } from 'stream';

class QuadCollector extends Writable {
  quads: Quad[] = [];

  constructor(onFinish: (quads: Quad[]) => void) {
    super({ objectMode: true });
    this.on('finish', () => onFinish(this.quads));
  }

  // tslint:disable-next-line:function-name
  _write(quad: Quad, {}, callback: (err?: Error) => void) {
    this.quads = [
      ...this.quads,
      quad,
    ];

    callback();
  }
}

export default QuadCollector;
