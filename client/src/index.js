import React from "react";
import ReactDOM from "react-dom/client";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import reportWebVitals from "./reportWebVitals";

import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { Provider } from "react-redux";

import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/scss/style.scss?v=2.0.0";
import "./assets/css/style.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import store from "./store";
import LoginPage from "./views/Settings/User/LoginPage";
import jwt_decode from "jwt-decode";
import RootBase from "./RootBase";
import { openDB } from "idb";

const root = ReactDOM.createRoot(document.getElementById("root"));
var token = null;
var hrefURL = null;
token = localStorage.getItem("x-access-token");
var testLogin = 0;
console.log("ListAge. ABD1")
openDB("medis", 1, {
  upgrade(db) {

    //create detailUser store
    var storeDetail = db.createObjectStore("detailUser", {
      keyPath: "idUser",
      autoIncrement: true,
    });
    storeDetail.createIndex('login', 'login');

    //create role store
    var storeRoles = db.createObjectStore("roles", {
      keyPath: "id",
      autoIncrement: true,
    });
    storeRoles.createIndex('id', 'id');
    storeRoles.createIndex('saved', 'saved');
    
    //create rootBase store
    var storeRoot = db.createObjectStore("rootBase", {
      keyPath: "id",
      autoIncrement: true,
    });
    storeRoot.createIndex('id', 'id');
    storeRoot.createIndex('parent', 'parent');

    //create users store
    var storeUser = db.createObjectStore("users", {
      keyPath: "id",
      autoIncrement: true,
    });
    storeUser.createIndex('id', 'id');
    storeUser.createIndex('saved', 'saved');

    //create news store
    var storeNews = db.createObjectStore("news", {
      keyPath: "id",
      autoIncrement: true,
    });
    storeNews.createIndex('id', 'id');
    storeNews.createIndex('saved', 'saved');

    //create voix_administrations store
    var storeVoix = db.createObjectStore("voix_administrations", {
      keyPath: "id",
      autoIncrement: true,
    });
    storeVoix.createIndex('id', 'id');
    storeVoix.createIndex('saved', 'saved');

    //create indications store
    var storeIndications = db.createObjectStore("indications", {
      keyPath: "id",
      autoIncrement: true,
    });
    storeIndications.createIndex('id', 'id');
    storeIndications.createIndex('saved', 'saved');

    //create gouvernorats store
    var storeGouvernorats = db.createObjectStore("gouvernorats", {
      keyPath: "id",
      autoIncrement: true,
    });
    storeGouvernorats.createIndex('id', 'id');

    //create annees store
    var storeAnnee = db.createObjectStore("annees", {
      keyPath: "id",
      autoIncrement: true,
    });
    storeAnnee.createIndex('id', 'id');

    //create effet_indesirable store
    var storeEffet = db.createObjectStore("effet_indesirables", {
      keyPath: "id",
      autoIncrement: true,
    });
    storeEffet.createIndex('id', 'id');
    storeEffet.createIndex('saved', 'saved');

    //create medicament store
    var storeMedicament = db.createObjectStore("medicaments", {
      keyPath: "id",
      autoIncrement: true,
    });
    storeMedicament.createIndex('id', 'id');
    storeMedicament.createIndex('saved', 'saved');

    //create specialites store
    var storeSpecialites = db.createObjectStore("specialites", {
      keyPath: "id",
      autoIncrement: true,
    });
    storeSpecialites.createIndex('id', 'id');
    storeSpecialites.createIndex('saved', 'saved');
  },
});
var id =0;
if (token !== null) {
  try {
    var decoded = jwt_decode(token);
    testLogin = 1;
    if (decoded.id) 
      id = decoded.id;
    else {
      localStorage.clear();
      window.location.replace("/login");
    }
  } catch (err) {
    console.log("eee", err);
  }
}
if (hrefURL === "/login") {
  document.title = "login";
}
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        {testLogin === 0 ? (
          <Switch>
            <Route path="/login" render={() => <LoginPage />} key={"1"} />
            <Redirect from="/" to="/login" />
          </Switch>
        ) : (
          <RootBase id={id}/>
        )}
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

/* swDev(); */
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
