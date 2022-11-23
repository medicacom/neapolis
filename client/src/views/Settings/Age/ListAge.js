import { Button, Card, Container, Row, Col } from "react-bootstrap";
import React, { useEffect, useCallback } from "react";
import { fetchAge, deleteAge } from "../../../Redux/ageReduce";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { verification } from "../../../Redux/usersReduce";
import SweetAlert from "react-bootstrap-sweetalert";
import { toast, ToastContainer } from "react-toastify";
import MaterialReactTable from 'material-react-table';
import { useMemo } from "react";

// core components
function ListAge() {
  document.title = "Liste des ages";
  const dispatch = useDispatch();
  const navigate = useHistory();
  const [entities, setEntities] = React.useState([]);
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
  const columns = useMemo(
    () => [
      //column definitions...
      {
        header: "Age",
        accessorKey: "age",
      },
      {
        accessorKey: 'id',
        header: 'actions',        
        Cell: ({ cell, row }) => (
          <div className="actions-right block_action">
            <Button
              onClick={() => {
                navigate("/age/update/" + cell.row.original.id);
              }}
              variant="warning"
              size="sm"
              className="text-warning btn-link edit"
            >
              <i className="fa fa-edit" />
            </Button>
            <Button
              onClick={() => {
                deleteMessage(cell.row.original.id);
              }}
              variant="danger"
              size="sm"
              className="text-danger btn-link delete"
            >
              <i className="fa fa-trash" />
            </Button>
          </div>
        ),
      },
      //end
    ],
    [],
  );
  const [alert, setAlert] = React.useState(null);
  function ajouter() {
    navigate.push("/ajouterAge");
  }

  const getAge = useCallback(
    async (titre) => {
      var age = await dispatch(fetchAge());
      setEntities(age.payload);
    },
    [dispatch]
  );

  useEffect(() => {
    getAge();
  }, [getAge]); //now shut up eslint
  const deleteMessage = useCallback(
    async (id) => {
      setAlert(
        <SweetAlert
          showCancel
          style={{ display: "block", marginTop: "-100px" }}
          title="Étes vous sure de supprimer cette ligne?"
          onConfirm={() => deleteAges(id)}
          onCancel={() => hideAlert()}
          confirmBtnBsStyle="info"
          cancelBtnBsStyle="danger"
          confirmBtnText="Oui"
          cancelBtnText="Non"
        ></SweetAlert>
      );
    },
    [dispatch]
  );
  const hideAlert = () => {
    setAlert(null);
  };
  function deleteAges(id) {
    dispatch(deleteAge(id)).then((e) => {
      if (e.payload === true) {
        notify(1, "Supprimer avec succes");
        getAge();
        hideAlert();
      } else {
        notify(2, "Vérifier vos données");
      }
    });
  }
  
  function ListTable({list}){
    return (<MaterialReactTable
      columns={columns}
      data={list}
      enableColumnActions={true}
      enableColumnFilters={true}
      enablePagination={true}
      enableSorting={true}
      enableBottomToolbar={true}
      enableTopToolbar={true}
      muiTableBodyRowProps={{ hover: false }}
    /> )
  }
  return (
    <>
      {alert}
      <ToastContainer />
      <Container fluid>
        <Row>
          <Col md="12">
            <Button
              id="saveBL"
              className="btn-wd  mr-1 float-left"
              type="button"
              variant="success"
              onClick={ajouter}
            >
              <span className="btn-label">
                <i className="fas fa-plus"></i>
              </span>
              Ajouter un age
            </Button>
          </Col>
          <Col md="12">
            <h4 className="title">Liste des ages</h4>
            <Card>
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

export default ListAge;
