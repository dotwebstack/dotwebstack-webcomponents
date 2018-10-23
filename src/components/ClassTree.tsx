import { Term } from 'rdf-js';
import Store from '../lib/Store';
import React from 'react';
import { compareTerm, getUrl, localName } from '../utils';
import TreeView from 'react-treeview';

require('react-treeview/react-treeview.css');

type Props = {
  classIris: Term[],
  store: Store,
};

const leafStyling = {
  paddingLeft: '1.3em',
};

const buildTree = (parents: Term[], store: Store, classIris: Term[]): any => {
  return parents.map((child, i) => {
    const children = store.findSubIris(child, 'subClassOf').sort(compareTerm);
    if (children.length > 0) {
      const label2 = <a href={getUrl(child, classIris)} title={localName(child)}>
        <span className="node">{localName(child)}</span>
      </a>;
      return <TreeView nodeLabel={label2} key={child + '|' + i} defaultCollapsed={false}>
          {buildTree(children, store, classIris)}
        </TreeView>;
    }
    return <a href={getUrl(child, classIris)} key={child + '|' + i} title={localName(child)}>
      <div className="info" style={leafStyling}>{localName(child)}</div>
    </a>;
  });
};

const ClassTree: React.StatelessComponent<Props> = ({ classIris, store }) => {
  const parents = store.findRoots(classIris, [], 'subClassOf');
  return buildTree(parents, store, classIris);
};
export default ClassTree;
