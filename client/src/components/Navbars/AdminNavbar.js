import React from "react";
import { Navbar, Container, Nav, Dropdown, Button, Col } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { anneeAdded, fetchAnnee } from "../../Redux/anneeReduce";
import Select from "react-select";

function Header({ users,onlineStatus }) {
  var navigate = useHistory();
  const dispatch = useDispatch();
  const [annee, setAnnee] = React.useState();
  const [optionsAnnee, setOptionsAnnee] = React.useState([
    {
      value: "",
      label: "Annee",
      isDisabled: true,
    },
  ]);
  let nom = onlineStatus === 1 ?users.user.prenom + " " + users.user.nom:users.prenom + " " + users.nom;
  /* let role = users.user.id_role;
  let id = users.user.id; */
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
    /* for (let i = 0; i < routes.length; i++) {
      if (location.pathname.indexOf(routes[i].layout + routes[i].path) !== -1) {
        return routes[i].name;
      }
    } */
    return "";
  };
 /*  const getAnnes = React.useCallback(async () => {
    var year = await dispatch(fetchAnnee());
    var arrayOption = [];
    var selected = null;
    year.payload.forEach((element) => {
      arrayOption.push({
        value: element.annee,
        label: element.annee,
        selected: element.selected,
        id: element.id,
      });
      if (!selected)
        selected = {
          value: element.annee,
          label: element.annee,
          selected: element.selected,
          id: element.id,
        };
    });
    var annee = localStorage.getItem("annee");
    if (annee === null) {
      setAnnee({ value: selected.value, label: selected.value });
      localStorage.setItem("annee", selected.value);
    } else {
      setAnnee({ value: annee, label: annee });
      localStorage.setItem("annee", annee);
    }

    setOptionsAnnee(arrayOption);
  }, [dispatch]); */

  /* React.useEffect(() => {
    getAnnes();
  }, [getAnnes]); */

  function updateAnnee(value) {
    /* dispatch(anneeAdded({ annee: value.annee, id: value.id, selected: 1 })); */
    localStorage.setItem("annee", value.value);
    window.location.reload();
  }

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
        <Col md="3">
          {/* <Select
            className="react-select primary"
            classNamePrefix="react-select"
            name="singleSelect"
            value={annee}
            onChange={(value) => {
              setAnnee(value);
              updateAnnee(value);
            }}
            options={optionsAnnee}
            placeholder="Annee"
          /> */}
        </Col>
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
                <span className="no-icon">{nom}</span>
              </Dropdown.Toggle>
              <Dropdown.Menu aria-labelledby="navbarDropdownMenuLink">
                <Dropdown.Item
                  href="#"
                  onClick={(e) => navigate.push("/Settings")}
                >
                  <i className="fas fa-users-cog"></i>
                  Settings
                </Dropdown.Item>
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
