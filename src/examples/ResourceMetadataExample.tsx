import { namedNode } from '@rdfjs/data-model';
import { Label, GraphContext } from '..';
import React from 'react';
import Resource from '../components/Resource';
import { Term } from 'rdf-js';

const endpoint = 'https://regelgeving.omgevingswet.overheid.nl/id/dataset/VNGBegrippenkaderGemeenten';
const resourceIri = namedNode('http://regelgeving.omgevingswet.overheid.nl/id/dataset/VNGBegrippenkaderGemeenten');
const rows = [
  {
    predicate: namedNode('http://www.w3.org/2000/01/rdf-schema#isDefinedBy'),
    label: 'Is defined by',
  },
  {
    predicate: namedNode('http://www.w3.org/2000/01/rdf-schema#label'),
    label: 'Label',
  },
  {
    predicate: namedNode('http://www.w3.org/1999/02/22-rdf-syntax-ns#type'),
    label: 'Type',
  },
  {
    predicate: namedNode('http://purl.org/dc/terms/subject'),
    label: 'Subject',
    customRender: (terms: Term[]) => {
      return <span>{terms.length}</span>;
    },
  },
  {
    predicate: namedNode('http://xmlns.com/foaf/0.1/isPrimaryTopicOf'),
    label: 'Metadata',
  },
];

const metadataRows = [
  {
    predicate: namedNode('http://www.w3.org/ns/adms#status'),
    label: 'Status',
  },
  {
    predicate: namedNode('http://dublincore.org/documents/2006/04/10/dcmi-period/start'),
    label: 'Start',
  },
  {
    predicate: namedNode('http://dublincore.org/documents/2006/04/10/dcmi-period/end'),
    label: 'End',
  },
  {
    predicate: namedNode('http://purl.org/dc/terms/subject'),
    label: 'Subject',
  },
  {
    predicate: namedNode('http://xmlns.com/foaf/0.1/isPrimaryTopicOf'),
    label: 'Metadata',
  },
];


export default () => {

  const renderMetadata = (metadataIris: Term[]) => {
    if (metadataIris.length > 0) {
    return (
      <GraphContext 
      key= {metadataIris[0].value}
      src={metadataIris[0].value} >
      {store2 => (
      <section className="mt-4">
      <Resource
      key={metadataIris[0].value}
        store={store2}
        resourceIri={metadataIris[0]}
        rows={metadataRows}
      />
    </section>
      )}
      </GraphContext>
    )
      }
      return null;
  }

  return (
  <GraphContext key={endpoint} src={endpoint}>
    {store => {
      const metadataIris =store.findObjects(resourceIri, namedNode('http://xmlns.com/foaf/0.1/isPrimaryTopicOf'));
      return (
      <div>
        <h1><Label store={store} resourceIri={resourceIri} /></h1>
        <p>{resourceIri.value}</p>
        <section className="mt-4">
          <Resource
          key={resourceIri.value}
            store={store}
            resourceIri={resourceIri}
            rows={rows}
          />
        </section>
        {renderMetadata(metadataIris)}
      </div>
    )}}
  </GraphContext>
)};
