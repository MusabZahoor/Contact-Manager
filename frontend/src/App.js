import React from 'react';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressBook } from '@fortawesome/free-solid-svg-icons';
import Contacts from './contacts';

function App() {
  return (
    <div className="App">
      <nav className="navbar navbar-dark bg-secondary mb-4">
        <Container>
          <span className="navbar-brand">
            <FontAwesomeIcon icon={faAddressBook} className="me-2" />
            Contact Manager
          </span>
        </Container>
      </nav>
      <Container>
        <Contacts />
      </Container>
    </div>
  );
}

export default App;