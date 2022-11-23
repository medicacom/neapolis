import React from "react";
import { Link, useLocation } from "react-router-dom";
import jwt_decode from "jwt-decode";
// react-bootstrap components
import { Collapse, Nav } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { openDB } from 'idb/with-async-ittr'; 
import { updateDB } from "../../Redux/offlineReduce";
function Sidebar({ background,users,onlineStatus }) {
  let db;
  var ifConnected = window.navigator.onLine;
  const dispatch = useDispatch();
  let location = useLocation();
  const [state, setState] = React.useState({});
  /* const { entities } = useSelector((state) => state.settings); */
  const { rootBase } = useSelector((state) => state.rootBase);
  var routes = rootBase?rootBase[0]:[];
  const [routesIndex, setRoutesIndex] = React.useState([]);
  var token = localStorage.getItem("x-access-token");
  var decoded = jwt_decode(token);
  var id_role = onlineStatus === 1 ? users.user.id_role:users.id_role;
  async function initRole() {
    db = await openDB("medis", 1, {});
    const tx = db.transaction('roles', 'readwrite');
    let rolesStore = tx.objectStore('roles');
    let roles = await rolesStore.getAll();
    var insertRole = [];
    var updateRole = [];
    for (const key in roles) {
      const element = roles[key];
      const index = tx.store.index('id');
      for await (const cursor of index.iterate(parseInt(element.id))) {
        var objRole = { ...cursor.value };
        if(element.saved === 0){        
          insertRole.push({
            nom: element.nom,
            role: element.role,
            order: element.order,          
          });
          objRole.saved =1;
        } else if(element.updated === 1){
          updateRole.push(element);
          objRole.updated = 0;
        }
        cursor.update(objRole);
      }
    }
    await tx.done;
    dispatch(updateDB({ insertRole:insertRole, updateRole:updateRole,id:users.user.id }));
  }

  async function initRoot() {
    db = await openDB("medis", 1, {});
    const tx = db.transaction('rootBase', 'readwrite');
    const index = tx.store.index('parent');
    let store = tx.objectStore('rootBase');
    let rootArray = await store.getAll();
    var arrayView = [];
    for (const key in rootArray) {
      var e = rootArray[key];
      if(e.parent !==0) {
        var rolesFils=e.role;
        var splitRoleFils = rolesFils.split(",");
        var arrayRoleFils=[];
        splitRoleFils.forEach(element=>{
          arrayRoleFils.push(parseInt(element));
        })
        arrayView.push({
          path: "/"+e.path,
          name: e.name,
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
      const pos = arrayView.map(e => e.parent).indexOf(objRole.id);
      
      var rolesFils=objRole.role;
      var splitRoleFils = rolesFils.split(",");
      var arrayRole=[];
      splitRoleFils.forEach(element=>{
        arrayRole.push(parseInt(element));
      })
      if(pos === -1){
        var obj = {
          path: "/"+objRole.path,
          name: objRole.name,
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
          path: "/"+objRole.path,
          name: objRole.name,
          state: "pere"+objRole.id,
          icon: objRole.icon,
          role: arrayRole,
          className: objRole.className,
          views:arrayView
        };
        arrayParent.push(obj);
      }
    }
    setRoutesIndex(arrayParent);
  }
  React.useEffect(() => {
    if(onlineStatus === 0) {
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
      if ((prop.role.includes(id_role)) || prop.role.includes(20)) {
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
                  {prop.name} <b className="caret"></b>
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
            {/* {getTitle(prop.path, prop.name)} */}
            <Nav.Link className={prop.className} to={prop.path} as={Link}>
              {prop.icon ? (
                <>
                  <i className={prop.icon} />
                  <p>{prop.name}</p>
                </>
              ) : (
                <>
                  <span className="sidebar-mini">{prop.mini}</span>
                  <span className="sidebar-normal">{prop.name}</span>
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
    return location.pathname === routeName ? "active" : "";
  };
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
      <div className="sidebar" data-color={background}>
        <div className="sidebar-wrapper">
          <div className="logo">
            <div className="bglogo">
              <img src={require("../../assets/img/logo.png")} alt="medicacom"/>
            </div>
          </div>
          
          {onlineStatus === 1 && routes.length !== 0?
            <Nav as="ul">
              {createLinks(routes)}
            </Nav>
          :""}

          {onlineStatus === 0 && routesIndex.length !== 0?
            <Nav as="ul">
              {createLinks(routesIndex)}
            </Nav>
          :""}
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
