import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Configuration from "../configuration";
var token = localStorage.getItem("x-access-token");

export const declarationAdded = createAsyncThunk("declaration/addDeclaration", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "declaration/addDeclaration", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body: JSON.stringify(action)
  });
  const declaration = await response.status;
  return declaration;
});
const declarationReduce = createSlice({
  name: "declaration",
  initialState: {
    entities: [],
    loading: false,
  },
  reducers: {
    /* declarationAdded(state, action) {
      fetch(Configuration.BACK_BASEURL + "declaration/addDeclaration", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-access-token':token
        },
        body: JSON.stringify(action.payload)
      });
    }, */

  },
  extraReducers: {    
  },
});

export default declarationReduce.reducer;
