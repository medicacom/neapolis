import React from "react";
import { Navbar, Container, Nav, Dropdown, Button } from "react-bootstrap";
import { useHistory } from "react-router";

function Header({ users, onlineStatus }) {
  var lang = window.localStorage.getItem("lang");
  var navigate = useHistory();
  let nom =
    onlineStatus === 1
      ? users.user.prenom + " " + users.user.nom
      : users.prenom + " " + users.nom;

  function LogOut(e) {
    e.preventDefault();
    localStorage.clear();
    window.location.replace("/login");
  }
  const mobileSidebarToggle = (e) => {
    e.preventDefault();
    document.documentElement.classList.toggle("nav-open");
    var node = document.createElement("div");
    node.id = "bodyClick";
    node.onclick = function () {
      this.parentElement.removeChild(this);
      document.documentElement.classList.toggle("nav-open");
    };
    document.body.appendChild(node);
  };

  const getBrandText = () => {
    return "";
  };

  return (
    <Navbar bg="light" expand="lg">
      <Container fluid>
        <div className="d-flex justify-content-center align-items-center ml-2 ml-lg-0">
          <Button
            variant="dark"
            className="d-lg-none btn-fill d-flex justify-content-center align-items-center rounded-circle p-2"
            onClick={mobileSidebarToggle}
          >
            <i className="fas fa-ellipsis-v"></i>
          </Button>
          <Navbar.Brand
            href="#home"
            onClick={(e) => e.preventDefault()}
            className="mr-2"
          >
            {getBrandText()}
          </Navbar.Brand>
        </div>
        <div className="navbar-wrapper">
          <div className="navbar-minimize">
            <Button
              className="btn-fill btn-round btn-icon d-none d-lg-block bg-dark border-dark"
              variant="dark"
              onClick={() => document.body.classList.toggle("sidebar-mini")}
            >
              <i className="fas fa-ellipsis-v visible-on-sidebar-regular"></i>
              <i className="fas fa-bars visible-on-sidebar-mini"></i>
            </Button>
            <Button
              className="btn-fill btn-round btn-icon d-block d-lg-none bg-dark border-dark"
              variant="dark"
              onClick={() =>
                document.documentElement.classList.toggle("nav-open")
              }
            >
              <i className="fas fa-list"></i>
              <i className="fas fa-bars visible-on-sidebar-mini"></i>
            </Button>
          </div>
          {/* <Navbar.Brand
            href="#"
            onClick={(e) => e.preventDefault()}
          ></Navbar.Brand> */}
        </div>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto" navbar>
            <Dropdown as={Nav.Item}>
              <Dropdown.Toggle
                aria-expanded={false}
                aria-haspopup={true}
                as={Nav.Link}
                data-toggle="dropdown"
                id="navbarDropdownMenuLink"
                variant="default"
                className="m-0"
              >
                <span className="no-icon">Langue</span>
              </Dropdown.Toggle>
              <Dropdown.Menu aria-labelledby="navbarDropdownMenuLink">
                <Dropdown.Item
                  className={lang === "en" ? "active_lang" : ""}
                  href="#"
                  onClick={(e) => {
                    window.localStorage.setItem("lang", "en");
                    window.location.reload();
                  }}
                >
                  <img
                    src={require("../../assets/img/en.png")}
                    alt="medicacom"
                  />
                  English
                </Dropdown.Item>
                <Dropdown.Item
                  className={lang === "fr" ? "active_lang" : ""}
                  href="#"
                  onClick={(e) => {
                    window.localStorage.setItem("lang", "fr");
                    window.location.reload();
                  }}
                >
                  <img
                    src={require("../../assets/img/fr.png")}
                    alt="medicacom"
                  />
                  Francais
                </Dropdown.Item>
                <Dropdown.Item
                  className={lang === "ar" ? "active_lang" : ""}
                  href="#"
                  onClick={(e) => {
                    window.localStorage.setItem("lang", "ar");
                    window.location.reload();
                  }}
                >
                  <img
                    src={require("../../assets/img/ar.png")}
                    alt="medicacom"
                  />
                  Arabe
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Dropdown as={Nav.Item}>
              <Dropdown.Toggle
                aria-expanded={false}
                aria-haspopup={true}
                as={Nav.Link}
                data-toggle="dropdown"
                id="navbarDropdownMenuLink"
                variant="default"
                className="m-0"
              >
                <span className="no-icon">{nom}</span>
              </Dropdown.Toggle>
              <Dropdown.Menu aria-labelledby="navbarDropdownMenuLink">
                <Dropdown.Item
                  href="#"
                  onClick={(e) => navigate.push("/profile")}
                >
                  <i className="fas fa-user"></i>
                  profile
                </Dropdown.Item>
                <Dropdown.Item href="#" onClick={LogOut}>
                  <i className="nc-icon nc-button-power"></i>
                  Déconnecter
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
