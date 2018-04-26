import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { GraphContext, GraphSource, PropertyTable } from '..';

const App = () => (
  <GraphContext>
    <GraphSource url="https://bag.basisregistraties.overheid.nl/bag/doc/pand/0003100000117485" />
    <GraphSource url="https://bag.basisregistraties.overheid.nl/bag/doc/pand/0003100000117486" />
    <PropertyTable
      resource="http://bag.basisregistraties.overheid.nl/bag/id/pand/0003100000117485" />
  </GraphContext>
);

ReactDOM.render(<App />, document.getElementById('root'));
