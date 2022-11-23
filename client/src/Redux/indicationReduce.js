import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Configuration from "../configuration";
var token = localStorage.getItem("x-access-token");

export const fetchIndication = createAsyncThunk("indication/fetchIndication", async () => {
  const response = await fetch(Configuration.BACK_BASEURL + "indication/allIndication", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },

  });
  const indication = await response.json();
  return indication;
});

export const indicationGetById = createAsyncThunk("indication/indicationGetById", async (id1) => {
  const  id  = id1;
  const response = await fetch(Configuration.BACK_BASEURL + "indication/getIndication", {
    method: 'POST',
    headers: {
      'id':id,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  
  });
  const indication = await response.json();
  return indication;
});

export const indicationDeleted = createAsyncThunk("indication/deleteIndication", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "indication/deleteIndication/"+action.id, {
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

export const indicationAdded = createAsyncThunk("indication/addIndication", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "indication/addIndication", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body: JSON.stringify(action)
  });
  const indication = await response.json();
  return indication;
});

export const indicationChangeEtat = createAsyncThunk(
  "indication/changeEtat",
  async (id) => {
    var indication = await fetch(
      Configuration.BACK_BASEURL + "indication/changeEtat/" + id,
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
    return indication;
  }
);
export const getActiveIndication = createAsyncThunk("indication/getActive", async () => {
  var indication = await fetch(Configuration.BACK_BASEURL + "indication/getActive", {
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
  return indication;
});

const indicationReduce = createSlice({
  name: "indication",
  initialState: {
    entities: [],
    loading: false,
  },
  reducers: {
    /* indicationDeleted(state, action) {
      const { id } = action.payload;
      fetch(Configuration.BACK_BASEURL + "indication/deleteIndication/"+id, {
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

    [fetchIndication.pending]: (state, action) => {
      state.loading = true;
    },
    [fetchIndication.fulfilled]: (state, action) => {
      state.loading = false;
      state.entities = [...state.entities, ...action.payload];
    },
    [fetchIndication.rejected]: (state, action) => {
      state.loading = false;
    },
  },
});

/* export const { indicationAdded, indicationUpdated } = indicationReduce.actions; */

export default indicationReduce.reducer;
