import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Configuration from "../configuration";
var token = localStorage.getItem("x-access-token");

export const getNotification = createAsyncThunk(
  "notification/getNotification",
  async () => {
    var notif = await fetch(
      Configuration.BACK_BASEURL + "notification/getNotification/",
      {
        method: "GET",
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
    return notif;
    /* const notif = await fetch(Configuration.BACK_BASEURL + "notification/getNotification", {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },

  })
  .then((response) => {
    return response.json();
  })
  .catch((error) => {
    return { status: 403, error: error };
  });
  return notif; */
  }
);

export const updateNotif = createAsyncThunk(
  "notification/update",
  async (action) => {
    const notif = await fetch(
      Configuration.BACK_BASEURL +
        "notification/update/" +
        action.id +
        "/" +
        action.idUser,
      {
        method: "DELETE",
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
    return notif;
  }
);

const notificationReduce = createSlice({
  name: "notification",
  initialState: {
    entities: [],
    loading: false,
  },
  reducers: {},
  extraReducers: {
    [getNotification.pending]: (state, action) => {
      state.loading = true;
    },
    [getNotification.fulfilled]: (state, action) => {
      state.loading = false;
      state.entities = [...state.entities, ...action.payload];
    },
    [getNotification.rejected]: (state, action) => {
      state.loading = false;
    },
  },
});

export default notificationReduce.reducer;
