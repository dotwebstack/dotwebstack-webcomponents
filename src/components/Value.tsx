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
  prefixes?: any,
  getNamedNodeLabels?: (namedNode: NamedNode) => Literal[],
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

const rdfLangString = namedNode(RDF + 'langString');
const xsdString = namedNode(XSD + 'string');

const Value: React.StatelessComponent<ValueProps & Props> = ({ term, local, disableLegacyFormatting, prefixes,
  getNamedNodeLabels, formatString = defaultFormatString, formatLangString = defaultFormatLangString,
  linkBuilder = defaultLinkBuilder }) => {

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

    return <span>{term.value} ({shorten(datatype.value)})</span>;

  };

  if (termType === 'Literal') {
    const literal = term as Literal;
    return <LiteralValue literal={literal} />;
  }

  if (termType === 'NamedNode') {
    const namedNode = term as NamedNode;
    const href = linkBuilder(namedNode);

    // by default, we only shorten
    const defaultGetNamedNodeLabels = (namedNode: NamedNode) => [literal(shorten(namedNode.value))];
    const effectiveGetNamedNodeLabels = getNamedNodeLabels
      ? ((namedNode: NamedNode) => {
        const labels = getNamedNodeLabels(namedNode);
        return labels.length ? labels : defaultGetNamedNodeLabels(namedNode); // fallback in case we get 0 labels
      })
      : defaultGetNamedNodeLabels;
    const labels: Literal[] = effectiveGetNamedNodeLabels(namedNode);

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
