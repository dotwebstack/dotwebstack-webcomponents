import { Term } from 'rdf-js';
import Store from '../lib/Store';
import React from 'react';
import { compareTerm, getUrl, localName } from '../utils';
import TreeView from 'react-treeview';
import LabelComponent from './LabelComponent';

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
      const label2 = <a href={getUrl(child, classIris)} title={localName(child)}>
        <span className="node">
          <LabelComponent store={store} resourceIri={child}/>
        </span>
      </a>;
      return (
        <TreeView nodeLabel={label2} key={child + '|' + i} defaultCollapsed={collapsed}>
          {buildTree(children, store, classIris, true)}
        </TreeView>
      );
    }
    return (
      <a href={getUrl(child, classIris)} key={child + '|' + i} title={localName(child)}>
        <span style={leafStyling}>
          <LabelComponent store={store} resourceIri={child}/>
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
