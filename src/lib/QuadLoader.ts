
import { Quad } from 'rdf-js';
import JsonLdParser from 'rdf-parser-jsonld';
import QuadCollector from './QuadCollector';
import ResponseReader from './ResponseReader';

export default class QuadLoader {
  parser = new JsonLdParser();

  loadFromUrl = async (url: string): Promise<Quad[]> => {
    const response = await fetch(url, {
      headers: {
        Accept: 'application/ld+json',
      },
    });

    return new Promise<Quad[]>((resolve) => {
      this.parser
        .import(new ResponseReader(response))
        .pipe(new QuadCollector(resolve));
    });
  }
}
