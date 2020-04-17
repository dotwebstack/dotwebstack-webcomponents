import { Duplex } from 'stream';
import { DatasetCore, NamedNode } from 'rdf-js';

export interface FastDataset extends Duplex, DatasetCore {}

export type Prefix = {
  [localName: string]: NamedNode;
};
