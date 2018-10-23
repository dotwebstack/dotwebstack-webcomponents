import React from 'react';
import { Term } from 'rdf-js';
import Store from '../lib/Store';
import { namedNode } from '@rdfjs/data-model';
import { RDFS } from '../namespaces';
import { compareTerm, getUrl, isUnique, localName } from '../utils';
import TreeView from 'react-treeview';

require('react-treeview/react-treeview.css');

type Props = {
  propertyIris: Term[],
  store: Store,
};

const leafStyling = {
  paddingLeft: '1.3em',
};

const findSuperPropertyIris = (propertyIri: Term, store: Store): Term[] =>
  store.findObjects(propertyIri, namedNode(RDFS + 'subPropertyOf'));

const findSubPropertyIris = (propertyIri: Term, store: Store): Term[] =>
  store.findSubjects(namedNode(RDFS + 'subPropertyOf'), propertyIri);

const getParents = (propertyIris: Term[], parentsIris: Term[], store: Store): Term[] => {
  propertyIris.forEach((propertyIri) => {
    const superProperties = findSuperPropertyIris(propertyIri, store);
    if (superProperties.length === 0 && isUnique(propertyIri, parentsIris)) {
      parentsIris.push(propertyIri);
    } else {
      getParents(superProperties, parentsIris, store);
    }
  });
  return parentsIris;
};

const buildTree = (parents: Term[], store: Store, propertyIris: Term[]): any => {
  return parents.map((child, i) => {
    const children = findSubPropertyIris(child, store).sort(compareTerm);
    if (children.length > 0) {
      const label2 = <a href={getUrl(child, propertyIris)} title={localName(child)}>
        <span className="node">{localName(child)}</span></a>;
      return <TreeView nodeLabel={label2} key={child + '|' + i} defaultCollapsed={false}>
          {buildTree(children, store, propertyIris)}
        </TreeView>;
    }
    return <a href={getUrl(child, propertyIris)} key={child + '|' + i} title={localName(child)}>
      <div className="info" style={leafStyling}>{localName(child)}</div></a>;
  });
};

const PropertyTree: React.StatelessComponent<Props> = ({ propertyIris, store }) => {
  const parents: Term[] = getParents(propertyIris, [], store);
  return buildTree(parents, store, propertyIris);
};
export default PropertyTree;
