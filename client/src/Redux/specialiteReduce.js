import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Configuration from "../configuration";
var token = localStorage.getItem("x-access-token");

export const fetchSpecialite = createAsyncThunk("specialite/fetchSpecialite", async () => {
  const response = await fetch(Configuration.BACK_BASEURL + "specialite/allSpecialite", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },

  });
  const specialite = await response.json();
  return specialite;
});

export const specialiteGetById = createAsyncThunk("specialite/specialiteGetById", async (id1) => {
  const  id  = id1;
  const response = await fetch(Configuration.BACK_BASEURL + "specialite/getSpecialite", {
    method: 'POST',
    headers: {
      'id':id,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  
  });
  const specialite = await response.json();
  return specialite;
});
export const specialiteChangerEtat = createAsyncThunk("specialite/changerEtat", async (id) => {
  const response = await fetch(Configuration.BACK_BASEURL + "specialite/changerEtat/"+id, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  });
  const specialite = await response.status;
  return specialite;
});
export const getActiveSpecialite = createAsyncThunk("specialite/getActiveSpecialite", async () => {
  const response = await fetch(Configuration.BACK_BASEURL + "specialite/getActive", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },

  });
  const specialite = await response.json();
  return specialite;
});
const specialiteReduce = createSlice({
  name: "specialite",
  initialState: {
    entities: [],
    loading: false,
  },
  reducers: {
    specialiteAdded(state, action) {
      fetch(Configuration.BACK_BASEURL + "specialite/addSpecialite", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-access-token':token
        },
        body: JSON.stringify(action.payload)
      });
    },

  },
  extraReducers: {

    [fetchSpecialite.pending]: (state, action) => {
      state.loading = true;
    },
    [fetchSpecialite.fulfilled]: (state, action) => {
      state.loading = false;
      state.entities = [...state.entities, ...action.payload];
    },
    [fetchSpecialite.rejected]: (state, action) => {
      state.loading = false;
    },
    [specialiteGetById.pending]: (state, action) => {
      state.loading = true;
    },
    [specialiteGetById.fulfilled]: (state, action) => {
      state.loading = false;
      state.entities = [...state.entities, action.payload];
    },
    [specialiteGetById.rejected]: (state, action) => {
      state.loading = false;
    },
  },
});

export const { specialiteAdded, specialiteUpdated, specialiteDeleted } = specialiteReduce.actions;

export default specialiteReduce.reducer;
