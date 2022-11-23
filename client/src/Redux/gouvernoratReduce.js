import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Configuration from "../configuration";

var token = localStorage.getItem("x-access-token");
export const fetchGouvernorat = createAsyncThunk("gouvernorat/fetchGouvernorat", async () => {
  const response = await fetch(Configuration.BACK_BASEURL + "gouvernorat/allGouvernorat", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },

  });
  const gouvernorat = await response.json();
  return gouvernorat;
});
const gouvernoratReduce = createSlice({
  name: "gouvernorat",
  initialState: {
    entities: [],
    loading: false,
  },
  reducers: {},
  extraReducers: {

    [fetchGouvernorat.pending]: (state, action) => {
      state.loading = true;
    },
    [fetchGouvernorat.fulfilled]: (state, action) => {
      state.loading = false;
      state.entities = [...state.entities, ...action.payload];
    },
    [fetchGouvernorat.rejected]: (state, action) => {
      state.loading = false;
    },
  },
});

/* export const { } = gouvernoratReduce.actions; */

export default gouvernoratReduce.reducer;
