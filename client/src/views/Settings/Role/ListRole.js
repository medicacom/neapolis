import SweetAlert from "react-bootstrap-sweetalert";
import { Button, Card, Container, Row, Col } from "react-bootstrap";
import React, { useEffect, useCallback, useMemo } from "react";
import { fetchRole, roleDeleted } from "../../../Redux/roleReduce";
import { useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import MaterialReactTable from "material-react-table";
import { useHistory } from "react-router";
import { openDB } from "idb";
import { useTranslation } from "react-multi-lang";
// core components
function ListRole({ onlineStatus }) {
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
        header: t("name"),
        accessorKey: "nom",
      },
      {
        header: t("state"),
        accessorKey: "etat",
        Cell: ({ cell }) =>
          cell.row.original.etat === 1 ? t("enabled") : t("disabled"),
      },
      {
        header: t("actions"),
        accessorKey: "id",
        Cell: ({ cell, row }) => (
          <div className="actions-right block_action">
            <Button
              onClick={() => {
                navigate.push("/role/update/" + cell.row.original.id);
              }}
              variant="warning"
              size="sm"
              className="text-warning btn-link edit"
            >
              <i className="fa fa-edit" />
            </Button>
            <Button
              id={"idLigne_" + cell.row.original.id}
              onClick={(e) => {
                confirmMessage(cell.row.original.id, e);
              }}
              variant="danger"
              size="sm"
              className="text-danger btn-link delete"
            >
              <i
                className="fa fa-trash"
                id={"idLigne_" + cell.row.original.id}
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

  const confirmMessage = (id, e) => {
    setAlert(
      <SweetAlert
        style={{ display: "block", marginTop: "-100px" }}
        title="Vous éte sure de supprime cette role?"
        onConfirm={() => deleteRole(id, e)}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="info"
        cancelBtnBsStyle="danger"
        confirmBtnText="Oui"
        cancelBtnText="Non"
        showCancel
      >
        {/* Vous éte sure de supprime cette User? */}
      </SweetAlert>
    );
  };
  
  function deleteRole(id, e) {
    dispatch(roleDeleted({ id })).then((val) => {
      notify(1, "Role supprimer avec succes");
      getRole();
      hideAlert();
    });
  }

  const hideAlert = () => {
    setAlert(null);
  };

  function ajouter() {
    navigate.push("ajouterRole");
  }

  //storeRoles
  const storeRoles = useCallback(async (resRole) => {
    const tx = db.transaction("roles", "readwrite");
    for (let index = 0; index < resRole.length; index++) {
      await tx.objectStore("roles").add({
        nom: resRole[index].nom,
        order: resRole[index].order,
        role: resRole[index].role,
        id: resRole[index].id,
        saved: 1,
        updated: 0,
        deleted: 0,
        type_table: 2,
      });
    }
  }, []);

  async function clearRole(resRole) {
    let txRole = db.transaction("roles", "readwrite");
    await txRole.objectStore("roles").clear();
    storeRoles(resRole);
  }

  const getRole = useCallback(async () => {
    var role = await dispatch(fetchRole());
    var resRole = await role.payload;
    setEntities(resRole);
    if (resRole.length != 0) clearRole(resRole);
  }, [dispatch]);

  async function initRole() {
    const tx = db.transaction("roles", "readwrite");
    let rolesStore = tx.objectStore("roles");
    let roles = await rolesStore.getAll();
    setEntities(roles);
  }
  async function init() {
    db = await openDB("medis", 1, {});
    if (onlineStatus === 1) getRole();
    else {
      initRole();
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
              {t("role.add")}
            </Button>
          </Col>

          <Col md="12">
            <h4 className="title">{t("role.list")}</h4>
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

export default ListRole;
