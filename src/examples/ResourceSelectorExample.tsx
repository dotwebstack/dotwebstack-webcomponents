import { namedNode } from '@rdfjs/data-model';
import React from 'react';
import ResourceSelector, { ResourceSelectorLink } from '../components/ResourceSelector';
import { Term } from 'rdf-js';
import { BindingSet } from '../lib/TupleResult';

const url = new URL(location.href);
const defaultResourceIri = 'http://standaarden.omgevingswet.overheid.nl/id/waardelijst/Activiteitengroep';
const resourceIriRaw = url.searchParams.get('resource') || defaultResourceIri;
const resourceIri = namedNode(resourceIriRaw);

const endpoint = 'https://stelselcatalogus.omgevingswet.overheid.nl/waardelijstversies';
const resourceParam = 'waardelijst';

const createLink = (bindingSet: BindingSet, selectedResource: Term) => {
  const waardelijst = bindingSet.waardelijst.value;
  const version = bindingSet.version.value;
  const selected = waardelijst === selectedResource.value;
  const url = new URL(`${location.origin}/resource-selector`);
  url.searchParams.set('resource', waardelijst);
  const props = {
    href: url.href,
    text: version,
    title: `Versie ${version}${selected ? ' geselecteerd' : ''}`,
    className: `btn btn-${selected ? 'success' : 'info'}`,
    key: waardelijst,
  };
  return <ResourceSelectorLink {...props}/>;
};

const transformBindingSets = (bindingSets: BindingSet[]) => {
  return bindingSets.filter(current => current.waardelijst.value === resourceIriRaw ||
    bindingSets.filter(bindingSet => bindingSet.version.value === current.version.value).length === 1);
};

const props = { endpoint, resourceParam, resourceIri, createLink, transformBindingSets };

export default () => <ResourceSelector {...props}/>;
