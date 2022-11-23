import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Configuration from "../configuration";
var token = localStorage.getItem("x-access-token");

export const updateDB = createAsyncThunk("offline/updateDB", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "offline/updateBD/"+action.id, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body: JSON.stringify(action)

  });
  const notif = await response.json();
  return notif;
});

const offlineReduce = createSlice({
  name: "offline",
  initialState: {
    entities: [],
    loading: false,
  },
  reducers: {
    updateNotif(state, action) {
      fetch(Configuration.BACK_BASEURL + "offline/update/"+action.payload.id+"/"+action.payload.idUser, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'x-access-token':token
        },
      });
    },
  },
  extraReducers: {},
});

export default offlineReduce.reducer;
