import SweetAlert from "react-bootstrap-sweetalert";
import { Button, Card, Container, Row, Col } from "react-bootstrap";
import React, { useEffect, useCallback, useMemo } from "react";
import { fetchMedicament, medicamentChangeEtat, medicamentDeleted } from "../../../Redux/medicamentReduce";
import { useDispatch } from "react-redux";
import { verification } from "../../../Redux/usersReduce";
import { toast, ToastContainer } from "react-toastify";
import MaterialReactTable from 'material-react-table';
import { useHistory } from "react-router";
import { openDB } from "idb";
/* import { openDB } from 'idb/with-async-ittr'; */
// core components
function ListMedicament({onlineStatus}) {
  let db;
  const dispatch = useDispatch();
  const navigate = useHistory();
  const [alert, setAlert] = React.useState(null);
  const [entities, setEntities] = React.useState([]);
  const columns = useMemo(
    () => [
      //column definitions...
      {
        header: "Nom",
        accessorKey: "nom",
      },
      {
        header: "Form",
        accessorKey: "form",
      },
      {
        header: "Dosage",
        accessorKey: "dosage",
      },
      {
        accessorKey: 'id',
        header: 'actions',        
        Cell: ({ cell, row }) => (
          <div className="actions-right block_action">
            <Button
              onClick={() => {
                navigate.push("/medicament/update/" + cell.row.original.id);
              }}
              variant="warning"
              size="sm"
              className="text-warning btn-link edit"
            >
              <i className="fa fa-edit" />
            </Button>
            <Button
              onClick={(event) => {
                changeEtat(cell.row.original.id,cell.row.original.etat);
              }}
              variant="danger"
              size="sm"
              className={cell.row.original.etat === 1?"text-success btn-link delete":"text-danger btn-link delete"}
            >
              <i className={cell.row.original.etat === 1?"fa fa-check":"fa fa-times"}/>
            </Button>
          </div>
        ),
      },
      //end
    ],
    [],
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
        title="Vous éte sure de supprime cette medicament?"
        onConfirm={() => deleteMedicament(id, e)}
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
  const hideAlert = () => {
    setAlert(null);
  };
  function ajouter() {
    navigate.push("ajouterMedicament");
  }
  function deleteMedicament(id, e) {
    dispatch(medicamentDeleted({ id })).then((val) => {
      notify(1 , "Medicament supprimer avec succes");    
      getMedicament();
      hideAlert();
    });
  }

  //storeMedicament
  const storeMedicament = useCallback(async (resMedicament) => {
    const tx = db.transaction("medicaments", "readwrite");
    for (let index = 0; index < resMedicament.length; index++) {
      await tx.objectStore("medicaments").add({
        nom: resMedicament[index].nom,
        form: resMedicament[index].form,
        dosage: resMedicament[index].dosage,
        id_voix: resMedicament[index].id_voix,
        nom_voix: resMedicament[index].indications.description,
        id_indication: resMedicament[index].id_indication,
        nom_indication: resMedicament[index].voix_administrations.description,
        etat: resMedicament[index].etat,
        id: resMedicament[index].id,
        saved:1,
        updated:0,
        deleted:0,
        type_table:4
      });
    }
  }, []);

  async function clearMedicament(resMedicament) {
    let txMedicament = db.transaction("medicaments", "readwrite");
    await txMedicament.objectStore("medicaments").clear();
    if(resMedicament.length!=0)
      storeMedicament(resMedicament);
  }

  const getMedicament = useCallback(
    async () => {
      var medicament = await dispatch(fetchMedicament());
      var resMedicament = await medicament.payload;
      setEntities(resMedicament);
      clearMedicament(resMedicament)
    },
    [dispatch]
  );

  async function initMedicament() {
    const tx = db.transaction('medicaments', 'readwrite');
    let medicamentStore = tx.objectStore('medicaments');
    let medicament = await medicamentStore.getAll();
    setEntities(medicament);
  }
  async function init() {
    db = await openDB("medis", 1, {});
    if(onlineStatus === 1)
      getMedicament();
    else {      
      initMedicament();
    }
  }
  
  useEffect(() => {
    init();
  }, []); //now shut up eslint
  
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


  async function updateMedicament(id,etat) {
    const tx = db.transaction('medicament', 'readwrite');
      const index = tx.store.index('id');
      for await (const cursor of index.iterate(parseInt(id))) {
        var obj = { ...cursor.value };
        switch(etat){
          case 0:obj.etat = 1; notify(1, "Activer avec succes");break; 
          case 1:obj.etat = 0; notify(1, "Désactiver avec succes");break;
          default:break;
        } 
        
        obj.updated = 1;
        cursor.update(obj);
      }
      await tx.done;
      initMedicament();
  }
  function changeEtat(id,e) {
    /* setEntities([]); */
    if(onlineStatus === 1){
      dispatch(medicamentChangeEtat( id )).then(e1=>{
        getMedicament();
        switch(e){
          case 0: notify(1, "Activer avec succes");break; 
          case 1:notify(1, "Désactiver avec succes");break;
          default:break;
        } 
      });
    } else {
      updateMedicament(id,e)
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
              id="saveBL"
              className="btn-wd  mr-1 float-left"
              type="button"
              variant="success"
              onClick={ajouter}
            >
              <span className="btn-label">
                <i className="fas fa-plus"></i>
              </span>
              Ajouter un medicament
            </Button>
          </Col>

          <Col md="12">
            <h4 className="title">Liste des medicaments</h4>
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

export default ListMedicament;
