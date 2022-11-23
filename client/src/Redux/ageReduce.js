import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Configuration from "../configuration";
var token = localStorage.getItem("x-access-token");

export const fetchAge = createAsyncThunk("age/fetchAge", async () => {
  const response = await fetch(Configuration.BACK_BASEURL + "age/allAge", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },

  });
  const age = await response.json();
  return age;
});

export const ageGetById = createAsyncThunk("age/ageGetById", async (id1) => {
  const  id  = id1;
  const response = await fetch(Configuration.BACK_BASEURL + "age/getAge", {
    method: 'POST',
    headers: {
      'id':id,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  
  });
  const age = await response.json();
  return age;
});
export const deleteAge = createAsyncThunk("age/deleteAge", async (id) => {
  const response = await fetch(Configuration.BACK_BASEURL + "age/deleteAge/"+id, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  
  });
  const age = await response.json();
  return age;
});

export const ageAdded = createAsyncThunk("age/addAge", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "age/addAge", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body: JSON.stringify(action)
  });
  const sujet = await response.status;
  return sujet;
});
const ageReduce = createSlice({
  name: "age",
  initialState: {
    entities: [],
    loading: false,
  },
  reducers: {
    /* ageAdded(state, action) {
      fetch(Configuration.BACK_BASEURL + "age/addAge", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-access-token':token
        },
        body: JSON.stringify(action.payload)
      });
    }, */
    ageUpdated(state, action) {
      fetch(Configuration.BACK_BASEURL + "age/addAge", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-access-token':token
        },
        body: JSON.stringify(action.payload)
      });
    },
    ageDeleted(state, action) {
      const { id } = action.payload;
      fetch(Configuration.BACK_BASEURL + "age/deleteAge/"+id, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-access-token':token
        },
      });
    },

  },
  extraReducers: {

    [fetchAge.pending]: (state, action) => {
      state.loading = true;
    },
    [fetchAge.fulfilled]: (state, action) => {
      state.loading = false;
      state.entities = [...state.entities, ...action.payload];
    },
    [fetchAge.rejected]: (state, action) => {
      state.loading = false;
    },
    [ageGetById.pending]: (state, action) => {
      state.loading = true;
    },
    [ageGetById.fulfilled]: (state, action) => {
      state.loading = false;
      state.entities = [...state.entities, action.payload];
    },
    [ageGetById.rejected]: (state, action) => {
      state.loading = false;
    },
  },
});

export const { ageUpdated, ageDeleted } = ageReduce.actions;

export default ageReduce.reducer;
