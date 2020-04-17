import { last } from 'ramda';
import { Term } from 'rdf-js';

export const localName = (term: Term) => last(term.value.split(/[\#\/]/)) || term.value;
