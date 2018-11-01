import React from 'react';
import ReactDOM from 'react-dom';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter, Link, Redirect, Route, Switch } from 'react-router-dom';
import VocabularyExample from './VocabularyExample';
import i18next from '../i18n';
import TupleExample from './TupleExample';

const App = () => (
  <I18nextProvider i18n={i18next}>
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
              <Route exact path="/tuple" component={TupleExample} />
              <Redirect from="/" to="/vocabulary" />
            </Switch>
          </div>
        </main>
      </div>
    </BrowserRouter>
  </I18nextProvider>
);

ReactDOM.render(<App />, document.getElementById('root'));
