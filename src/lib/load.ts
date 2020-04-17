import { JsonLdParser } from 'jsonld-streaming-parser';
// @ts-ignore
import dataset from '@graphy/memory.dataset.fast';
import { FastDataset } from './model';

const load = (src: string): Promise<FastDataset> => {
  const scriptElement = document.querySelector(src);

  if (scriptElement === null) {
    throw new Error('Element not found.');
  }

  const store: FastDataset = dataset();
  const parser = new JsonLdParser();

  return new Promise((resolve, reject) => {
    parser
      .pipe(store)
      .on('error', reject)
      .on('finish', () => resolve(store));

    parser.write(scriptElement.innerHTML);
    parser.end();
  });
};

export default load;
