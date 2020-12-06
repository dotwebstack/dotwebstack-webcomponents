import React, { FunctionComponent, Fragment } from 'react';
import { NamedNode, BlankNode } from 'rdf-js';
// import { namedNode } from '@rdfjs/data-model';
import Store from '../lib/Store';
import Resource, { Row } from './Resource';
// import { defaultPrefixes, RDFS } from '../namespaces';
import { foaf } from '../vocab';
import { ValueProps } from './Value';

// TODO consider if multiple graphs in the store should have any effect.
//      right now, the assumption is we have only 1 information resource
//      and only 1 primary topic in the store.

type Props = {
  store: Store;
  primaryTopic?: NamedNode;
  determinePrimaryTopic?: (store: Store) => NamedNode;
  informationResource?: NamedNode;
  determineInformationResource?: (store: Store, primaryTopic: NamedNode | BlankNode) => NamedNode | BlankNode;
  resourceProps?: ResourceProps;
};

// subset of Resource.Props
type ResourceProps = {
  rows?: Row[];
  valueProps?: ValueProps;
  hideEmptyProperties?: boolean;
  showAllProperties?: boolean;
  formatPredicate?: (predicate: string, inverse: boolean, shorten: (resource: string) => string) => string | null;
  includeProperty?: (predicate: string, inverse: boolean) => boolean;
  disableAutoLabel?: boolean;
  disableLegacyFormatting?: boolean,
  prefixes?: any;
};

const defaultDeterminePrimaryTopic = (store: Store) => {
  const primaryTopics = store.filter(null, foaf.isPrimaryTopicOf, null).subjects();
  if (primaryTopics.length !== 1) {
    throw new Error(`found ${primaryTopics.length} primary topics; expected exactly 1`);
  }
  return primaryTopics[0];
};

// TODO it's ok if we do not find any, i suppose....
const defaultDetermineInformationResource = (store: Store, primaryTopic: NamedNode | BlankNode) => {
  const informationResources = store.filter(primaryTopic, foaf.isPrimaryTopicOf, null).objects();
  if (informationResources.length !== 1) {
    throw new Error(`found ${informationResources.length} information resources; expected exactly 1`);
  }
  const informationResource = informationResources[0];
  if (informationResource.termType === 'Literal') {
    throw new Error(
      `information resource is a ${informationResource.termType}, but expected a NamedNode or BlankNode`);
  }
  return informationResource as NamedNode | BlankNode;
};

const determineOtherResources = (store: Store, exclude: (NamedNode | BlankNode)[]) => {
  const isIncluded = (resource: NamedNode | BlankNode): boolean =>
    exclude.filter(excluded => excluded.equals(resource)).length === 0;
  return store.subjects().filter(isIncluded);
};

const ConciseBoundedDescription: FunctionComponent<Props> = ({ store, primaryTopic,
  determinePrimaryTopic = defaultDeterminePrimaryTopic, informationResource,
  determineInformationResource = defaultDetermineInformationResource, resourceProps }) => {

  // TODO or determine the information resource first? what's more natural/common?
  const effectivePrimaryTopic = primaryTopic ?? determinePrimaryTopic(store);
  const effectiveInformationResource = informationResource
    ?? determineInformationResource(store, effectivePrimaryTopic);
  const otherResources = determineOtherResources(store, [effectivePrimaryTopic, effectiveInformationResource]);

  return (
    <div>
      <h2>Information resource: {effectiveInformationResource.value}</h2>
      <Resource
        store={store}
        resourceIri={effectiveInformationResource}
        showAllProperties
        disableAutoLabel
        disableLegacyFormatting
        {...resourceProps}
      />
      <h2>Primary topic: {effectivePrimaryTopic.value}</h2>
      <Resource
        store={store}
        resourceIri={effectivePrimaryTopic}
        showAllProperties
        disableAutoLabel
        disableLegacyFormatting
        {...resourceProps}
      />
      {otherResources.map((resource: NamedNode | BlankNode) => (
        <Fragment key={resource.value}>
          <h3>Other resource: {resource.value}</h3>
          <Resource
            store={store}
            resourceIri={resource}
            showAllProperties
            disableAutoLabel
            disableLegacyFormatting
            {...resourceProps}
          />
        </Fragment>
      ))}
    </div>
  );
};

export default ConciseBoundedDescription;
