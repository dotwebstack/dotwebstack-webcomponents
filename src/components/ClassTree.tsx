import { Term } from 'rdf-js';
import Store from '../lib/Store';
import React from 'react';
import { compareTerm, isLocal, localName } from '../utils';
import TreeView from 'react-treeview';
import Label from './Label';

require('react-treeview/react-treeview.css');

type Props = {
  classIris: Term[],
  store: Store,
};

const leafStyling = {
  marginLeft: '20px',
  display: 'block',
};

const buildTree = (parents: Term[], store: Store, classIris: Term[], collapsed: boolean): any => {
  return parents.map((child, i) => {
    const children = store.findSubIris(child, 'subClassOf').sort(compareTerm);

    if (children.length > 0) {
      const label = (
        <a href={isLocal(child, classIris) ? `#${localName(child)}` : child.value} title={child.value}>
          <span className="node">
            <Label store={store} resourceIri={child}/>
          </span>
        </a>
      );

      return (
        <TreeView nodeLabel={label} key={child + '|' + i} defaultCollapsed={collapsed}>
          {buildTree(children, store, classIris, true)}
        </TreeView>
      );
    }

    return (
      <a href={isLocal(child, classIris) ? `#${localName(child)}` : child.value}
         key={child + '|' + i} title={child.value}>
        <span style={leafStyling}>
          <Label store={store} resourceIri={child}/>
        </span>
      </a>
    );
  });
};

const ClassTree: React.StatelessComponent<Props> = ({ classIris, store }) => {
  try {
    const parents = store.findRoots(classIris, [], 'subClassOf');
    return buildTree(parents, store, classIris, false);
  } catch (e) {
    return (
      <p>Something went wrong</p>
    );
  }
};
export default ClassTree;
