import SweetAlert from "react-bootstrap-sweetalert";
import { Button, Card, Container, Row, Col } from "react-bootstrap";
import React, { useEffect, useCallback, useMemo } from "react";
import { fetchIndication, indicationChangeEtat, indicationDeleted } from "../../../Redux/indicationReduce";
import { useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import MaterialReactTable from 'material-react-table';
import { useHistory } from "react-router";
import { openDB } from "idb";
/* import { openDB } from 'idb/with-async-ittr'; */
// core components
function ListIndication({onlineStatus}) {
  let db;
  const dispatch = useDispatch();
  const navigate = useHistory();
  const [alert, setAlert] = React.useState(null);
  const [entities, setEntities] = React.useState([]);
  const columns = useMemo(
    () => [
      //column definitions...
      {
        header: "Description",
        accessorKey: "description",
      },
      {
        accessorKey: 'id',
        header: 'actions',        
        Cell: ({ cell, row }) => (
          <div className="actions-right block_action">
            <Button
              onClick={() => {
                navigate.push("/indication/update/" + cell.row.original.id);
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
           {/*  <Button
              id={"idLigne_" + cell.row.original.id}
              onClick={(e) => {
                confirmMessage(cell.row.original.id,e);
              }}
              variant="danger"
              size="sm"
              className="text-danger btn-link delete"
            >
              <i className="fa fa-trash" id={"idLigne_" + cell.row.original.id}/>
            </Button> */}
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
        title="Vous éte sure de supprime cette indication?"
        onConfirm={() => deleteIndication(id, e)}
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
    navigate.push("ajouterIndication");
  }
  function deleteIndication(id, e) {
    dispatch(indicationDeleted({ id })).then((val) => {
      notify(1 , "Indication supprimer avec succes");    
      getIndication();
      hideAlert();
    });
  }

  //storeIndication
  const storeIndication = useCallback(async (resIndication) => {
    const tx = db.transaction("indications", "readwrite");
    for (let index = 0; index < resIndication.length; index++) {
      await tx.objectStore("indications").add({
        description: resIndication[index].description,
        etat: resIndication[index].etat,
        id: resIndication[index].id,
        saved:1,
        updated:0,
        deleted:0,
        type_table:6
      });
    }
  }, []);

  async function clearIndication(resIndication) {
    let txIndication = db.transaction("indications", "readwrite");
    await txIndication.objectStore("indications").clear();
    if(resIndication.length!=0)
      storeIndication(resIndication);
  }

  const getIndication = useCallback(
    async () => {
      var indication = await dispatch(fetchIndication());
      var resIndication = await indication.payload;
      setEntities(resIndication);
      clearIndication(resIndication)
    },
    [dispatch]
  );

  async function initIndication() {
    const tx = db.transaction('indications', 'readwrite');
    let indicationStore = tx.objectStore('indications');
    let indication = await indicationStore.getAll();
    setEntities(indication);
  }
  async function init() {
    db = await openDB("medis", 1, {});
    if(onlineStatus === 1)
      getIndication();
    else {      
      initIndication();
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


  async function updateIndication(id,etat) {
    const tx = db.transaction('indication', 'readwrite');
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
      initIndication();
  }
  function changeEtat(id,e) {
    /* setEntities([]); */
    if(onlineStatus === 1){
      dispatch(indicationChangeEtat( id )).then(e1=>{
        getIndication();
        switch(e){
          case 0: notify(1, "Activer avec succes");break; 
          case 1:notify(1, "Désactiver avec succes");break;
          default:break;
        } 
      });
    } else {
      updateIndication(id,e)
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
              Ajouter un indication
            </Button>
          </Col>

          <Col md="12">
            <h4 className="title">Liste des indication</h4>
            <Card className="card-header">
              <Card.Body>                
                <ListTable list={entities}></ListTable>
                {/* <MaterialReactTable
                  columns={columns}
                  data={entities}
                  enableColumnActions={true}
                  enableColumnFilters={true}
                  enablePagination={true}
                  enableSorting={true}
                  enableBottomToolbar={true}
                  enableTopToolbar={true}
                  muiTableBodyRowProps={{ hover: false }}
                /> */} 
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default ListIndication;
