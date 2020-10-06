import React from 'react';
import { Term } from 'rdf-js';
import querystring from 'querystring';
import TupleContext from './TupleContext';
import { BindingSet } from '../lib/TupleResult';

type Props = {
  endpoint: string;
  resourceParam: string;
  resourceIri: Term;
  transformBindingSets?: (bindingSets: BindingSet[]) => BindingSet[];
  createLink: (bindingSet: BindingSet, selectedResource: Term) => JSX.Element;
};

const ResourceSelector = ({ endpoint, resourceParam, resourceIri, transformBindingSets, createLink }: Props) => {

  const dataUrl: string = endpoint + '?' + querystring.stringify({
    [resourceParam]: resourceIri.value,
  });

  const transform = transformBindingSets || ((bindingSets: BindingSet[]) => bindingSets);

  return (
      <div>
        <TupleContext src={dataUrl}>
            {result => (<>
              {transform(result.getBindingSets()).map(bindingSet => createLink(bindingSet, resourceIri))}
            </>)}
        </TupleContext>
      </div>
  );
};

type ResourceSelectorLinkProps = {
  href: string;
  text: string;
  title?: string;
  className: string;
};

export const ResourceSelectorLink: React.FunctionComponent<ResourceSelectorLinkProps> = ({ text, ...otherProps }) =>
  <a style={{ marginRight: '0.4em' }} {...otherProps}>{text}</a>;

export default ResourceSelector;
