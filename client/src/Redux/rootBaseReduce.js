import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Configuration from "../configuration";
var token = localStorage.getItem("x-access-token");

export const fetchRootBase = createAsyncThunk(
  "root/fetchRootBase",
  async () => {
    const response = await fetch(Configuration.BACK_BASEURL + "root/allRoot", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-access-token": token,
      },
    });
    const rootBase = await response.json();
    return rootBase;
  }
);

export const getRootByRole = createAsyncThunk("root/getRootByRole", async (role) => {
    var rootBase = await fetch(
      Configuration.BACK_BASEURL + "root/getRootByRole/" + role,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": token,
        },
      }
    )
    .then(response => {return response.json()})
      .catch((error) => {
        return { status: 403, error: error };
      });
    return rootBase;
  }
);

export const rootGetById = createAsyncThunk("root/rootGetById", async (id) => {
  const response = await fetch(
    Configuration.BACK_BASEURL + "root/getRoot/" + id,
    {
      method: "get",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-access-token": token,
      },
    }
  );
  const rootBase = await response.json();
  return rootBase;
});

export const rootBaseDeleted = createAsyncThunk(
  "root/deleteRoot",
  async (action) => {
    const response = await fetch(
      Configuration.BACK_BASEURL + "root/deleteRoot/" + action.id,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": token,
        },
      }
    );
    const rootBase = await response.json();
    return rootBase;
  }
);
const rootBaseReduce = createSlice({
  name: "rootBase",
  initialState: {
    entities: [],
    loading: false,
  },
  reducers: {
    rootBaseAdded(state, action) {
      fetch(Configuration.BACK_BASEURL + "root/addRoot", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": token,
        },
        body: JSON.stringify(action.payload),
      });
    },
    /* rootBaseDeleted(state, action) {
      const { id } = action.payload;
      fetch(Configuration.BACK_BASEURL + "root/deleteRoot/"+id, {
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
    [fetchRootBase.pending]: (state, action) => {
      state.loading = true;
    },
    [fetchRootBase.fulfilled]: (state, action) => {
      state.loading = false;
      state.entities = [...state.entities, ...action.payload];
    },
    [fetchRootBase.rejected]: (state, action) => {
      state.loading = false;
    },
    [getRootByRole.pending]: (state, action) => {
      state.loading = true;
    },
    [getRootByRole.fulfilled]: (state, action) => {
      state.loading = false;
      state.rootBase = [...state.entities, action.payload];
    },
    [getRootByRole.rejected]: (state, action) => {
      state.loading = false;
    },
  },
});

export const { rootBaseAdded } = rootBaseReduce.actions;

export default rootBaseReduce.reducer;
