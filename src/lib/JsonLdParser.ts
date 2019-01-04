import ParserStream from './JsonLdProcessor';

const Sink = require('@rdfjs/sink');

class Parser extends Sink {
  constructor (options: any) {
    super(ParserStream, options);
  }
}

module.exports = Parser;
