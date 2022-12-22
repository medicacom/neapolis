import React, { useCallback } from "react";
import { Navbar, Container, Nav, Dropdown, Button } from "react-bootstrap";
import { useHistory } from "react-router";
import { useTranslation } from "react-multi-lang";
import { useDispatch } from "react-redux";
import { getNotification, updateNotif } from "../../Redux/notificationReduce";
import { openDB } from "idb/with-async-ittr";

function Header({ users, onlineStatus }) {
  let db;
  const [notification, setNotification] = React.useState([]);
  const [nb, setNb] = React.useState(0);
  const dispatch = useDispatch();
  var lang = window.localStorage.getItem("lang");
  const t = useTranslation();
  var navigate = useHistory();
  let nom =
    onlineStatus === 1
      ? users.user.prenom + " " + users.user.nom
      : users.prenom + " " + users.nom;
  let idUser = onlineStatus === 1 ? users.user.id : users.id;

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
  const changeEtat = useCallback(
    async (id, etat) => {
      dispatch(
        updateNotif({
          id: id,
          idUser: idUser,
        })
      ).then((e) => {
        switch (etat) {
          case 1:
            window.location.replace("/listPersonel");
            break;
          case 2:
            window.location.replace("/listNews");
            break;
          case 3:
            window.location.replace("/listDeclaration");
            break;
          default:
            getNotif();
            break;
        }
      });
    },
    [dispatch, idUser, navigate]
  );

  function setData(notif) {
    var array = [];
    array.push(
      <Dropdown.Item
        className="enteteDropDown"
        href="#"
        key={"entet" + notif.length}
      >
        {notif.length} {lang === "ar" ? "مَعلومات" : "Notification"}
      </Dropdown.Item>
    );
    var arrayDiv = [];
    notif.forEach((element) => {
      var text =
        lang === "fr"
          ? element.text
          : lang === "en"
          ? element.text_en
          : element.text_ar;
      arrayDiv.push(
        <Dropdown.Item
          className={element.lu === 0 ? "nonlu" : ""}
          href="#"
          key={"notif" + element.id}
          onClick={() => {
            changeEtat(element.id, element.etat);
          }}
        >
          {text}
        </Dropdown.Item>
      );
    });
    array.push(
      <div key="onScroll" className={arrayDiv.length > 7 ? "onScroll" : ""}>
        {arrayDiv}
      </div>
    );
    if (notif.length === 0) {
      var text1 =
        lang === "fr"
          ? "Aucune notification trouvée"
          : lang === "en"
          ? "No notification find"
          : "لم يتم العثور على مَعلومات";
      array.push(
        <Dropdown.Item href="#" key={0}>
          {text1}
        </Dropdown.Item>
      );
    }
    var text2 =
      lang === "fr"
        ? "Lire toutes les notifications"
        : lang === "en"
        ? "Read all notifications"
        : "اقرأ جميع مَعلومات";
    array.push(
      <Dropdown.Item
        className="footerDropDown"
        href="#"
        key={"footer" + array.length}
        onClick={(event) => {
          changeEtat(0, -1);
          /* dispatch(updateNotif({id:0,idUser:idUser})); */
          /* window.location.reload() */
        }}
      >
        {text2}
      </Dropdown.Item>
    );
    setNb(notif.length);
    setNotification(array);
  }

  //storeNotif
  const storeNotif = useCallback(async (res) => {
    console.log(res)
    const tx = db.transaction("notifications", "readwrite");
    for (let index = 0; index < res.length; index++) {
      await tx.objectStore("notifications").add({
        id: res[index].id,
        id_user: res[index].id_user,
        lu: res[index].lu,
        text: res[index].text,
        text_ar: res[index].text_ar,
        text_en: res[index].text_en,
        etat: res[index].etat,
        saved: 1,
        updated: 0,
        deleted: 0,
        type_table: 10,
      });
    }
  }, []);

  async function clearNotif(res) {
    let txNotif = db.transaction("notifications", "readwrite");
    await txNotif.objectStore("notifications").clear();
    storeNotif(res);
  }

  async function initNotif() {
    const tx = db.transaction("notifications", "readwrite");
    const index = tx.store.index("id_user");
    var notifs = [];
    for await (const cursor of index.iterate(parseInt(idUser))) {
      var obj = { ...cursor.value };
      notifs.push(obj)
    }
    await tx.done;
    console.log("notifs",notifs)
    setData(notifs);
    /* let notifs = await store.getAll();
    setData(notifs); */
  }

  const getNotif = useCallback(async () => {
    db = await openDB("medis", 1, {});
    if (onlineStatus === 1)
      dispatch(getNotification(idUser)).then((val) => {
        setData(val.payload);
        if (val.payload.length != 0) clearNotif(val.payload);
      });
    else {
      initNotif();
    }
  }, [dispatch]);

  React.useEffect(() => {
    getNotif();
  }, [getNotif]);

  return (
    <Navbar bg="light" expand="lg">
      <Container fluid>
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
        {/* <Navbar.Collapse id="basic-navbar-nav" in={collapseOpen}> */}
        <Nav className={lang !== "ar" ? "ml-auto" : "mr-auto"} navbar>
          <Dropdown as={Nav.Item} className="dropdown-notification">
            <Dropdown.Toggle as={Nav.Link} id="dropdown-1" variant="default">
              <i className="fas fa-bell"></i>
              <span className="notification">{nb}</span>
            </Dropdown.Toggle>
            <Dropdown.Menu className="noScroll">{notification}</Dropdown.Menu>
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
              <span className="no-icon">{t("lang.language")}</span>
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
                <img src={require("../../assets/img/en.png")} alt="medicacom" />
                {t("lang.en")}
              </Dropdown.Item>
              <Dropdown.Item
                className={lang === "fr" ? "active_lang" : ""}
                href="#"
                onClick={(e) => {
                  window.localStorage.setItem("lang", "fr");
                  window.location.reload();
                }}
              >
                <img src={require("../../assets/img/fr.png")} alt="medicacom" />
                {t("lang.fr")}
              </Dropdown.Item>
              <Dropdown.Item
                className={lang === "ar" ? "active_lang" : ""}
                href="#"
                onClick={(e) => {
                  window.localStorage.setItem("lang", "ar");
                  window.location.reload();
                }}
              >
                <img src={require("../../assets/img/ar.png")} alt="medicacom" />
                {t("lang.ar")}
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
                {t("User.profile")}
              </Dropdown.Item>
              <Dropdown.Item href="#" onClick={LogOut}>
                {/* <i className="nc-icon nc-button-power"></i> */}
                <i class="fas fa-power-off"></i>
                {t("disconnect")}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
        {/* </Navbar.Collapse> */}
      </Container>
    </Navbar>
  );
}

export default Header;
