import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Configuration from "../configuration";
var token = localStorage.getItem("x-access-token");

export const getSettings = createAsyncThunk("settings/getSettings", async (id1) => {
  const  id  = id1;
  const response = await fetch(Configuration.BACK_BASEURL + "settings/getSettings", {
    method: 'POST',
    headers: {
      'id':id,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  
  });
  var status = await response.status;
  var data = await response.json();
  var obj = status === 200? {status:status,data:data}: {status:status,data:[]};
  const settings = await obj;
  return settings;
});

export const getLogo = createAsyncThunk("settings/getLogo", async (logo) => { 
  const response = await fetch(Configuration.BACK_BASEURL + "settings/getLogo/"+logo.logo, {
    method: 'GET',  
    responseType: 'blob'
  })
  return response;
});
const settingsReduce = createSlice({
  name: "settings",
  initialState: {
    entities: [],
    loading: false,
  },
  reducers: {
    settingsUpdated(state, action) {

      fetch(Configuration.BACK_BASEURL + "settings/saveLogo", {
        method: 'POST',
        headers: {
          'Accept': 'application/*',
          'x-access-token':token
        },
        body:action.payload.dataArray
      });

      fetch(Configuration.BACK_BASEURL + "settings/saveIcon", {
        method: 'POST',
        headers: {
          'Accept': 'application/*',
          'x-access-token':token
        },
        body:action.payload.iconArray
      });
      fetch(Configuration.BACK_BASEURL + "settings/updateSettings", {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-access-token':token
        },
        body:JSON.stringify(action.payload.settingsObj)
      });
    },

  },
  extraReducers: {
    [getSettings.pending]: (state, action) => {
      state.loading = true;
    },
    [getSettings.fulfilled]: (state, action) => {
      state.loading = false;
      state.entities = [...state.entities, action.payload];
    },
    [getSettings.rejected]: (state, action) => {
      state.loading = false;
    },
  },
});

export const { settingsUpdated } = settingsReduce.actions;

export default settingsReduce.reducer;
