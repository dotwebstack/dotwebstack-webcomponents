import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Link, Redirect, Route, Switch } from 'react-router-dom';
import { Container, Nav, Navbar, NavItem } from 'reactstrap';
import ResourceExample from './ResourceExample';
import ResourceListExample from './ResourceListExample';
import VocabularyExample from './VocabularyExample';

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
                <Link to="/resource-list" className="nav-link">Resource List</Link>
              </NavItem>
              <NavItem>
                <Link to="/vocabulary" className="nav-link">Vocabulary</Link>
              </NavItem>
            </Nav>
          </Container>
        </Navbar>
      </header>
      <main className="mt-4">
        <Container>
          <Switch>
            <Route exact path="/resource" component={ResourceExample} />
            <Route exact path="/resource-list" component={ResourceListExample} />
            <Route exact path="/vocabulary" component={VocabularyExample} />
            <Redirect from="/" to="/resource" />
          </Switch>
        </Container>
      </main>
    </div>
  </HashRouter>
);

ReactDOM.render(<App />, document.getElementById('root'));
