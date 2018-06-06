import React from 'react';
import { Table } from 'reactstrap';
import Quad from '../../model/Quad';

export interface Props {
  readonly clazzes : any;
}

const ClassList: React.StatelessComponent<Props> = ({ clazzes }) => (
  <section>
    {Object.keys(clazzes).map((key: string) => (
      clazzes[key].map((clazz: Quad) => (
      <div key={ clazzes[key].indexOf(clazz) } className="block">
        <div className="block-intro">
          <h2>{ clazz.subject.value }</h2>
          <a href={ clazz.subject.value }>{ clazz.subject.value}</a>
          <div><p>graph:{ clazz.graph.value }</p></div>
          <div><p>predicate:{ clazz.predicate.value }</p></div>
          <div><p>object:{ clazz.object.value }</p></div>
        </div>
        <div className="block-content">
          <Table></Table>
          <div className="panel-group"></div>
        </div>
      </div>
      ))))}
  </section>
);

export default ClassList;
