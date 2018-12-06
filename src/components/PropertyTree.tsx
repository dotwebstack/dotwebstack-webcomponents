import React from 'react';
import { Term } from 'rdf-js';
import Store from '../lib/Store';
import { namedNode } from '@rdfjs/data-model';
import { RDFS } from '../namespaces';
import { compareTerm, isLocal, localName } from '../utils';
import TreeView from 'react-treeview';
import Label from './Label';

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
      const label = (
        <a href={isLocal(child, propertyIris) ? `#${localName(child)}` : child.value} title={child.value}>
          <span className="node">
            <Label store={store} resourceIri={child}/>
          </span>
        </a>);

      return (
        <TreeView nodeLabel={label} key={child + '|' + i} defaultCollapsed={collapsed}>
          {buildTree(children, store, propertyIris, true)}
        </TreeView>
      );
    }

    return (
      <a href={isLocal(child, propertyIris) ? `#${localName(child)}` : child.value}
         key={child + '|' + i} title={child.value}>
        <span style={leafStyling}>{localName(child)}</span>
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
