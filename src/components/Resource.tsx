import React from 'react';
import { NamedNode, Term, Literal } from 'rdf-js';
import { namedNode } from '@rdfjs/data-model';
import Store from '../lib/Store';
import Value, { ValueProps } from './Value';
import { mergePrefixMaps, applyPrefixes } from '../utils';
import { statementsWithPredicate, uniquePredicates, localName } from './Resource.utils';
import { defaultPrefixes, RDFS } from '../namespaces';

type Props = {
  resourceIri: Term;
  store: Store;
  rows?: Row[];
  valueProps?: ValueProps;
  hideEmptyProperties?: boolean;
  showAllProperties?: boolean;
  formatPredicate?: (predicate: string, inverse: boolean) => string | null;
  includeProperty?: (predicate: string, inverse: boolean) => boolean;
  disableAutoLabel?: boolean;
  prefixes?: any;
};

type Row = {
  predicate: NamedNode;
  inverse?: boolean;
  label?: string;
  customRender?: (terms: Term[]) => JSX.Element;
};

type PropertyPath = {
  predicate: NamedNode;
  inverse: boolean;
};

type Property = {
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

const rdfsLabel = namedNode(RDFS + 'label');

const Resource: React.StatelessComponent<Props> = ({ resourceIri, store, rows, valueProps, showAllProperties,
  formatPredicate, prefixes, includeProperty, disableAutoLabel = false, hideEmptyProperties = false }) => {

  const getResourceLabels = (resourceIri: NamedNode) => store.findObjects(resourceIri, rdfsLabel)
    .filter(o => o.termType === 'Literal').map(o => o as Literal);

  const statements = store.findStatements(resourceIri);
  const getPropertyValues = (predicate: NamedNode): Term[] =>
    statementsWithPredicate(statements, predicate).map(statement => statement.object);

  const statementsWhereObject = store.findStatementsWithObject(resourceIri);
  const getInversePropertyValues = (predicate: NamedNode): Term[] =>
    statementsWithPredicate(statementsWhereObject, predicate).map(statement => statement.subject);

  // create representation of specified properties, incl property values
  const definedProperties = (rows || []).map((row): Property => {
    const { predicate } = row;
    const inverse = !!row.inverse;
    const values = (inverse ? getInversePropertyValues : getPropertyValues)(predicate);
    return {
      values,
      path: { predicate, inverse },
      label: row.label,
      customRender: row.customRender,
    };
  });

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

    const propertiesRegular: Property[] = uniquePredicates(statements)
      .map((predicate): PropertyPath => ({ predicate, inverse: false }))
      .filter(propertyIsNotDefined)
      .filter(propertyFilter)
      .map(path => ({ path, values: getPropertyValues(path.predicate) }));

    const propertiesInverse: Property[] = uniquePredicates(statementsWhereObject)
      .map((predicate): PropertyPath => ({ predicate, inverse: true }))
      .filter(propertyIsNotDefined)
      .filter(propertyFilter)
      .map(path => ({ path, values: getInversePropertyValues(path.predicate) }));

    otherProperties = propertiesRegular.concat(propertiesInverse);
    otherProperties.sort(otherPropertiesComparator);
  }
  const properties: Property[] = definedProperties.concat(otherProperties);

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
    ? ((p, i) => formatPredicate(p, i) || defaultFormatPredicate(p, i))
    : defaultFormatPredicate;

  const PropertyValues = ({ property }: { property: Property }) => {
    const { values } = property;
    if (property.customRender) {
      return property.customRender(values);
    }
    if (values.length === 0) {
      return <span>-</span>;
    }
    // TODO disableLegacyFormatting should probably be defined on <Resource> and passed through
    return (
      <>{values.map(value => (
        <React.Fragment key={value.value}>
          <Value
            term={value}
            prefixes={prefixes}
            getNamedNodeLabels={getResourceLabels}
            disableLegacyFormatting
            {...valueProps} />
          <br />
        </React.Fragment>
      ))}</>
    );
  };

  return (
    <table className="table table-striped">
      <tbody>
      {properties.map((property: Property) => {

        const isEmpty = property.values.length === 0;
        if (hideEmptyProperties && isEmpty && !property.customRender) {
          return null;
        }

        const { predicate, inverse } = property.path;
        return (
          <tr key={predicate.value}>
            <th scope="row">
              <a href={predicate.value}>
                {property.label ? property.label : effectiveFormatPredicate(predicate.value, inverse)}
              </a>
            </th>
            <td><PropertyValues property={property} /></td>
          </tr>
        );
      })}
      </tbody>
    </table>
  );
};

export default Resource;
