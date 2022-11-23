import SweetAlert from "react-bootstrap-sweetalert";
import { Button, Card, Container, Row, Col } from "react-bootstrap";
import React,{useEffect,useCallback, useMemo} from "react";
import { fetchRootBase,rootBaseDeleted } from "../../../Redux/rootBaseReduce";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { verification } from "../../../Redux/usersReduce";
import MaterialReactTable from 'material-react-table';
import { toast, ToastContainer } from "react-toastify";
import { openDB } from "idb";

// core components
function ListRootBase({onlineStatus}) {
  let db
  const notify = (type,msg) => {
    if(type === 1)
      toast.success(<strong><i className="fas fa-check-circle"></i>{msg}</strong>);
    else 
      toast.error(<strong><i className="fas fa-exclamation-circle"></i>{msg}</strong>);
  }
  const dispatch = useDispatch();
  const navigate = useHistory();
  const [alert, setAlert] = React.useState(null);
  const [entities, setEntities] = React.useState([]);
  const columns = useMemo(
    () => [
      //column definitions...
      {
        header: "name",
        accessorKey: "name",
      },
      {
        header: "path",
        accessorKey: "path",
      },
      {
        header: "component",
        accessorKey: "component",
      },
      {
        accessorKey: 'id',
        header: 'actions',        
        Cell: ({ cell, row }) => (
          <div className="actions-right block_action">
            <Button
              onClick={() => {
                navigate.push("/root/update/" + cell.row.original.id);
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
                confirmMessage(cell.row.original.id,e);
              }}
              variant="danger"
              size="sm"
              className="text-danger btn-link delete"
            >
              <i className="fa fa-trash" id={"idLigne_" + cell.row.original.id}/>
            </Button>
          </div>
        ),
      },
      //end
    ],
    [],
  );
  const confirmMessage = (id,e) => {
    setAlert(
      <SweetAlert
        style={{ display: "block", marginTop: "-100px" }}
        title="Vous éte sure de supprime cette root?"
        onConfirm={() => deleteRoot(id,e)}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="info"
        cancelBtnBsStyle="danger"
        confirmBtnText="Oui"
        cancelBtnText="Non"
        showCancel
      >
        Vous éte sure de supprime cette root?
      </SweetAlert>
    );
  };
  const hideAlert = () => {
    setAlert(null);
  };
  function ajouter() {
    navigate.push('/ajouterRoot');
  }
  function deleteRoot(id,e) {
    dispatch(rootBaseDeleted({ id })).then(val=>{
      notify(1 , "Root supprimer avec succes");    
      hideAlert();
      getRoot();
    });
  }

  //storeUsers
  const storeUsers = useCallback(async (resRoots) => {
    //store user
    const tx = db.transaction("rootBase", "readwrite");
    for (let index = 0; index < resRoots.length; index++) {
      await tx.objectStore("rootBase").add({
        id: resRoots[index].id,
        name: resRoots[index].name,
        className: resRoots[index].className,
        path: resRoots[index].path,
        component: resRoots[index].component,
        icon: resRoots[index].icon,
        role: resRoots[index].role,
        ordre: resRoots[index].ordre,
        parent: resRoots[index].parent,
        saved:1,
        updated:0,
        type_table:1
      });
    }
  }, [dispatch]);

  async function clearUsers(resRoots) {
    let tx = db.transaction("rootBase", "readwrite");
    await tx.objectStore("rootBase").clear();
    storeUsers(resRoots);
  }
  
  const getRoot = useCallback(async () => {
    var response = await dispatch(fetchRootBase());
    var resRoots = response.payload;
    setEntities(resRoots);
    clearUsers(resRoots)
  }, [dispatch]);

  async function initRoot() {
    const tx = db.transaction('rootBase', 'readwrite');
    let store = tx.objectStore('rootBase');
    let users = await store.getAll();
    setEntities(users);
  }

  async function init() {
    db = await openDB("medis", 1, {});
    if(onlineStatus === 1)
      getRoot();
    else {      
      initRoot();
    }
  }
  
  useEffect(() => {
    /* getRoot(); */
    init();
  }, [])
  
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
              Ajouter une route
            </Button>
          </Col>
          <Col md="12">
            <h4 className="title">Liste des routes</h4>
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

export default ListRootBase;
