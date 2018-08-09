import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Link, Redirect, Route, Switch } from 'react-router-dom';
import BagExample from './BagExample';
import CdocExample from './CdocExample';
import CspecExample from './CspecExample';
import ImborExample from './ImborExample';
import ThesaurusExample from './ThesaurusExample';
import PilotSpecificationExample from './PilotSpecificationExample';

const App = () => (
  <BrowserRouter>
    <div>
      <header>
        <div className="navbar bg-light">
          <div className="container">
            <ul className="nav">
              <li className="nav-item">
                <Link to="/bag" className="nav-link">BAG</Link>
              </li>
              <li className="nav-item">
                <Link to="/cdoc" className="nav-link">Documentschema</Link>
              </li>
              <li className="nav-item">
                <Link to="/cspec" className="nav-link">Specificatieschema</Link>
              </li>
              <li className="nav-item">
                <Link to="/imbor" className="nav-link">IMBOR</Link>
              </li>
              <li className="nav-item">
                <Link to="/thesaurus" className="nav-link">Thesaurus</Link>
              </li>
              <li className="nav-item">
                <Link to="/specificatie" className="nav-link">Pilot Specificatie</Link>
              </li>
            </ul>
          </div>
        </div>
      </header>
      <main className="mt-4">
        <div className="container">
          <Switch>
            <Route exact path="/bag" component={BagExample} />
            <Route exact path="/cdoc" component={CdocExample} />
            <Route exact path="/cspec" component={CspecExample} />
            <Route exact path="/imbor" component={ImborExample} />
            <Route exact path="/thesaurus" component={ThesaurusExample} />
            <Route exact path="/specificatie" component={PilotSpecificationExample} />
            <Redirect from="/" to="/bag" />
          </Switch>
        </div>
      </main>
    </div>
  </BrowserRouter>
);

ReactDOM.render(<App />, document.getElementById('root'));
