import React from 'react';
import querystring from 'querystring';
import TupleContext from './TupleContext';
import { BindingSet } from '../lib/TupleResult';

type Props = {
  endpoint: string;
  resourceParam: string;
  resource: string;
  resourceColumn: string;
  displayColumn: string;
  transformBindingSets?: (bindingSets: BindingSet[]) => BindingSet[];
  createLinkHref: (resource: string) => string;
  linkClassName?: string;
  linkSelectedClassName?: string;
};

const ResourceSelector = ({ endpoint, resourceParam, resource, resourceColumn, displayColumn, transformBindingSets,
createLinkHref, linkClassName = 'btn btn-info', linkSelectedClassName = 'btn btn-success' }: Props) => {

  const dataUrl: string = endpoint + '?' + querystring.stringify({
    [resourceParam]: resource,
  });

  const transform = transformBindingSets || ((bindingSets: BindingSet[]) => bindingSets);

  return (
      <div>
        <TupleContext src={dataUrl}>
            {result => (<>
              {transform(result.getBindingSets()).map((bindingSet) => {
                const currentResource = bindingSet[resourceColumn].value;
                const selected = currentResource === resource;
                return <a
                  href={createLinkHref(currentResource)}
                  style={{ marginRight: '0.4em' }}
                  className={selected ? linkSelectedClassName : linkClassName}
                  key={currentResource}>
                    {bindingSet[displayColumn].value}
                </a>;
              })}
            </>)}
        </TupleContext>
      </div>
  );
};

export default ResourceSelector;
