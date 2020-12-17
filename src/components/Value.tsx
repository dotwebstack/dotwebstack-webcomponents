import React, { Fragment, FunctionComponent } from 'react';
import { localName, mergePrefixMaps, applyPrefixes } from '../utils';
import { Term, Literal, NamedNode } from 'rdf-js';
import { namedNode, literal } from '@rdfjs/data-model';
import { defaultPrefixes, XSD, RDF } from '../namespaces';

export type ValueProps = {
  local?: boolean,
  linkBuilder?: (term: Term) => string,
  formatString?: (literal: Literal) => string,
  formatLangString?: (literal: Literal) => string,
  formatOtherLiteral?: (literal: Literal, shorten: (resource: string) => string) => string,
  prefixes?: any,
  getNamedNodeLabels?: (namedNode: NamedNode, shorten: (resource: string) => string) => (Literal|string)[],
  disableLegacyFormatting?: boolean,
  disableLink?: boolean,
};

type Props = {
  term: Term,
};

const defaultLinkBuilder = (term: Term) => term.value;

const defaultFormatString = (literal: Literal) => literal.value;

const defaultFormatLangString = (literal: Literal) => {
  const { value, language } = literal;
  return `${value} (${language})`;
};

const defaultFormatOtherLiteral = (literal: Literal, shorten: (resource: string) => string) => {
  const { value, datatype } = literal;
  return `${value} (${shorten(datatype.value)})`;
};

const defaultGetNamedNodeLabels = (namedNode: NamedNode, shorten: (resource: string) => string) =>
  [shorten(namedNode.value)]; // by default, we only shorten

const rdfLangString = namedNode(RDF + 'langString');
const xsdString = namedNode(XSD + 'string');

const Value: FunctionComponent<ValueProps & Props> = ({ term, local, disableLegacyFormatting, prefixes,
  getNamedNodeLabels, formatString = defaultFormatString, formatLangString = defaultFormatLangString,
  formatOtherLiteral = defaultFormatOtherLiteral, linkBuilder = defaultLinkBuilder, disableLink = false }) => {

  const { termType } = term;

  // legacy formatting
  if (!disableLegacyFormatting) {

    // non-iris
    if (termType !== 'NamedNode') {
      return <span>{term.value}</span>;
    }

    // iris
    const href = linkBuilder(term);
    const label = local ? localName(term) : term.value;
    return <a href={href}>{label}</a>;

  }

  const effectivePrefixes = mergePrefixMaps(defaultPrefixes, prefixes);
  const shorten = (resource: string) => applyPrefixes(resource, effectivePrefixes);

  const LiteralValue = ({ value }: { value: Literal|string }) => {

    const x = typeof value === 'string'
      ? literal(value)
      : value;
    const { datatype } = x;

    // rdf:langString
    if (datatype.equals(rdfLangString)) {
      return <>{formatLangString(x)}</>;
    }

    // xsd:string
    if (datatype.equals(xsdString)) {
      return <>{formatString(x)}</>;
    }

    // other literal, such as xsd:boolean
    return <>{formatOtherLiteral(x, shorten)}</>;

  };

  if (termType === 'Literal') {
    const literal = term as Literal;
    return <span><LiteralValue value={literal} /></span>;
  }

  if (termType === 'NamedNode') {
    const namedNode = term as NamedNode;
    const href = linkBuilder(namedNode);

    const effectiveGetNamedNodeLabels = getNamedNodeLabels
      ? ((namedNode: NamedNode, shorten: (resource: string) => string) => {
        const labels = getNamedNodeLabels(namedNode, shorten);
        return labels.length
          ? labels
          : defaultGetNamedNodeLabels(namedNode, shorten); // fallback in case we get 0 labels
      })
      : defaultGetNamedNodeLabels;
    const labels: (Literal|string)[] = effectiveGetNamedNodeLabels(namedNode, shorten);

    const isLast = (index: number) => index + 1 === labels.length;
    return (
      <>{labels.map((label: Literal|string, index: number) => (
        <Fragment key={index}>
          {disableLink
            ? <LiteralValue value={label} />
            : <a href={href}><LiteralValue value={label} /></a>}
          {!isLast(index) && <br />}
        </Fragment>
      ))}</>
    );
  }

  // catch-all (blank nodes)
  return <span>{term.value}</span>;

};

export default Value;
