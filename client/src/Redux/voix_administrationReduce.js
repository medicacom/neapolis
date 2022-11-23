import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Configuration from "../configuration";
var token = localStorage.getItem("x-access-token");

export const fetchVoix_administration = createAsyncThunk("voix_administration/fetchVoix_administration", async () => {
  const response = await fetch(Configuration.BACK_BASEURL + "voix_administration/allVoix_administration", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },

  });
  const voix_administration = await response.json();
  return voix_administration;
});

export const voix_administrationGetById = createAsyncThunk("voix_administration/voix_administrationGetById", async (id1) => {
  const  id  = id1;
  const response = await fetch(Configuration.BACK_BASEURL + "voix_administration/getVoix_administration", {
    method: 'POST',
    headers: {
      'id':id,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  
  });
  const voix_administration = await response.json();
  return voix_administration;
});

export const voix_administrationDeleted = createAsyncThunk("voix_administration/deleteVoix_administration", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "voix_administration/deleteVoix_administration/"+action.id, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  });
  const rootBase = await response.json();
  return rootBase;
});

export const voix_administrationAdded = createAsyncThunk("voix_administration/addVoix_administration", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "voix_administration/addVoix_administration", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body: JSON.stringify(action)
  });
  const voix_administration = await response.json();
  return voix_administration;
});

export const voix_administrationChangeEtat = createAsyncThunk(
  "voix_administration/changeEtat",
  async (id) => {
    var voix_administration = await fetch(
      Configuration.BACK_BASEURL + "voix_administration/changeEtat/" + id,
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
    return voix_administration;
  }
);
export const getActiveVoix = createAsyncThunk("voix_administration/getActive", async () => {
  var voix_administration = await fetch(Configuration.BACK_BASEURL + "voix_administration/getActive", {
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
  return voix_administration;
});

const voix_administrationReduce = createSlice({
  name: "voix_administration",
  initialState: {
    entities: [],
    loading: false,
  },
  reducers: {
    /* voix_administrationDeleted(state, action) {
      const { id } = action.payload;
      fetch(Configuration.BACK_BASEURL + "voix_administration/deleteVoix_administration/"+id, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-access-token':token
        },
      });
    }, */

  },
  extraReducers: {

    [fetchVoix_administration.pending]: (state, action) => {
      state.loading = true;
    },
    [fetchVoix_administration.fulfilled]: (state, action) => {
      state.loading = false;
      state.entities = [...state.entities, ...action.payload];
    },
    [fetchVoix_administration.rejected]: (state, action) => {
      state.loading = false;
    },
  },
});

/* export const { voix_administrationAdded, voix_administrationUpdated } = voix_administrationReduce.actions; */

export default voix_administrationReduce.reducer;
