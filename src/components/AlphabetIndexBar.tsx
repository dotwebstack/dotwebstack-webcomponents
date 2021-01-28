import React, { useState } from 'react';
import i18next from '../i18n';

type Props = {
  active: boolean,
  onSelect: (filter: string) => void,
};

export const AlphabetIndexBar:React.FC<Props> = ({ active, onSelect }) => {
  const showAll = i18next.t('showAll');
  const [selected, setSelected] = useState(showAll);

  const items = ['0-9', ...'abcdefghijklmnopqrstuvwxyz'.split(''),
    showAll];

  const handleClick = (value: string) => {
    setSelected(value);
    onSelect(value);
  };

  return (
            <div className="btn-group w-100" role="group">
                {items.map(i => (
                    <button type="button" key={i} id={`button-${i}`}
                            className={`btn btn-light rounded-0 py-1 px-2 ${active && selected === i ? 'active' : ''}`}
                            style={{ flex: 1 }} onClick={() => handleClick(i)}>{i}
                    </button>))}
            </div>
  );
};
