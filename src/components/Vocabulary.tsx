import React from 'react';
import { namedNode } from '@rdfjs/data-model';
// @ts-ignore Ignore because Ramda type definitions are not up-to-date
import { innerJoin } from 'ramda';
import Store from '../lib/Store';
import ClassList from './ClassList';
import PropertyList from './PropertyList';
import ListIndex from './ListIndex';
import { OWL, RDF, RDFS } from '../namespaces';
import { compareTerm } from '../utils';
import i18next from '../i18n';
import ClassTree from './ClassTree';
import PropertyTree from './PropertyTree';

type Props = {
  store: Store,
};

const Vocabulary: React.StatelessComponent<Props> = ({ store }) => {
  const classIris = store
    .findSubjects(namedNode(RDF + 'type'), [
      namedNode(RDFS + 'Class'),
      namedNode(OWL + 'Class'),
    ])
    .sort(compareTerm);

  const propertyIris = store
    .findSubjects(namedNode(RDF + 'type'), [
      namedNode(RDF + 'Property'),
      namedNode(OWL + 'DatatypeProperty'),
      namedNode(OWL + 'ObjectProperty'),
    ])
    .sort(compareTerm);

  return (
    <div>
      <div className="row tree-section">
        <div className="col-md-6">
          <section>
            <h2>{i18next.t('classes')}</h2>
            <ClassTree
              store={store}
              classIris={classIris}
            />
          </section>
        </div>
        <div className="col-md-6">
          <section>
            <h2>{i18next.t('properties')}</h2>
            <PropertyTree
              store={store}
              propertyIris={propertyIris}
            />
          </section>
        </div>
      </div>
      <div className="row">
        <div className="col-md-3">
          <section>
            <h2>{i18next.t('classes')}</h2>
            <ListIndex resourceIris={classIris}/>
          </section>
          <section>
            <h2>{i18next.t('properties')}</h2>
            <ListIndex resourceIris={propertyIris}/>
          </section>
        </div>
        <div className="col-md-9">
          <section>
            <ClassList
              classIris={classIris}
              propertyIris={propertyIris}
              store={store}
            />
          </section>
          <section>
            <PropertyList
              propertyIris={propertyIris}
              classIris={classIris}
              store={store}
            />
          </section>
        </div>
      </div>
    </div>
  );
};

export default Vocabulary;
