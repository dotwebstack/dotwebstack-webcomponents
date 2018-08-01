import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Link, Redirect, Route, Switch } from 'react-router-dom';
import VocabularyExample from './VocabularyExample';

const App = () => (
  <BrowserRouter>
    <div>
      <header>
        <div className="navbar bg-light">
          <div className="container">
            <ul className="nav">
              <li className="nav-item">
                <Link to="/vocabulary" className="nav-link">Vocabulary</Link>
              </li>
            </ul>
          </div>
        </div>
      </header>
      <main className="mt-4">
        <div className="container">
          <Switch>
            <Route exact path="/vocabulary" component={VocabularyExample} />
            <Redirect from="/" to="/vocabulary" />
          </Switch>
        </div>
      </main>
    </div>
  </BrowserRouter>
);

ReactDOM.render(<App />, document.getElementById('root'));
