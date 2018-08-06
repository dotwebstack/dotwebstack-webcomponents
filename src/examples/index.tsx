import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Link, Redirect, Route, Switch } from 'react-router-dom';
import BagExample from './BagExample';
import CdocExample from './CdocExample';
import CspecExample from './CspecExample';

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
            <Redirect from="/" to="/bag" />
          </Switch>
        </div>
      </main>
    </div>
  </BrowserRouter>
);

ReactDOM.render(<App />, document.getElementById('root'));
