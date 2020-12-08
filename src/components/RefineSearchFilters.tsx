import React, { FunctionComponent, useState } from 'react';
import i18next from '../i18n';

export enum Filter {
    RELATED = i18next.t('relatedFilter'),
}

export type FilterConfig = {
  RELATED?: {relatedFields: string[], referenceField: string};
};

type CustomSearchFiltersProps = {
  availableFilters: Filter[];
  selected: (filters: Filter[]) => void;
};

export const RefineSearchFilters: FunctionComponent<CustomSearchFiltersProps> = ({ selected, availableFilters }) => {
  const [selectedFilters, setSelectedFilters] = useState([] as Filter[]);

  const handleFilterSelect = (event: any) => {
    const checked = event.target.checked;
    const name = event.target.name;
    let filters: Filter[];
    if (checked) {
      filters = [...selectedFilters, name];
    } else {
      filters = [...selectedFilters.filter(el => name !== el)];
    }
    setSelectedFilters(filters);
    selected(filters);
  };

  return (
      <div className="panel panel-default card">
        <div className="panel-heading card-header">{i18next.t('refineResults')}
          <span className={'glyphicon glyphicon-chevron-down'}/>
        </div>
        <div className="panel-body card-body">
            {availableFilters.map((f:Filter, index:number) => (
                <div className="checkbox" key={index}>
                    <label>
                        {/*@ts-ignore*/}
                        <input type="checkbox" name={f} onChange={handleFilterSelect}/> {Filter[f]}
                    </label>
                </div>
            ))}
        </div>
    </div>);
};
