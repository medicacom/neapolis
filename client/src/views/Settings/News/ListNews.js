import SweetAlert from "react-bootstrap-sweetalert";
import { Button, Card, Container, Row, Col } from "react-bootstrap";
import React, { useEffect, useCallback, useMemo } from "react";
import {
  fetchNews,
  getFileNews,
  newsChangeEtat,
  newsDeleted,
} from "../../../Redux/newsReduce";
import { useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import MaterialReactTable from "material-react-table";
import { useHistory } from "react-router";
import { openDB } from "idb";
import { useTranslation } from "react-multi-lang";
import { MRT_Localization_FR } from "material-react-table/locales/fr";
import { MRT_Localization_EN } from "material-react-table/locales/en";
import { MRT_Localization_AR } from "../../utils/ar_table";
// core components
function ListNews({ onlineStatus, obj }) {
  let lang = window.localStorage.getItem("lang");
  const t = useTranslation();
  let db;
  const dispatch = useDispatch();
  const navigate = useHistory();
  const [alert, setAlert] = React.useState(null);
  const [entities, setEntities] = React.useState([]);
  const columns = useMemo(
    () => [
      //column definitions...
      {
        header: t("news.title"),
        accessorKey: "titre",
      },
      {
        header: t("description"),
        accessorKey: "description",
      },
      {
        header: t("news.date"),
        accessorKey: "date",
      },
      {
        header: t("actions"),
        accessorKey: "id",
        Cell: ({ cell, row }) => (
          <div className="actions-right block_action">
            <Button
              onClick={() => {
                confirmDetail(cell.row.original);
              }}
              variant="info"
              size="sm"
              className={"text-info btn-link"}
            >
              <i className={"fa fa-eye"} />
            </Button>
            <Button
              onClick={() => {
                confirmDelete(cell.row.original.id);
              }}
              variant="danger"
              size="sm"
              className={"text-danger btn-link"}
            >
              <i className={"fa fa-trash-alt"} />
            </Button>
          </div>
        ),
      },
      //end
    ],
    []
  );
  const notify = (type, msg) => {
    if (type === 1)
      toast.success(
        <strong>
          <i className="fas fa-check-circle"></i>
          {msg}
        </strong>
      );
    else
      toast.error(
        <strong>
          <i className="fas fa-exclamation-circle"></i>
          {msg}
        </strong>
      );
  };

  const confirmDelete = (id) => {
    setAlert(
      <SweetAlert
        style={{ display: "block", marginTop: "-100px" }}
        title="Vous éte sure de supprime cette ligne?"
        onConfirm={() => deleteNews(id)}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="info"
        cancelBtnBsStyle="danger"
        confirmBtnText="Oui"
        cancelBtnText="Non"
        showCancel
      ></SweetAlert>
    );
  };

  /* const getFile = React.useCallback(
    async (id) => {
      dispatch(getFileNews(id)).then(async (e1) => {
        var ff = null;
        ff = new Blob([e1.payload], {
          type: "application/*",
        });

        const f = await URL.createObjectURL(ff);
        console.log("await",f);
        return f;
      });
    },
    [dispatch]
  ); */
  const confirmDetail = React.useCallback(
    async (ligne) => {
      dispatch(getFileNews(ligne.id)).then(async (e1) => {
        var ff = null;
        ff = new Blob([e1.payload], {
          type: "application/*",
        });
        const fileURL = await URL.createObjectURL(ff);
        setAlert(
          <SweetAlert
            style={{ display: "block", marginTop: "-100px" }}
            title="Détail"
            onConfirm={() => hideAlert()}
            onCancel={() => hideAlert()}
            confirmBtnBsStyle="info"
            cancelBtnBsStyle="danger"
            confirmBtnText={t("close")}
            customClass="news-pop-up"
          >
            <Row>
              <Col md="12">Titre: {ligne.titre}</Col>
              <Col md="12">Description: {ligne.description}</Col>
              <Col md="12">Date: {ligne.date}</Col>
            </Row>
            <a
              download={ligne.file}
              rel="noreferrer"
              href={fileURL}
              target="_blank"
              className="fileUrl"
            >
              <i className="fas fa-file"></i>
              <br></br> Télécharger
            </a>
            {/* <ul>
              <li>Titre: {ligne.titre}</li>
              <li>Description: {ligne.description}</li>
              <li>Date: {ligne.date}</li>
            </ul> */}
          </SweetAlert>
        );
      });
    },
    [dispatch]
  );
  /* const confirmDetail = async (ligne) => {
    var fileURL = await getFile(ligne.id);
    console.log(fileURL)
    setAlert(
      <SweetAlert
        style={{ display: "block", marginTop: "-100px" }}
        title="Vous éte sure de supprime cette ligne?"
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="info"
        cancelBtnBsStyle="danger"
        confirmBtnText="Oui"
        cancelBtnText="Non"
        showCancel
      >
        <a
          download={ligne.file}
          rel="noreferrer"
          href={fileURL}
          target="_blank"
          className="btn btn-info"
        >
          <i className="fas fa-download"></i> Télécharger
        </a>
        :
      </SweetAlert>
    );
  }; */

  function deleteNews(id) {
    dispatch(newsDeleted({ id })).then((val) => {
      notify(1, "Supprimer avec succes");
      getNews();
      hideAlert();
    });
  }

  const hideAlert = () => {
    setAlert(null);
  };
  function ajouter() {
    navigate.push("ajouterNews");
  }

  //storeNews
  const storeNews = useCallback(async (resNews) => {
    const tx = db.transaction("news", "readwrite");
    for (let index = 0; index < resNews.length; index++) {
      await tx.objectStore("news").add({
        titre: resNews[index].titre,
        description: resNews[index].description,
        date: resNews[index].date,
        etat: resNews[index].etat,
        id: resNews[index].id,
        saved: 1,
        updated: 0,
        deleted: 0,
        type_table: 4,
      });
    }
  }, []);

  async function clearNews(resNews) {
    let txNews = db.transaction("news", "readwrite");
    await txNews.objectStore("news").clear();
    if (resNews.length != 0) storeNews(resNews);
  }

  const getNews = useCallback(async () => {
    var news = await dispatch(fetchNews());
    var resNews = await news.payload;
    setEntities(resNews);
    clearNews(resNews);
  }, [dispatch]);

  async function initNews() {
    const tx = db.transaction("news", "readwrite");
    let newsStore = tx.objectStore("news");
    let news = await newsStore.getAll();
    setEntities(news);
  }
  async function init() {
    db = await openDB("medis", 1, {});
    if (onlineStatus === 1) getNews();
    else {
      initNews();
    }
  }

  useEffect(() => {
    init();
  }, []); //now shut up eslint

  function ListTable({ list }) {
    return (
      <MaterialReactTable
        columns={columns}
        data={list}
        enableColumnActions={true}
        enableColumnFilters={true}
        enablePagination={true}
        enableSorting={true}
        enableBottomToolbar={true}
        enableTopToolbar={true}
        muiTableBodyRowProps={{ hover: false }}
        localization={
          lang === "fr"
            ? MRT_Localization_FR
            : lang === "ar"
            ? MRT_Localization_AR
            : MRT_Localization_EN
        }
      />
    );
  }

  return (
    <>
      {alert}
      <Container fluid>
        <ToastContainer />
        <Row>
          <Col md="12">
            <Button
              className="btn-wd  mr-1 float-left"
              type="button"
              variant="success"
              onClick={ajouter}
            >
              <span className="btn-label">
                <i className="fas fa-plus"></i>
              </span>
              {t("news.add")}
            </Button>
          </Col>

          <Col md="12">
            <h4 className="title">{t("news.list")}</h4>
            <Card className="card-header">
              <Card.Body>
                <ListTable list={entities}></ListTable>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default ListNews;
