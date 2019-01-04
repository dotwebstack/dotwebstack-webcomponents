import { Quad } from 'rdf-js';
import QuadCollector from './QuadCollector';
import ResponseReader from './ResponseReader';
import Parser from './JsonLdProcessor';

export default class QuadLoader {

  parser!: Parser;

  loadFromUrl = async (url: string): Promise<Quad[]> => {
    const response = await fetch(url, {
      headers: {
        Accept: 'application/ld+json',
      },
    });

    return new Promise<Quad[]>((resolve) => {
      this.parser = new Parser(new ResponseReader(response))
        .pipe(new QuadCollector(resolve));
    });
  }
}
