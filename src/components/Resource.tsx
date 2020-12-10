import React, { Fragment, FunctionComponent } from 'react';
import { NamedNode, Term, Literal, BlankNode } from 'rdf-js';
import Store from '../lib/Store';
import PropertyStore from '../lib/PropertyStore';
import Value, { ValueProps } from './Value';
import { mergePrefixMaps, applyPrefixes } from '../utils';
import { localName } from './Resource.utils';
import { defaultPrefixes } from '../namespaces';
import { rdfs } from '../vocab';
import i18next from '../i18n';

type Props = {
  resourceIri: Term;
  store: Store;
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
  resourceType?: string;
  className?: string;
};

export type Row = {
  predicate: NamedNode;
  inverse?: boolean;
  label?: string;
  customRender?: (terms: Term[]) => JSX.Element;
};

export type PropertyPath = {
  predicate: NamedNode;
  inverse: boolean;
};

export type Property = {
  path: PropertyPath;
  values: Term[];
  label?: string;
  customRender?: (terms: Term[]) => JSX.Element;
};

const otherPropertiesComparator = (a: Property, b: Property) => {

  // 1. sort by inverse/non-inverse properties (inverse properties last)
  const inverseComparison = (a.path.inverse ? 1 : 0) - (b.path.inverse ? 1 : 0);
  if (inverseComparison) {
    return inverseComparison;
  }

  // 2. sort by property predicate
  const predicateComparison = a.path.predicate.value.localeCompare(b.path.predicate.value);
  return predicateComparison;

};

type PropertyValuesProps = {
  property: Property;
  valueProps: ValueProps;
  appendBreak?: boolean;
  separator?: () => JSX.Element | null;
};

const PropertyValues: FunctionComponent<PropertyValuesProps> = ({ property, valueProps,
  appendBreak = true, separator = () => null }) => {

  const { values } = property;
  if (property.customRender) {
    return property.customRender(values);
  }
  if (values.length === 0) {
    return <span>-</span>;
  }
  const isLast = (index: number) => index + 1 === values.length;
  return (
    <>{values.map((value: Term, index: number) => (
      <Fragment key={index}>
        <Value
          term={value}
          {...valueProps} />
        {isLast(index) ? null : separator()}
        {appendBreak ? <br /> : null}
      </Fragment>
    ))}</>
  );
};
export { PropertyValues };

const createPredicateFormatter = (prefixes: any, disableAutoLabel: boolean, formatPredicate:
  ((predicate: string, inverse: boolean, shorten: (resource: string) => string) => string | null) | undefined) => {

  // create default predicate format function, incl iri shortening
  const effectivePrefixes = mergePrefixMaps(defaultPrefixes, prefixes);
  const shorten = (resource: string) => applyPrefixes(resource, effectivePrefixes);
  const createPredicateLabel: (predicate: string) => string = disableAutoLabel
    ? shorten
    : localName;
  const defaultFormatPredicate = (predicate: string, inverse: boolean) => inverse
    ? `is ${createPredicateLabel(predicate)} of`
    : createPredicateLabel(predicate);

  // if custom format predicate function returns null, fall back to default implementation
  const effectiveFormatPredicate: (predicate: string, inverse: boolean) => string = formatPredicate
    ? ((p, i) => formatPredicate(p, i, shorten) || defaultFormatPredicate(p, i))
    : defaultFormatPredicate;
  return effectiveFormatPredicate;
};

const Resource: FunctionComponent<Props> = ({ resourceIri, store, rows, valueProps, showAllProperties,
  formatPredicate, prefixes, includeProperty, disableAutoLabel = false, disableLegacyFormatting = false,
  hideEmptyProperties = false, renderHeading = false, resourceType, className = '' }) => {

  const getResourceLabels = (resourceIri: NamedNode) => store.findObjects(resourceIri, rdfs.label)
    .filter(o => o.termType === 'Literal').map(o => o as Literal);

  const propertyStore = new PropertyStore(resourceIri as NamedNode | BlankNode, store);

  // create representation of specified properties, incl property values
  const definedProperties = propertyStore.getPropertiesForRows(rows || []);

  // create representation of any other properties present in the data, if 'show all properties' is enabled.
  // if 'rows' is specified, the default for 'show all properties' is false; true otherwise
  let otherProperties: Property[] = [];
  if (showAllProperties === undefined ? !rows : showAllProperties) {

    const propertyIsNotDefined = (p: PropertyPath): boolean =>
      !definedProperties.filter(({ path }) =>
        p.predicate.equals(path.predicate) && p.inverse === path.inverse).length;

    const propertyFilter: (path: PropertyPath) => boolean = includeProperty
      ? path => includeProperty(path.predicate.value, path.inverse)
      : () => true;

    const propertiesRegular: Property[] = propertyStore
      .getProperties(false, p => propertyIsNotDefined(p) && propertyFilter(p));

    const propertiesInverse: Property[] = propertyStore
      .getProperties(true, p => propertyIsNotDefined(p) && propertyFilter(p));

    otherProperties = propertiesRegular.concat(propertiesInverse);
    otherProperties.sort(otherPropertiesComparator);
  }
  const properties: Property[] = definedProperties.concat(otherProperties);

  const effectiveFormatPredicate = createPredicateFormatter(prefixes, disableAutoLabel, formatPredicate);

  const ResourceHeading: FunctionComponent<{}> = () => {
    return (
      <div className={'resource-heading border ' + className} style={{ padding: '0.75em', paddingTop: '1em' }}>
        <h4>
          <Value
            term={resourceIri}
            prefixes={prefixes}
            getNamedNodeLabels={getResourceLabels}
            disableLegacyFormatting
            disableLink
          />
          {resourceType ? (
            <span className="resource-type" style={{ marginLeft: '0.5em', fontSize: '0.8em' }}>«{resourceType}»</span>
          ) : null}
        </h4>
        <div className="resource-uri" style={{ marginBottom: '0.5em', fontSize: '0.9em' }}>
          {i18next.t('persistentUri')}: &lt;<a href={resourceIri.value}>{resourceIri.value}</a>&gt;
        </div>
      </div>
    );
  };

  const effectiveValueProps = {
    prefixes,
    disableLegacyFormatting,
    getNamedNodeLabels: getResourceLabels,
    ...valueProps,
  };

  return (<>
    {renderHeading ? (
      <ResourceHeading />
    ) : null}
    <table className={'table table-striped border resource-container ' + className} style={{ marginBottom: '1.5em' }}>
      <tbody>
      {properties.map((property: Property, index: number) => {

        const isEmpty = property.values.length === 0;
        if (hideEmptyProperties && isEmpty && !property.customRender) {
          return null;
        }

        const { predicate, inverse } = property.path;
        return (
          <tr key={index}>
            <th scope="row">
              <a href={predicate.value}>
                {property.label ? property.label : effectiveFormatPredicate(predicate.value, inverse)}
              </a>
            </th>
            <td>
              <PropertyValues
                property={property}
                valueProps={effectiveValueProps} />
            </td>
          </tr>
        );
      })}
      </tbody>
    </table>
  </>);
};

export default Resource;
