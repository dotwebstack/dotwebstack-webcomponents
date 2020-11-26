import React from 'react';
import { NamedNode, Quad, Term } from 'rdf-js';
import Store from '../lib/Store';
import { uniqueTermsReducer } from '../utils';
import Value, { ValueProps } from './Value';
import { last } from 'ramda';

// TODO reconsider terminology ("property") and property names

type Props = {
  resourceIri: Term;
  store: Store;
  rows?: Row[];
  valueProps?: ValueProps;
  hideEmptyProperties?: boolean;
  showAllProperties?: boolean;
  getPredicateLabel?: (predicate: string, inverse: boolean) => string | null;
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

// utils.....

const localName = (term: string) => last(term.split(/[\#\/]/)) || term;

const uniquePredicates = (statements: Quad[]): NamedNode[] =>
  statements.map(statement => statement.predicate).reduce(uniqueTermsReducer, [])
    .map(p => p as NamedNode);

const statementsWithPredicate = (collection: Quad[], predicate: NamedNode): Quad[] =>
  collection.filter(statement => statement.predicate.equals(predicate));

const otherPropertiesComparator = (a: Property, b: Property) => {
  const predicateComparison = a.path.predicate.value.localeCompare(b.path.predicate.value);
  if (predicateComparison) {
    return predicateComparison;
  }
  return (!!a.path.inverse ? 0 : 1) - (!!b.path.inverse ? 0 : 1);
};

const defaultPrefixes = {
  dcterms: 'http://purl.org/dc/terms/',
  rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
  owl: 'http://www.w3.org/2002/07/owl#',
  foaf: 'http://xmlns.com/foaf/0.1/',
  skos: 'http://www.w3.org/2004/02/skos/core#',
  dc: 'http://purl.org/dc/elements/1.1/',
};

const applyPrefixes = (resource: string, prefixes: any) => {
  for (const prefix in prefixes) {
    const namespace = prefixes[prefix];
    if (resource.startsWith(namespace)) {
      const resourceTail = resource.substring(namespace.length);
      return `${prefix}:${resourceTail}`;
    }
  }
  return resource;
};

const Resource: React.StatelessComponent<Props> = ({ resourceIri, store, rows, valueProps, showAllProperties,
  getPredicateLabel, prefixes, disableAutoLabel = false, hideEmptyProperties = false }) => {

  const statements = store.findStatements(resourceIri);
  const getPropertyValues = (predicate: NamedNode): Term[] =>
    statementsWithPredicate(statements, predicate).map(statement => statement.object);

  const statementsWhereObject = store.findStatementsWithObject(resourceIri);
  const getInversePropertyValues = (predicate: NamedNode): Term[] =>
    statementsWithPredicate(statementsWhereObject, predicate).map(statement => statement.subject);

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

  let otherProperties: Property[] = [];

  // if 'rows' is specified, the default for 'show all properties' is false; true otherwise
  if (showAllProperties === undefined ? !rows : showAllProperties) {

    const propertyIsNotDefined = (p: PropertyPath): boolean =>
      !definedProperties.filter(({ path }) =>
        p.predicate.equals(path.predicate) && p.inverse === path.inverse).length;

    const propertiesRegular: Property[] = uniquePredicates(statements)
      .map((predicate): PropertyPath => ({ predicate, inverse: false }))
      .filter(propertyIsNotDefined)
      .map(path => ({ path, values: getPropertyValues(path.predicate) }));

    const propertiesInverse: Property[] = uniquePredicates(statementsWhereObject)
      .map((predicate): PropertyPath => ({ predicate, inverse: true }))
      .filter(propertyIsNotDefined)
      .map(path => ({ path, values: getInversePropertyValues(path.predicate) }));

    otherProperties = propertiesRegular.concat(propertiesInverse);
    otherProperties.sort(otherPropertiesComparator);
  }
  const properties: Property[] = definedProperties.concat(otherProperties);

  // TODO make a <PropertyValues>
  const renderPropertyValues = (property: Property) => {
    const { values } = property;
    if (property.customRender) {
      return property.customRender(values);
    }
    if (values.length === 0) {
      return <span>-</span>;
    }
    return values.map(value => (
      <React.Fragment key={value.value}>
        <Value term={value} {...valueProps} />
        <br />
      </React.Fragment>
    ));
  };

  const effectivePrefixes = { ...defaultPrefixes, ...prefixes };
  // TODO need additional logic; duplicate namespaces should also overwrite/remove the original key/value...
  const shorten = (resource: string) => applyPrefixes(resource, effectivePrefixes);
  const createPredicateLabel: (predicate: string) => string = disableAutoLabel
    ? shorten
    : localName;
  const defaultPredicateLabel = (predicate: string, inverse: boolean) => inverse
    ? `is ${createPredicateLabel(predicate)} of`
    : createPredicateLabel(predicate);

  // invoke custom predicate label function, if any. if it returns null, fall back to default implementation
  let predicateLabel: (predicate: string, inverse: boolean) => string;
  if (getPredicateLabel) {
    predicateLabel = (p, i) => getPredicateLabel(p, i) || defaultPredicateLabel(p, i);
  } else {
    predicateLabel = defaultPredicateLabel;
  }

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
                {property.label ? property.label : predicateLabel(predicate.value, inverse)}
              </a>
            </th>
            <td>{renderPropertyValues(property)}</td>
          </tr>
        );
      })}
      </tbody>
    </table>
  );
};

export default Resource;
