import React from 'react';
import { Table } from 'reactstrap';

export interface Props {
  readonly clazz : any;
}

const ClassList: React.StatelessComponent<Props> = (props) => {
  const { clazz } = props;

  return (
    <section>
        <div className="block">
          <div className="block-intro">
            <h2>{clazz.title}</h2>
            <a href={clazz.link}>{clazz.link}</a>
            <div className="wysiwyg">
              <p>
                {clazz.definition}
              </p>
              <p>
                {clazz.subject}
              </p>
            </div>
          </div>
          <div className="block-content">
            <Table></Table>
            <div className="panel-group"></div>
          </div>
        </div>
    </section>
  );
};

export default ClassList;
