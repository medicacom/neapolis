import { Button, Card, Container, Row, Col } from "react-bootstrap";
import React, { useEffect, useCallback } from "react";
import {
  getDeclarations,
  getDeclarationsById,
} from "../../Redux/declarationReduce";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import SweetAlert from "react-bootstrap-sweetalert";
import { toast, ToastContainer } from "react-toastify";
import MaterialReactTable from "material-react-table";
import { useMemo } from "react";

// core components
function ListDeclaration() {
  document.title = "Liste des ages";
  const dispatch = useDispatch();
  const navigate = useHistory();
  const [alert, setAlert] = React.useState(null);
  const [entities, setEntities] = React.useState([]);
  const columns = useMemo(
    () => [
      //column definitions...
      {
        header: "Utilisateur",
        accessorKey: "users.nom",
        Cell: ({ cell, row }) => (
          <div>
            {cell.row.original.users.nom} {cell.row.original.users.prenom}
          </div>
        ),
      },
      {
        header: "Utilisateur",
        accessorKey: "patients.sexe",
        Cell: ({ cell, row }) => (
          <div>
            {cell.row.original.patients.sexe === 1
              ? "Homme"
              : cell.row.original.patients.sexe === 2
              ? "Femme"
              : "Autre"}
          </div>
        ),
      },
      {
        header: "Medicaments",
        accessorKey: "medicaments.nom",
      },
      {
        header: "Date",
        accessorKey: "createdAt",
        Cell: ({ cell, row }) => (
          <div>
            {/* {new Date(cell.row.original.patients.createdAt).format('DD/MM/YYYY')} */}
            {new Date(
              new Date(cell.row.original.patients.createdAt).getTime() -
                new Date(
                  cell.row.original.patients.createdAt
                ).getTimezoneOffset() *
                  60000
            )
              .toISOString()
              .slice(0, 10)}
          </div>
        ),
      },
      {
        header: "Détail",
        accessorKey: "id",
        Cell: ({ cell, row }) => (
          <div className="actions-right block_action">
            <Button
              onClick={() => {
                confirmMessage(cell.row.original.id);
              }}
              variant="warning"
              size="sm"
              className="text-warning btn-link edit"
            >
              <i className="fa fa-eye" />
            </Button>
          </div>
        ),
      },
      //end
    ],
    []
  );
  function ajouter() {
    navigate.push("/declaration");
  }

  const getAge = useCallback(
    async (titre) => {
      var age = await dispatch(getDeclarations());
      setEntities(age.payload);
    },
    [dispatch]
  );
  const confirmMessage = async (id, e) => {
    var dec = await dispatch(getDeclarationsById(id));
    var data = await dec.payload;
    setAlert(
      <SweetAlert
        customClass="pop-up-extra"
        style={{ display: "block", marginTop: "-100px" }}
        title={"Détail patient déclarer"}
        onConfirm={() => hideAlert()}
        confirmBtnBsStyle="info"
        cancelBtnBsStyle="danger"
        confirmBtnText="Oui"
        cancelBtnText="Non"
      >
        <Row>
          <Col md="4">
            <h3>Patient</h3>
            <ul>
              <li>
                <strong>Nom personnel: </strong>
                {data.users.nom + " " + data.users.prenom}
              </li>
              {/* <li>
                <strong>Adresse email: </strong>
                {data.users.email}
              </li>
              <li>
                <strong>Numéro téléphone: </strong>
                {data.users.tel}
              </li>
              <li>
                <strong>Specialite: </strong>
                {data.users.specialites.nom}
              </li> */}
              <li>
                <strong>Date: </strong>
                {new Date(
                  new Date(data.patients.createdAt).getTime() -
                    new Date(data.patients.createdAt).getTimezoneOffset() *
                      60000
                )
                  .toISOString()
                  .slice(0, 10)}
              </li>
              <li>
                <strong>Initiales: </strong>
                {data.patients.initiales}
              </li>
              <li>
                <strong>Sexe: </strong>
                {data.patients.sexe === 1
                  ? "Homme"
                  : data.patients.sexe === 2
                  ? "Femme"
                  : "Autre"}
              </li>
              <li>
                <strong>Âge du patient: </strong>
                {data.patients.age === 1
                  ? data.patients.dateNaissance
                  : data.patients.age === 2
                  ? data.patients.agePatient
                  : data.patients.ages.description}
              </li>
              <li>
                <strong>Indiquation: </strong>
                {data.patients.indications.description}
              </li>
            </ul>
          </Col>
          <Col md="4">
            <h3>Médicament suspecté</h3>
            <ul>
              <li>
                <strong>Nom du médicament: </strong>
                {data.medicaments.nom}
              </li>
              <li>
                <strong>Numéro du lot: </strong>
                {data.numero}
              </li>
              <li>
                <strong>Posologie: </strong>
                {data.posologie}
              </li>
              <li>
                <strong>Voix administrations: </strong>
                {data.voix_administrations.description}
              </li>
              <li>
                <strong>Date de début: </strong>
                {data.dateDebutAdmin}
              </li>
              <li>
                <strong>Date de fin: </strong>
                {data.dateFinAdmin}
              </li>
            </ul>
          </Col>
          <Col md="4">
            <h3>Effets indésirables</h3>
            <ul>
              <li>
                <strong>Effets indésirables: </strong>
                {data.effet_indesirables.description}
              </li>
              <li>
                <strong>Date de début: </strong>
                {data.dateDebut}
              </li>
              <li>
                <strong>Date de fin: </strong>
                {data.dateFin}
              </li>
              <li>
                <strong>Information: </strong>
                {data.information}
              </li>
              <li>
                <strong>Complémentaires: </strong>
                {data.complementaires}
              </li>
            </ul>
          </Col>
        </Row>
        {/* <table className="table table-bordered">
          <thead>
            <tr className="table-info">
              <th>Nom personnel</th>
              <th>Date</th>
              <th>Initiales</th>
              <th>Sexe</th>
              <th>Âge du patient</th>
              <th>Indiquation</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{data.users.nom + " " + data.users.prenom}</td>
              <td>
                {new Date(
                  new Date(data.patients.createdAt).getTime() -
                    new Date(data.patients.createdAt).getTimezoneOffset() *
                      60000
                )
                  .toISOString()
                  .slice(0, 10)}
              </td>
              <td>{data.patients.initiales}</td>
              <td>
                {data.patients.sexe === 1
                  ? "Homme"
                  : data.patients.sexe === 2
                  ? "Femme"
                  : "Autre"}
              </td>
              <td>
                {data.patients.age === 1
                  ? data.patients.dateNaissance
                  : data.patients.age === 2
                  ? data.patients.agePatient
                  : data.patients.ages.description}
              </td>
              <td>{data.patients.indications.description}</td>
            </tr>
          </tbody>
        </table>
        <h2>Détail médicament</h2>
        
        <table className="table table-bordered">
          <thead>
            <tr className="table-info">
              <th>Effets indésirables</th>
              <th>Date de début</th>
              <th>Date de fin</th>
              <th>Information </th>
              <th>Complémentaires </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{data.effet_indesirables.description}</td>
              <td>{data.dateDebut}</td>
              <td>{data.dateFin}</td>
              <td>{data.information}</td>
              <td>{data.complementaires}</td>
            </tr>
          </tbody>
        </table>
        
        <table className="table table-bordered">
          <thead>
            <tr className="table-info">
              <th>Nom du médicament</th>
              <th>Numéro du lot</th>
              <th>Posologie</th>
              <th>Voix administrations</th>
              <th>Date de début</th>
              <th>Date de fin</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{data.medicaments.nom}</td>
              <td>{data.numero}</td>
              <td>{data.posologie}</td>
              <td>{data.voix_administrations.description}</td>
              <td>{data.dateDebutAdmin}</td>
              <td>{data.dateFinAdmin}</td>
            </tr>
          </tbody>
        </table> */}
      </SweetAlert>
    );
  };
  const hideAlert = () => {
    setAlert(null);
  };

  useEffect(() => {
    getAge();
  }, [getAge]); //now shut up eslint

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
              Ajouter un declaration
            </Button>
          </Col>
          <Col md="12">
            <h4 className="title">Liste des declarations</h4>
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

export default ListDeclaration;
