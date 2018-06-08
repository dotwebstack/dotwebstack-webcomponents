import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Link, Redirect, Route, Switch } from 'react-router-dom';
import { Container, Nav, Navbar, NavItem } from 'reactstrap';
import ResourceExample from './ResourceExample';
import TupleListExample from './TupleListExample';
import VocabularyExample from './VocabularyExample';
import VocabularyBrtExample from './VocabularyBrtExample';

const App = () => (
  <HashRouter>
    <div>
      <header>
        <Navbar color="light">
          <Container>
            <Nav>
              <NavItem>
                <Link to="/resource" className="nav-link">Resource</Link>
              </NavItem>
              <NavItem>
                <Link to="/tuple-list" className="nav-link">Tuple List</Link>
              </NavItem>
              <NavItem>
                <Link to="/vocabulary" className="nav-link">Vocabulary</Link>
              </NavItem>
              <NavItem>
                <Link to="/vocabulary-brt" className="nav-link">Vocabulary brt</Link>
              </NavItem>
            </Nav>
          </Container>
        </Navbar>
      </header>
      <main className="mt-4">
        <Container fluid>
          <Switch>
            <Route exact path="/resource" component={ResourceExample} />
            <Route exact path="/tuple-list" component={TupleListExample} />
            <Route exact path="/vocabulary" component={VocabularyExample} />
            <Route exact path="/vocabulary-brt" component={VocabularyBrtExample} />
            <Redirect from="/" to="/resource" />
          </Switch>
        </Container>
      </main>
    </div>
  </HashRouter>
);

ReactDOM.render(<App />, document.getElementById('root'));
