import React, { Component } from "react";
import { Container } from "react-bootstrap";

class Footer extends Component {
  render() {
    return (
      <footer className="footer px-0 px-lg-3">
        <Container fluid>
          <nav>
            <p className="copyright text-center">
              ©
              <a href="https://www.medicacom.tn/fr/"> {new Date().getFullYear()} medicacom</a>
            </p>
          </nav>
        </Container>
      </footer>
    );
  }
}

export default Footer;
