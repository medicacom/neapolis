import React, { useCallback, useEffect } from "react";
import Components from "./components";
import Sidebar from "./components/Sidebar/Sidebar";
import AdminNavbar from "./components/Navbars/AdminNavbar";
import Footer from "./components/Footer/Footer";
import { Route, Switch, useLocation } from "react-router-dom";
import { getRootByRole } from "./Redux/rootBaseReduce";
import { verification, getDetailUser } from "./Redux/usersReduce";
import { useDispatch } from "react-redux";
import { openDB } from "idb/with-async-ittr";
import { updateDB } from "./Redux/offlineReduce";

function RootBase({ id }) {
  let lang = window.localStorage.getItem("lang");
  var dir = lang !== "ar" ? "ltr" : "rtl";
  var styleM = lang !== "ar" ? "main-panel" : "main-panel main-panel-ar";

  let db;
  const location = useLocation();
  const dispatch = useDispatch();

  const [users, setUsers] = React.useState(null);
  const [usersOff, setUsersOff] = React.useState(null);
  const [loaderTable, setLoaderTable] = React.useState(true);
  const [onlineStatus, setOnlineStatus] = React.useState(1);
  const [entities, setEntities] = React.useState([]);
  const [entitiesOff, setEntitiesOff] = React.useState([]);

  //mode online
  const getRoutes = (routes) => {
    var id_role = onlineStatus === 1 ? users.user.id_role : usersOff.id_role;
    var obj = onlineStatus === 1 ? users : usersOff;
    console.log(users, usersOff, routes);
    return routes.map((prop, key) => {
      if (prop.collapse) {
        return getRoutes(prop.views);
      }
      if (prop.role.includes(id_role) || prop.role.includes(20)) {
        var component = React.createElement(
          Components[prop.componentStr],
          { obj: obj, onlineStatus: onlineStatus },
          null
        );
        return <Route path={prop.path} key={key} render={() => component} />;
      }
      return null;
    });
  };

  async function initRoot() {
    db = await openDB("medis", 1, {});
    const tx = db.transaction("rootBase", "readwrite");
    const index = tx.store.index("parent");
    let store = tx.objectStore("rootBase");
    let rootArray = await store.getAll();
    console.log("rootArray", rootArray);
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
          className: e.className,
          path: "/" + e.path,
          name: e.name,
          icon: e.icon,
          role: arrayRoleFils,
          componentStr: e.component,
          parent: e.parent,
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
          className: objRole.className,
          name: objRole.name,
          icon: objRole.icon,
          role: arrayRole,
          componentStr: objRole.component,
          parent: objRole.parent,
        };
        arrayParent.push(obj);
      } else {
        var obj = {
          collapse: true,
          path: "/" + objRole.path,
          name: objRole.name,
          state: "pere" + objRole.id,
          className: objRole.className,
          icon: objRole.icon,
          role: arrayRole,
          views: arrayView,
        };
        arrayParent.push(obj);
      }
    }
    console.log("arrayParent", arrayParent);
    setEntitiesOff(arrayParent);
  }

  async function initUser() {
    db = await openDB("medis", 1, {});
    const tx = db.transaction("detailUser", "readwrite");
    let store = tx.objectStore("detailUser");
    let detail = await store.getAll();
    if (detail.length !== 0) setUsersOff(detail[0]);
  }

  async function updateIndex(ch) {
    const tx = db.transaction(ch, "readwrite");
    const index = tx.store.index("saved");
    var nb = 0;
    for await (const cursor of index.iterate(0)) {
      nb++;
      var obj = { ...cursor.value };
      obj.saved = 1;
      cursor.update(obj);
    }
    await tx.done;
    return nb;
  }
  async function saveData(user) {
    if (user) {
      db = await openDB("medis", 1, {});

      /** start get all table **/

      var roleStore = await db.getAllFromIndex("roles", "saved", 0);
      var userStore = await db.getAllFromIndex("users", "saved", 0);
      var newsStore = await db.getAllFromIndex("news", "saved", 0);
      var indicationsStore = await db.getAllFromIndex(
        "indications",
        "saved",
        0
      );
      var voixStore = await db.getAllFromIndex(
        "voix_administrations",
        "saved",
        0
      );
      var effStore = await db.getAllFromIndex("effet_indesirables", "saved", 0);
      var medicamentStore = await db.getAllFromIndex("medicaments", "saved", 0);

      /** end get all table **/

      /** start update all table **/

      var nbR = await updateIndex("roles");
      var nbN = await updateIndex("news");
      var nbU = await updateIndex("users");
      var nbI = await updateIndex("indications");
      var nbV = await updateIndex("voix_administrations");
      var nbE = await updateIndex("effet_indesirables");
      var nbM = await updateIndex("medicaments");

      /** start update all table **/

      var len1 = nbR + nbN + nbU + nbI + nbV + nbE + nbM;
      var len2 =
        newsStore.length +
        roleStore.length +
        userStore.length +
        indicationsStore.length +
        voixStore.length +
        effStore.length +
        medicamentStore.length;
      /* var insertRole = [];
      var arrayFinal = []; */
      dispatch(
        updateDB({
          newsStore: newsStore,
          userStore: userStore,
          roleStore: roleStore,
          indicationsStore: indicationsStore,
          voixStore: voixStore,
          effStore: effStore,
          medicamentStore: medicamentStore,
          id: user.user.id,
        })
      ).then(() => {
        if (len1 === len2) setLoaderTable(false);
      });
    }
  }

  //verif token
  const getRoot = useCallback(
    async (user) => {
      if (user) {
        dispatch(getRootByRole(user.user.id_role)).then((val) => {
          if (val.payload.status) {
            initRoot();
          } else {
            setEntities(val.payload);
          }
        });
        saveData(user);
      }
    },
    [dispatch, saveData]
  );

  const getUser = useCallback(async () => {
    dispatch(getDetailUser(id)).then((val) => {
      if (val.payload.status) {
        console.log("getDetailUser");
        setOnlineStatus(0);
        initRoot();
        initUser();
        setLoaderTable(false);
      } else {
        console.log("eee");
        setOnlineStatus(1);
        var res = val.payload.data;
        setUsers(res);
        verifToken(res);
        /* getRoot(res); */
      }
    });
  }, [dispatch]);

  //verif token
  const verifToken = useCallback(
    async (res) => {
      var response = await dispatch(verification());
      if (response.payload === false) {
        localStorage.clear();
        window.location.replace("/login");
      } else {
        getRoot(res);
      }
    },
    [dispatch, getRoot]
  );

  useEffect(() => {
    getUser();
    if (location.pathname === "/") {
      window.location.replace("/profile");
    }
    /* getUser(users); */
  }, []);

  return (
    <>
      {loaderTable ? (
        <div class="loader-container">
          <div class="loader"></div>
        </div>
      ) : (
        ""
      )}
      {users && entities.length > 0 && onlineStatus === 1 && !loaderTable ? (
        <div className="wrapper" dir={dir}>
          {location.pathname !== "/declaration" ? (
            <Sidebar users={users} onlineStatus={onlineStatus} />
          ) : (
            ""
          )}
          <div className={location.pathname !== "/declaration" ? styleM : ""}>
            {location.pathname !== "/declaration" ? (
              <AdminNavbar users={users} onlineStatus={onlineStatus} />
            ) : (
              ""
            )}
            <div className="content">
              <Switch>{entities.length > 0 ? getRoutes(entities) : ""}</Switch>
            </div>
            {location.pathname !== "/declaration" ? <Footer /> : ""}
            <div
              className="close-layer"
              onClick={() =>
                document.documentElement.classList.toggle("nav-open")
              }
            />
          </div>
        </div>
      ) : (
        ""
      )}
      {console.log(entitiesOff)}
      {console.log(entities)}
      {usersOff &&
      entitiesOff.length > 0 &&
      onlineStatus === 0 &&
      !loaderTable ? (
        <div className="wrapper">
          <Sidebar users={usersOff} onlineStatus={onlineStatus} />
          <div className="main-panel">
            <AdminNavbar users={usersOff} onlineStatus={onlineStatus} />
            <div className="content">
              <Switch>
                {entitiesOff.length > 0 ? getRoutes(entitiesOff) : ""}
              </Switch>
            </div>
            <Footer />
            <div
              className="close-layer"
              onClick={() =>
                document.documentElement.classList.toggle("nav-open")
              }
            />
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
}

export default RootBase;
