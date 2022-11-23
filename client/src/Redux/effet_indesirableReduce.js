import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Configuration from "../configuration";
var token = localStorage.getItem("x-access-token");

export const fetchEffet_indesirable = createAsyncThunk("effet_indesirable/fetchEffet_indesirable", async () => {
  const response = await fetch(Configuration.BACK_BASEURL + "effet_indesirable/allEffet_indesirable", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },

  });
  const effet_indesirable = await response.json();
  return effet_indesirable;
});

export const effet_indesirableGetById = createAsyncThunk("effet_indesirable/effet_indesirableGetById", async (id1) => {
  const  id  = id1;
  const response = await fetch(Configuration.BACK_BASEURL + "effet_indesirable/getEffet_indesirable", {
    method: 'POST',
    headers: {
      'id':id,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  
  });
  const effet_indesirable = await response.json();
  return effet_indesirable;
});

export const effet_indesirableDeleted = createAsyncThunk("effet_indesirable/deleteEffet_indesirable", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "effet_indesirable/deleteEffet_indesirable/"+action.id, {
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

export const effet_indesirableAdded = createAsyncThunk("effet_indesirable/addEffet_indesirable", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "effet_indesirable/addEffet_indesirable", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body: JSON.stringify(action)
  });
  const effet_indesirable = await response.json();
  return effet_indesirable;
});

export const effet_indesirableChangeEtat = createAsyncThunk(
  "effet_indesirable/changeEtat",
  async (id) => {
    var effet_indesirable = await fetch(
      Configuration.BACK_BASEURL + "effet_indesirable/changeEtat/" + id,
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
    return effet_indesirable;
  }
);

/* export const subscribe = createAsyncThunk("effet_indesirable/subscribe", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "effet_indesirable/subscribe", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body: JSON.stringify(action)
  });
  const effet_indesirable = await response.status;
  return effet_indesirable;
}); */

const effet_indesirableReduce = createSlice({
  name: "effet_indesirable",
  initialState: {
    entities: [],
    loading: false,
  },
  reducers: {
    /* effet_indesirableDeleted(state, action) {
      const { id } = action.payload;
      fetch(Configuration.BACK_BASEURL + "effet_indesirable/deleteEffet_indesirable/"+id, {
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

    [fetchEffet_indesirable.pending]: (state, action) => {
      state.loading = true;
    },
    [fetchEffet_indesirable.fulfilled]: (state, action) => {
      state.loading = false;
      state.entities = [...state.entities, ...action.payload];
    },
    [fetchEffet_indesirable.rejected]: (state, action) => {
      state.loading = false;
    },
  },
});

/* export const { effet_indesirableAdded, effet_indesirableUpdated } = effet_indesirableReduce.actions; */

export default effet_indesirableReduce.reducer;
