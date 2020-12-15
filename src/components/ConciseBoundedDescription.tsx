import React, { FunctionComponent, useState } from 'react';
import { NamedNode, BlankNode } from 'rdf-js';
import Store from '../lib/Store';
import Resource, { Row } from './Resource';
import { foaf } from '../vocab';
import { ValueProps } from './Value';
import InlineResource from './InlineResource';
import i18next from '../i18n';

type OptionalResource = NamedNode | BlankNode | null;

type Props = {
  store: Store;
  primaryTopic?: NamedNode;
  determinePrimaryTopic?: (store: Store) => OptionalResource;
  informationResource?: NamedNode;
  determineInformationResource?: (store: Store, primaryTopic: OptionalResource) => OptionalResource;
  resourceProps?: ResourceProps;
  prefixes?: any;
  informationResourceCollapsedRows?: Row[]
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
  renderHeading?: boolean;
};

const defaultDeterminePrimaryTopic = (store: Store) => {
  const primaryTopics = store.filter(null, foaf.isPrimaryTopicOf, null).subjects();
  if (primaryTopics.length > 1) {
    throw new Error(`found ${primaryTopics.length} primary topics; expected at most 1`);
  }
  return primaryTopics.length ? primaryTopics[0] : null;
};

const defaultDetermineInformationResource = (store: Store, primaryTopic: OptionalResource) => {
  if (!primaryTopic) {
    return null;
  }
  const informationResources = store.filter(primaryTopic, foaf.isPrimaryTopicOf, null).objects();
  if (informationResources.length > 1) {
    throw new Error(`found ${informationResources.length} information resources; expected at most 1`);
  }
  const informationResource = informationResources[0];
  if (informationResource.termType === 'Literal') {
    throw new Error(
      `information resource is a ${informationResource.termType}, but expected a NamedNode or BlankNode`);
  }
  return informationResource as NamedNode | BlankNode;
};

const determineOtherResources = (store: Store, exclude: OptionalResource[]) => {
  const isIncluded = (resource: NamedNode | BlankNode): boolean =>
    exclude.filter(excluded => excluded && excluded.equals(resource)).length === 0;
  return store.subjects().filter(isIncluded);
};

const ConciseBoundedDescription: FunctionComponent<Props> = ({ store, primaryTopic,
  determinePrimaryTopic = defaultDeterminePrimaryTopic, informationResource,
  determineInformationResource = defaultDetermineInformationResource, resourceProps, prefixes,
  informationResourceCollapsedRows = [] }) => {

  const effectivePrimaryTopic = primaryTopic ?? determinePrimaryTopic(store);
  const effectiveInformationResource = informationResource
    ?? determineInformationResource(store, effectivePrimaryTopic);
  const otherResources = determineOtherResources(store, [effectivePrimaryTopic, effectiveInformationResource]);

  const InformationResource: FunctionComponent<{ resource: NamedNode | BlankNode }> = ({ resource }) => {

    const [isOpen, setOpen] = useState(false);
    const toggleOpen = (e: any) => {
      e.preventDefault();
      setOpen(!isOpen);
    };

    const resourceType = i18next.t('informationResourceType');
    const expand = i18next.t('expandButtonTitle');
    const collapse = i18next.t('collapseButtonTitle');
    return (
      <div className="information-resource-container" style={{ position: 'relative' }}>
        <a
          href="#"
          title={isOpen ? collapse : expand}
          className="expand-collapse-information-resource"
          onClick={toggleOpen}
          style={{
            textDecoration: 'none',
            width: '1.7em',
            lineHeight: '1.7em',
            textAlign: 'center',
            fontSize: '1.4em',
            position: 'absolute',
            right: 0,
            top: 0,
            zIndex: 100,
          }}>
            {isOpen ? <>&and;</> : <>&or;</>}
        </a>
        {isOpen ? (
          <div className="information-resource">
            <Resource
              store={store}
              resourceIri={resource}
              showAllProperties
              disableAutoLabel
              disableLegacyFormatting
              hideEmptyProperties
              renderHeading
              resourceType={resourceType}
              className="initial-highlight"
              prefixes={prefixes}
              {...resourceProps}
            />
          </div>
        ) : (
          <div className="resource-container border information-resource-collapsed" style={{
            marginBottom: '1.5em',
            padding: '0.75em',
            fontSize: '0.9em',
            lineHeight: '1.7em',
          }}>
            <span className="resource-type" style={{ marginRight: '0.7em' }}>«{resourceType}»</span>
            <InlineResource
              store={store}
              resource={resource}
              propertyRows={informationResourceCollapsedRows}
              prefixes={prefixes}
              valueSeparator={() => <span>, </span>}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {effectiveInformationResource && (
        <InformationResource resource={effectiveInformationResource} />
      )}
      {effectivePrimaryTopic && (
        <Resource
          store={store}
          resourceIri={effectivePrimaryTopic}
          showAllProperties
          disableAutoLabel
          disableLegacyFormatting
          hideEmptyProperties
          renderHeading
          resourceType={i18next.t('primaryTopicType')}
          prefixes={prefixes}
          {...resourceProps}
        />
      )}
      {otherResources.map((resource: NamedNode | BlankNode) => (
        <Resource key={resource.value}
          store={store}
          resourceIri={resource}
          showAllProperties
          disableAutoLabel
          disableLegacyFormatting
          hideEmptyProperties
          renderHeading
          prefixes={prefixes}
          {...resourceProps}
        />
      ))}
    </>
  );
};

export default ConciseBoundedDescription;
