import React from 'react';
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
  getNamedNodeLabels?: (namedNode: NamedNode, shorten: (resource: string) => string) => Literal[],
  disableLegacyFormatting?: boolean,
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
  [literal(shorten(namedNode.value))]; // by default, we only shorten

const rdfLangString = namedNode(RDF + 'langString');
const xsdString = namedNode(XSD + 'string');

const Value: React.StatelessComponent<ValueProps & Props> = ({ term, local, disableLegacyFormatting, prefixes,
  getNamedNodeLabels, formatString = defaultFormatString, formatLangString = defaultFormatLangString,
  formatOtherLiteral = defaultFormatOtherLiteral, linkBuilder = defaultLinkBuilder }) => {

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

  const LiteralValue = ({ literal }: { literal: Literal }) => {
    const { datatype } = literal;

    // rdf:langString
    if (datatype.equals(rdfLangString)) {
      return <span>{formatLangString(literal)}</span>;
    }

    // xsd:string
    if (datatype.equals(xsdString)) {
      return <span>{formatString(literal)}</span>;
    }

    // other literal, such as xsd:boolean
    return <span>{formatOtherLiteral(literal, shorten)}</span>;

  };

  if (termType === 'Literal') {
    const literal = term as Literal;
    return <LiteralValue literal={literal} />;
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
    const labels: Literal[] = effectiveGetNamedNodeLabels(namedNode, shorten);

    const isLast = (index: number) => index + 1 === labels.length;
    return (
      <>{labels.map((label: Literal, index: number) => (
        <React.Fragment key={index}>
          <a href={href}><LiteralValue literal={label} /></a>
          {isLast(index) ? null : <br />}
        </React.Fragment>
      ))}</>
    );
  }

  // catch-all (blank nodes)
  return <span>{term.value}</span>;

};

export default Value;
