import SweetAlert from "react-bootstrap-sweetalert";
import { Button, Card, Container, Row, Col } from "react-bootstrap";
import React, { useEffect, useCallback, useMemo } from "react";
import {
  fetchNews,
  newsChangeEtat,
  newsDeleted,
} from "../../../Redux/newsReduce";
import { useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import MaterialReactTable from "material-react-table";
import { useHistory } from "react-router";
import { openDB } from "idb";
import { useTranslation } from "react-multi-lang";
// core components
function ListNews({ onlineStatus }) {
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
        header: "Description",
        accessorKey: "description",
      },
      {
        header: "Date",
        accessorKey: "date",
      },
      {
        accessorKey: "id",
        header: "actions",
        Cell: ({ cell, row }) => (
          <div className="actions-right block_action">
            <Button
              onClick={() => {
                navigate.push("/news/update/" + cell.row.original.id);
              }}
              variant="warning"
              size="sm"
              className="text-warning btn-link edit"
            >
              <i className="fa fa-edit" />
            </Button>
            <Button
              onClick={(event) => {
                changeEtat(cell.row.original.id, cell.row.original.etat);
              }}
              variant="danger"
              size="sm"
              className={
                cell.row.original.etat === 1
                  ? "text-success btn-link delete"
                  : "text-danger btn-link delete"
              }
            >
              <i
                className={
                  cell.row.original.etat === 1 ? "fa fa-check" : "fa fa-times"
                }
              />
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
  const hideAlert = () => {
    setAlert(null);
  };
  function ajouter() {
    navigate.push("ajouterNews");
  }
  function deleteNews(id, e) {
    dispatch(newsDeleted({ id })).then((val) => {
      notify(1, "News supprimer avec succes");
      getNews();
      hideAlert();
    });
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
      />
    );
  }

  async function updateNews(id, etat) {
    const tx = db.transaction("news", "readwrite");
    const index = tx.store.index("id");
    for await (const cursor of index.iterate(parseInt(id))) {
      var obj = { ...cursor.value };
      switch (etat) {
        case 0:
          obj.etat = 1;
          notify(1, "Activer avec succes");
          break;
        case 1:
          obj.etat = 0;
          notify(1, "Désactiver avec succes");
          break;
        default:
          break;
      }

      obj.updated = 1;
      cursor.update(obj);
    }
    await tx.done;
    initNews();
  }
  function changeEtat(id, e) {
    /* setEntities([]); */
    if (onlineStatus === 1) {
      dispatch(newsChangeEtat(id)).then((e1) => {
        getNews();
        switch (e) {
          case 0:
            notify(1, t("enable"));
            break;
          case 1:
            notify(1, t("disable"));
            break;
          default:
            break;
        }
      });
    } else {
      updateNews(id, e);
    }
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
