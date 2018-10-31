import React from 'react';
import { Term } from 'rdf-js';
import Store from '../lib/Store';
import { namedNode } from '@rdfjs/data-model';
import { RDFS } from '../namespaces';
import { compareTerm, isLocal, localName } from '../utils';
import TreeView from 'react-treeview';
import LabelComponent from './LabelComponent';

require('react-treeview/react-treeview.css');

type Props = {
  propertyIris: Term[],
  store: Store,
};

const leafStyling = {
  marginLeft: '20px',
  display: 'block',
};

const buildTree = (parents: Term[], store: Store, propertyIris: Term[], collapsed: boolean): any => {
  return parents.map((child, i) => {
    const children = store.findSubjects(namedNode(RDFS + 'subPropertyOf'), child).sort(compareTerm);
    if (children.length > 0) {
      const label2 = <a href={getUrl(child, propertyIris)} title={localName(child)}>
        <span className="node">
          <LabelComponent store={store} resourceIri={child}/>
        </span>
      </a>;
      return (
        <TreeView nodeLabel={label2} key={child + '|' + i} defaultCollapsed={collapsed}>
          {buildTree(children, store, propertyIris, true)}
        </TreeView>
      );
    }
    return (
      <a href={getUrl(child, propertyIris)} key={child + '|' + i} title={localName(child)}>
        <span style={leafStyling}>
          <LabelComponent store={store} resourceIri={child}/>
        </span>
      </a>
    );
  });
};

const PropertyTree: React.StatelessComponent<Props> = ({ propertyIris, store }) => {
  try {
    const parents: Term[] = store.findRoots(propertyIris, [], 'subPropertyOf');
    return buildTree(parents, store, propertyIris, false);
  } catch (e) {
    return (
      <p>Something went wrong</p>
    );
  }
};
export default PropertyTree;
