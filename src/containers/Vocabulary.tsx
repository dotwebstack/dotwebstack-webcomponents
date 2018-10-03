import React from 'react';
import { NamedNode, Term } from 'rdf-js';
import { namedNode } from 'rdf-data-model';
// @ts-ignore Ignore because Ramda type definitions are not up-to-date
import { innerJoin } from 'ramda';
import { GraphContextProps } from '..';
import ClassList from '../components/ClassList';
import PropertyList from '../components/PropertyList';
import ListIndex from '../components/ListIndex';
import { OWL, RDF, RDFS } from '../namespaces';
import { compareTerm } from '../utils';
import i18n from '../i18n';

type Props = {
  ontology: NamedNode,
} & GraphContextProps;

const Vocabulary: React.StatelessComponent<Props> = ({ ontology, store }) => {
  const ontologyIris = store.findSubjects(namedNode(RDFS + 'isDefinedBy'), ontology);

  const allClassIris = store
    .findSubjects(namedNode(RDF + 'type'), [
      namedNode(RDFS + 'Class'),
      namedNode(OWL + 'Class'),
    ]);

  const classIris = innerJoin(
    (a: Term, b: Term) => a.equals(b),
    allClassIris,
    ontologyIris,
  ).sort(compareTerm);

  const allPropertyIris = store
    .findSubjects(namedNode(RDF + 'type'), [
      namedNode(RDF + 'Property'),
      namedNode(OWL + 'DatatypeProperty'),
      namedNode(OWL + 'ObjectProperty'),
    ]);

  const propertyIris = innerJoin(
    (a: Term, b: Term) => a.equals(b),
    allPropertyIris,
    ontologyIris,
  ).sort(compareTerm);

  return (
    <div className="row">
      <div className="col-md-3">
        <section>
          <h2>{i18n.t('klassen')}</h2>
          <ListIndex resourceIris={classIris} />
        </section>
        <section>
          <h2>{i18n.t('eigenschappen')}</h2>
          <ListIndex resourceIris={propertyIris} />
        </section>
      </div>
      <div className="col-md-9">
        <section>
          <ClassList
            classIris={classIris}
            store={store}
          />
        </section>
        <section>
          <PropertyList
            propertyIris={propertyIris}
            store={store}
          />
        </section>
      </div>
    </div>
  );
};

export default Vocabulary;
