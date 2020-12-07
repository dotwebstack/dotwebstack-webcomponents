import { Quad } from 'rdf-js';
import JsonLdParser from '@rdfjs/parser-jsonld';
import QuadCollector from './QuadCollector';
import ResponseReader from './ResponseReader';
import { Readable } from 'stream';

export const loadFromObject = (value: any) => {
  const loader = new QuadLoader();
  const json = JSON.stringify(value);
  return loader.loadFromString(json);
};

export default class QuadLoader {
  parser = new JsonLdParser();

  loadFromString = (value: string): Promise<Quad[]> => {
    const input = new Readable({
      read: () => {
        input.push(value);
        input.push(null);
      },
    });

    return new Promise<Quad[]>((resolve) => {
      this.parser
        .import(input)
        .pipe(new QuadCollector(resolve));
    });
  }

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
