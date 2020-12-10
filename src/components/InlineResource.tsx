import React, { FunctionComponent } from 'react';
import { NamedNode, Literal, BlankNode } from 'rdf-js';
import Store from '../lib/Store';
import PropertyStore from '../lib/PropertyStore';
import { ValueProps } from './Value';
import { Row, Property, PropertyValues } from './Resource';
import { mergePrefixMaps, applyPrefixes } from '../utils';
import { defaultPrefixes } from '../namespaces';
import { rdfs } from '../vocab';

type Props = {
  resource: NamedNode | BlankNode;
  store: Store;
  propertyRows: Row[];
  valueProps?: ValueProps;
  hideEmptyProperties?: boolean;
  formatPredicate?: (predicate: string, inverse: boolean, shorten: (resource: string) => string) => string | null;
  prefixes?: any;
  valueSeparator?: () => JSX.Element;
};

const InlineResource: FunctionComponent<Props> = ({ resource, store, propertyRows, valueProps,
  hideEmptyProperties, formatPredicate, prefixes, valueSeparator = () => null }) => {

  const getResourceLabels = (resource: NamedNode | BlankNode) => store.findObjects(resource, rdfs.label)
    .filter(o => o.termType === 'Literal').map(o => o as Literal);

  const propertyStore = new PropertyStore(resource as NamedNode | BlankNode, store);

  // create representation of specified properties, incl property values
  const properties = propertyStore.getPropertiesForRows(propertyRows || []);

  // create default predicate format function, incl iri shortening
  const effectivePrefixes = mergePrefixMaps(defaultPrefixes, prefixes);
  const shorten = (resource: string) => applyPrefixes(resource, effectivePrefixes);
  const defaultFormatPredicate = (predicate: string, inverse: boolean) => inverse
    ? `is ${shorten(predicate)} of`
    : shorten(predicate);

  // if custom format predicate function returns null, fall back to default implementation
  const effectiveFormatPredicate: (predicate: string, inverse: boolean) => string = formatPredicate
    ? ((p, i) => formatPredicate(p, i, shorten) || defaultFormatPredicate(p, i))
    : defaultFormatPredicate;

  const effectiveValueProps = {
    prefixes,
    getNamedNodeLabels: getResourceLabels,
    disableLegacyFormatting: true,
    ...valueProps,
  };

  const propertiesToRender = properties
    .filter(property => !hideEmptyProperties || property.values.length || property.customRender);
  const isLast = (index: number) => index + 1 === propertiesToRender.length;
  return (
    <>
      {propertiesToRender.map((property: Property, index: number) => {

        const isEmpty = property.values.length === 0;
        if (hideEmptyProperties && isEmpty && !property.customRender) {
          return null;
        }

        const { predicate, inverse } = property.path;
        return (
          <span key={index} className="inline-resource">
            <a href={predicate.value} style={{ fontWeight: 600 }}>
              {property.label ? property.label : effectiveFormatPredicate(predicate.value, inverse)}
            </a>:<span> </span>
            <PropertyValues
              property={property}
              valueProps={effectiveValueProps}
              appendBreak={false}
              separator={valueSeparator} />
            {!isLast(index) && <> &bull; </>}
          </span>
        );
      })}
    </>
  );
};

export default InlineResource;
