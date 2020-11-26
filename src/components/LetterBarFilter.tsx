import React, { useState } from 'react';
import i18next from '../i18n';

type Props = {
  active: boolean,
  onSelect: (filter: string) => void,
};

export const LetterBarFilter:React.FC<Props> = ({ active, onSelect }) => {
  const showAll = i18next.t('showAll');
  const [selected, setSelected] = useState(showAll);

  const items = ['0-9', ...[...Array(26).keys()].map(i => String.fromCharCode(i + 97)),
    showAll];

  const handleClick = (value: string) => {
    setSelected(value);
    onSelect(value);
  };

  return (
            <div className="btn-group" style={{ display: 'flex' }} role="group">
                {items.map(i => (
                    <button type="button" key={i} id={`button-${i}`}
                            className={`btn btn-outline-primary ${active && selected === i ? 'active' : ''}`}
                            style={{ flex: 1 }} onClick={() => handleClick(i)}>{i}
                    </button>))}
            </div>
  );
};
