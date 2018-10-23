import { Term } from 'rdf-js';
import Store from '../lib/Store';
import React from 'react';
import { namedNode } from '@rdfjs/data-model';
import { RDFS } from '../namespaces';
import { compareTerm, getUrl, isNamedNode, isUnique, localName } from '../utils';
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

const getParents = (classIris: Term[], parentsIris: Term[], store: Store): Term[] => {
  classIris.forEach((classIri) => {
    const superClasses = findSuperClassIris(classIri, store);
    if (superClasses.length === 0 && isUnique(classIri, parentsIris)) {
      parentsIris.push(classIri);
    } else {
      getParents(superClasses, parentsIris, store);
    }
  });
  return parentsIris;
};

const buildTree = (parents: Term[], store: Store, classIris: Term[]): any => {
  return parents.map((child, i) => {
    const children = findSubClassIris(child, store).sort(compareTerm);
    if (children.length > 0) {
      const label2 = <a href={getUrl(child, classIris)} title={localName(child)}>
        <span className="node">{localName(child)}</span></a>;
      return <TreeView nodeLabel={label2} key={child + '|' + i} defaultCollapsed={false}>
          {buildTree(children, store, classIris)}
        </TreeView>;
    }
    return <a href={getUrl(child, classIris)} key={child + '|' + i} title={localName(child)}>
      <div className="info" style={leafStyling}>{localName(child)}</div></a>;
  });
};

const ClassTree: React.StatelessComponent<Props> = ({ classIris, store }) => {
  const parents = getParents(classIris, [], store);
  return buildTree(parents, store, classIris);
};
export default ClassTree;
