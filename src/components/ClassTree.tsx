import { Term } from 'rdf-js';
import Store from '../lib/Store';
import React from 'react';
import { namedNode } from '@rdfjs/data-model';
import { RDFS } from '../namespaces';
import { compareTerm, isNamedNode, localName } from '../utils';
import TreeView from 'react-treeview';

require('react-treeview/react-treeview.css');

type Props = {
  classIris: Term[],
  store: Store,
};

const leafStyling = {
  paddingLeft: '1.3em',
};

const findSubClassIris = (classIri: Term, store: Store): Term[] =>
  store
    .findSubjects(namedNode(RDFS + 'subClassOf'), classIri)
    .filter(isNamedNode);

const findSuperClassIris = (classIri: Term, store: Store): Term[] =>
  store
    .findObjects(classIri, namedNode(RDFS + 'subClassOf'))
    .filter(isNamedNode);

const getParents = (classIris: Term[], store: Store): Term[] =>
  classIris.filter(node => findSuperClassIris(node, store).length === 0);

const drawTree = (parents: Term[], store: Store): any => {
  return parents.map((child, i) => {
    const children = findSubClassIris(child, store).sort(compareTerm);
    if (children.length > 0) {
      const label2 = <span className="node">{localName(child)}</span>;
      return <a href={'#' + localName(child)} title={localName(child)}>
        <TreeView key={child + '|' + i} nodeLabel={label2} defaultCollapsed={false}>
          {drawTree(children, store)}
        </TreeView>
      </a>;
    }
    return <a href={'#' + localName(child)} title={localName(child)}>
      <div className="info" style={leafStyling}>{localName(child)}</div></a>;
  });
};

const ClassTree: React.StatelessComponent<Props> = ({ classIris, store }) => {
  const parents = getParents(classIris, store);
  return drawTree(parents, store);
};
export default ClassTree;
