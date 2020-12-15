import React from 'react';
import ReactDOM from 'react-dom';
import { I18nextProvider } from 'react-i18next';
import { BrowserRouter, Link, Redirect, Route, Switch } from 'react-router-dom';
import VocabularyExample from './VocabularyExample';
import i18next from '../i18n';
import TupleListExample from './TupleListExample';
import ResourceExample from './ResourceExample';
import ResourceSelectorExample from './ResourceSelectorExample';
import SearchExample from './SearchExample';
import SearchJsExample from './SearchJsExample';
import VocabularyJsExample from './VocabularyJsExample';
import TupleListJsExample from './TupleListJsExample';
import ResourceJsExample from './ResourceJsExample';
import ConciseBoundedDescriptionExample from './ConciseBoundedDescriptionExample';
import ConciseBoundedDescriptionJsExample from './ConciseBoundedDescriptionJsExample';

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
                <li className="nav-item">
                  <Link to="/tuple-list" className="nav-link">TupleList</Link>
                </li>
                <li className="nav-item">
                  <Link to="/resource" className="nav-link">Resource</Link>
                </li>
                <li className="nav-item">
                  <Link to="/concise-bounded-description" className="nav-link">ConciseBoundedDescription</Link>
                </li>
                <li className="nav-item">
                  <Link to="/resource-selector" className="nav-link">ResourceSelector</Link>
                </li>
                <li className="nav-item">
                  <Link to="/search" className="nav-link">Search</Link>
                </li>
                <li className="nav-item">
                  <Link to="/vocabulary-js" className="nav-link">Vocabulary (without React)</Link>
                </li>
                <li className="nav-item">
                  <Link to="/tuple-list-js" className="nav-link">TupleList (without React)</Link>
                </li>
                <li className="nav-item">
                  <Link to="/resource-js" className="nav-link">Resource (without React)</Link>
                </li>
                <li className="nav-item">
                  <Link to="/concise-bounded-description-js" className="nav-link">
                    ConciseBoundedDescription (without React)</Link>
                </li>
                <li className="nav-item">
                  <Link to="/search-js" className="nav-link">Search (without React)</Link>
                </li>
              </ul>
            </div>
          </div>
        </header>
        <div className="mt-4">
          <div className="container">
            <Switch>
              <Route exact path="/vocabulary" component={VocabularyExample} />
              <Route exact path="/tuple-list" component={TupleListExample} />
              <Route exact path="/resource" component={ResourceExample} />
              <Route exact path="/concise-bounded-description" component={ConciseBoundedDescriptionExample} />
              <Route exact path="/resource-selector" component={ResourceSelectorExample} />
              <Route exact path="/search" component={SearchExample} />
              <Route exact path="/vocabulary-js" component={VocabularyJsExample} />
              <Route exact path="/tuple-list-js" component={TupleListJsExample} />
              <Route exact path="/resource-js" component={ResourceJsExample} />
              <Route exact path="/concise-bounded-description-js" component={ConciseBoundedDescriptionJsExample} />
              <Route exact path="/search-js" component={SearchJsExample} />
              <Redirect from="/" to="/vocabulary" />
            </Switch>
          </div>
        </div>
      </div>
    </BrowserRouter>
  </I18nextProvider>
);

ReactDOM.render(<App />, document.getElementById('root'));
