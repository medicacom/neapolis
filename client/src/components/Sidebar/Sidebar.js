import React from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
// react-bootstrap components
import { Collapse, Nav } from "react-bootstrap";
import { useSelector } from "react-redux";
import { openDB } from "idb/with-async-ittr";
function Sidebar({ background, users, onlineStatus }) {
  var navigate = new useHistory();
  let db;
  let lang = window.localStorage.getItem("lang");
  let location = useLocation();
  const [state, setState] = React.useState({});
  /* const { entities } = useSelector((state) => state.settings); */
  const { rootBase } = useSelector((state) => state.rootBase);
  var routes = rootBase ? rootBase[0] : [];
  const [routesIndex, setRoutesIndex] = React.useState([]);
  var styleM = lang !== "ar" ? "sidebar" : "sidebar sidebar-ar";
  var id_role = onlineStatus === 1 ? users.user.id_role : users.id_role;

  async function initRoot() {
    db = await openDB("medis", 1, {});
    const tx = db.transaction("rootBase", "readwrite");
    const index = tx.store.index("parent");
    let store = tx.objectStore("rootBase");
    let rootArray = await store.getAll();
    var arrayView = [];
    for (const key in rootArray) {
      var e = rootArray[key];
      if (e.parent !== 0) {
        var rolesFils = e.role;
        var splitRoleFils = rolesFils.split(",");
        var arrayRoleFils = [];
        splitRoleFils.forEach((element) => {
          arrayRoleFils.push(parseInt(element));
        });
        arrayView.push({
          path: "/" + e.path,
          name: e.name,
          name_en: e.name_en,
          name_ar: e.name_ar,
          icon: e.icon,
          role: arrayRoleFils,
          componentStr: e.component,
          parent: e.parent,
          className: e.className,
        });
        /* rootFils.push(element) */
      }
    }
    var arrayParent = [];
    for await (const cursor of index.iterate(0)) {
      var objRole = { ...cursor.value };
      const pos = arrayView.map((e) => e.parent).indexOf(objRole.id);

      var rolesFils = objRole.role;
      var splitRoleFils = rolesFils.split(",");
      var arrayRole = [];
      splitRoleFils.forEach((element) => {
        arrayRole.push(parseInt(element));
      });
      if (pos === -1) {
        var obj = {
          path: "/" + objRole.path,
          name: objRole.name,
          name_en: objRole.name_en,
          name_ar: objRole.name_ar,
          icon: objRole.icon,
          role: arrayRole,
          componentStr: objRole.component,
          parent: objRole.parent,
          className: objRole.className,
        };
        arrayParent.push(obj);
      } else {
        var obj = {
          collapse: true,
          path: "/" + objRole.path,
          name: objRole.name,
          name_en: objRole.name_en,
          name_ar: objRole.name_ar,
          state: "pere" + objRole.id,
          icon: objRole.icon,
          role: arrayRole,
          className: objRole.className,
          views: arrayView,
        };
        arrayParent.push(obj);
      }
    }
    setRoutesIndex(arrayParent);
  }
  React.useEffect(() => {
    if (onlineStatus === 0) {
      initRoot();
    }
    /* if(onlineStatus === 1){
      initRole();
    } else {
      initRoot();
    } */
    /* setState(getCollapseStates(routes)); */
  }, []);

  const getCollapseInitialState = (routes) => {
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].collapse && getCollapseInitialState(routes[i].views)) {
        return true;
      } else if (location.pathname === routes[i].layout + routes[i].path) {
        return true;
      }
    }
    return false;
  };
  // this function creates the links and collapses that appear in the sidebar (left menu)
  const createLinks = (routes) => {
    return routes.map((prop, key) => {
      var st = {};
      var name = prop.name;
      if (lang === "fr") name = prop.name;
      else if (lang === "en" && prop.name_en !== null) name = prop.name_en;
      else if (lang === "ar" && prop.name_ar !== null) name = prop.name_ar;
      getTitle(prop.path, name);

      /* else 
        document.title = prop.name; */
      if (prop.role.includes(id_role) || prop.role.includes(20)) {
        if (prop.redirect) {
          return null;
        }
        if (prop.collapse) {
          st[prop["state"]] = !state[prop.state];
          return (
            <Nav.Item
              className={getCollapseInitialState(prop.views) ? "active" : ""}
              as="li"
              key={key}
            >
              <Nav.Link
                className={state[prop.state] ? "collapsed" : ""}
                data-toggle="collapse"
                onClick={(e) => {
                  e.preventDefault();
                  setState({ ...state, ...st });
                }}
                aria-expanded={state[prop.state]}
              >
                <i className={prop.icon}></i>
                <p>
                  {lang === "fr"
                    ? prop.name
                    : lang === "en"
                    ? prop.name_en
                    : prop.name_ar}
                  <b className="caret"></b>
                </p>
              </Nav.Link>
              <Collapse in={state[prop.state]}>
                <div>
                  <Nav as="ul">{createLinks(prop.views)}</Nav>
                </div>
              </Collapse>
            </Nav.Item>
          );
        }
        return (
          <Nav.Item className={activeRoute(prop.path)} key={key} as="li">
            <Nav.Link
              className={prop.className}
              to={prop.path}
              as={Link}
              onClick={() => {
                document.documentElement.classList.toggle("nav-open");
              }}
            >
              {prop.icon ? (
                <>
                  <i className={prop.icon} />
                  <p>
                    {lang === "fr"
                      ? prop.name
                      : lang === "en"
                      ? prop.name_en
                      : prop.name_ar}
                  </p>
                </>
              ) : (
                <>
                  <span className="sidebar-mini">{prop.mini}</span>
                  <span className="sidebar-normal">
                    {lang === "fr"
                      ? prop.name
                      : lang === "en"
                      ? prop.name_en
                      : prop.name_ar}
                  </span>
                </>
              )}
            </Nav.Link>
          </Nav.Item>
        );
      } else {
        return null;
      }
    });
  };
  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName) => {
    /* if (lang === "fr" && location.pathname === routeName)
      document.title = routes[i].name;
    else if (lang === "en" && location.pathname === routeName)
      document.title = routes[i].name_en;
    else if (lang === "ar" && location.pathname === routeName)
      document.title = routes[i].name_en; */
    return location.pathname === routeName ? "active" : "";
  };
  function getTitle(routeName, name) {
    /* if (lang === "fr" && location.pathname === routeName)
      document.title = name;
    else if (lang === "en" && location.pathname === routeName)
      document.title = name;
    else if (lang === "ar" && location.pathname === routeName) */
    if (location.pathname.toUpperCase() === routeName.toUpperCase())
      document.title = name;
  }
  /* function getTitle(routeName, name) {
    if (location.pathname.toUpperCase() === routeName.toUpperCase()) {
      if (routeName !== "/telechargerFichier/:id/:idBl") {
        localStorage.removeItem("file");
        localStorage.removeItem("returnList");
      }
      if (routeName !== "/ajouterProduit") {
        localStorage.removeItem("nomProd");
        localStorage.removeItem("idProd");
      }
      document.title = name;
      //return location.pathname === routeName ? routeName : "";
    }
  } */
  return (
    <>
      <div className={styleM} data-color={background}>
        <div className="sidebar-wrapper">
          <div className="close-mobile">
            <i
              className="fas fa-times"
              onClick={() =>
                document.documentElement.classList.toggle("nav-open")
              }
            ></i>
          </div>
          <div className="logo">
            <div className="bglogo">
              <a onClick={()=>{
                navigate.push("/declaration")
              }}>
                <img
                  src={require("../../assets/img/logo.png")}
                  alt="medicacom"
                />
              </a>
            </div>
          </div>

          {onlineStatus === 1 && routes.length !== 0 ? (
            <Nav as="ul">{createLinks(routes)}</Nav>
          ) : (
            ""
          )}

          {onlineStatus === 0 && routesIndex.length !== 0 ? (
            <Nav as="ul">{createLinks(routesIndex)}</Nav>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
}

Sidebar.defaultProps = {
  image: "",
  background: "black",
  routes: [],
};

export default Sidebar;
