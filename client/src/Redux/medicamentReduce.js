import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Configuration from "../configuration";
var token = localStorage.getItem("x-access-token");

export const fetchMedicament = createAsyncThunk("medicament/fetchMedicament", async () => {
  const response = await fetch(Configuration.BACK_BASEURL + "medicament/allMedicament", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },

  });
  const medicament = await response.json();
  return medicament;
});

export const medicamentGetById = createAsyncThunk("medicament/medicamentGetById", async (id1) => {
  const  id  = id1;
  const response = await fetch(Configuration.BACK_BASEURL + "medicament/getMedicament", {
    method: 'POST',
    headers: {
      'id':id,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  
  });
  const medicament = await response.json();
  return medicament;
});

export const medicamentDeleted = createAsyncThunk("medicament/deleteMedicament", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "medicament/deleteMedicament/"+action.id, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  });
  const medicament = await response.json();
  return medicament;
});

export const medicamentAdded = createAsyncThunk("medicament/addMedicament", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "medicament/addMedicament", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body: JSON.stringify(action)
  });
  const medicament = await response.json();
  return medicament;
});

export const medicamentChangeEtat = createAsyncThunk(
  "medicament/changeEtat",
  async (id) => {
    var medicament = await fetch(
      Configuration.BACK_BASEURL + "medicament/changeEtat/" + id,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": token,
        },
      }
    )
      .then((response) => {
        return response.json();
      })
      .catch((error) => {
        return { status: 403, error: error };
      });
    return medicament;
  }
);
export const getActiveMedicament = createAsyncThunk("medicament/getActive", async () => {
  var medicament = await fetch(Configuration.BACK_BASEURL + "medicament/getActive", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  })
    .then((response) => {
      return response.json();
    })
    .catch((error) => {
      return { status: 403, error: error };
    });
  return medicament;
});

const medicamentReduce = createSlice({
  name: "medicament",
  initialState: {
    entities: [],
    loading: false,
  },
  reducers: {
  },
  extraReducers: {

    [fetchMedicament.pending]: (state, action) => {
      state.loading = true;
    },
    [fetchMedicament.fulfilled]: (state, action) => {
      state.loading = false;
      state.entities = [...state.entities, ...action.payload];
    },
    [fetchMedicament.rejected]: (state, action) => {
      state.loading = false;
    },
  },
});

/* export const { medicamentAdded, medicamentUpdated } = medicamentReduce.actions; */

export default medicamentReduce.reducer;
