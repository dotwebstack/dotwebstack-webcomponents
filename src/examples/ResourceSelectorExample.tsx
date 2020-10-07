import React from 'react';
import ResourceSelector from '../components/ResourceSelector';
import { BindingSet } from '../lib/TupleResult';

const url = new URL(location.href);
const defaultResource = 'http://standaarden.omgevingswet.overheid.nl/id/waardelijst/Activiteitengroep';
const resource = url.searchParams.get('resource') || defaultResource;

const transformBindingSets = (bindingSets: BindingSet[]) => {
  bindingSets.sort((a: BindingSet, b: BindingSet) =>
    b.version.value.localeCompare(a.version.value));
  return bindingSets;
};

const createLinkHref = (resource: string) => {
  const url = new URL(`${location.origin}/resource-selector`);
  url.searchParams.set('resource', resource);
  return url.href;
};

const props = {
  resource,
  createLinkHref,
  transformBindingSets,
  endpoint: 'https://stelselcatalogus.omgevingswet.overheid.nl/waardelijstversies',
  resourceParam: 'waardelijst',
  resourceColumn: 'waardelijst',
  displayColumn: 'version',
};

export default () => <ResourceSelector {...props}/>;
