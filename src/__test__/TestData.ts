import { namedNode, quad } from '@rdfjs/data-model';
import { RDFS } from '../namespaces';

export const objectTest1 = namedNode('http://example.org/test1');
export const objectTest2 = namedNode('http://example.org/test2');

export const quadTree1 = quad(objectTest1, namedNode(RDFS + 'subPropertyOf'), objectTest2);

export const quadTree2 = quad(objectTest2,
                              namedNode(RDFS + 'subPropertyOf'), namedNode('http://example.org/test3'));

export const quadTree3 = quad(namedNode('http://example.org/test3'),
                              namedNode(RDFS + 'subPropertyOf'), namedNode('http://example.org/test4'));

export const quadTree4 = quad(objectTest1,
                              namedNode(RDFS + 'subPropertyOf'), namedNode('http://example.org/test3'));

export const quadTree5 = quad(objectTest1,
                              namedNode(RDFS + 'subPropertyOf'), namedNode('http://example.org/test6'));

export const quadTree6 = quad(objectTest1, namedNode(RDFS + 'subClassOf'), objectTest2);

export const quadTree7 = quad(objectTest2,
                              namedNode(RDFS + 'subClassOf'), namedNode('http://example.org/test3'));

export const quadTree8 = quad(namedNode('http://example.org/test3'),
                              namedNode(RDFS + 'subClassOf'), namedNode('http://example.org/test4'));

export const quadTree9 = quad(objectTest1,
                              namedNode(RDFS + 'subClassOf'), namedNode('http://example.org/test3'));

export const quadTree10 = quad(objectTest1,
                               namedNode(RDFS + 'subClassOf'), namedNode('http://example.org/test6'));

export const quadTreeLoop1 = quad(objectTest1,
                                  namedNode(RDFS + 'subClassOf'), namedNode('http://example.org/test3'));

export const quadTreeLoop2 = quad(objectTest1,
                                  namedNode(RDFS + 'subClassOf'), namedNode('http://example.org/test4'));

export const quadTreeLoop3 = quad(namedNode('http://example.org/test3'),
                                  namedNode(RDFS + 'subClassOf'), namedNode('http://example.org/test4'));

export const quadTreeLoop4 = quad(namedNode('http://example.org/test4'),
                                  namedNode(RDFS + 'subClassOf'), namedNode('http://example.org/test3'));

export const quadTreeLoop5 = quad(objectTest1,
                                  namedNode(RDFS + 'subPropertyOf'), namedNode('http://example.org/test3'));

export const quadTreeLoop6 = quad(objectTest1,
                                  namedNode(RDFS + 'subPropertyOf'), namedNode('http://example.org/test4'));

export const quadTreeLoop7 = quad(namedNode('http://example.org/test3'),
                                  namedNode(RDFS + 'subPropertyOf'), namedNode('http://example.org/test4'));

export const quadTreeLoop8 = quad(namedNode('http://example.org/test4'),
                                  namedNode(RDFS + 'subPropertyOf'), namedNode('http://example.org/test3'));
