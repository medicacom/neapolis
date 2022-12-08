import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Configuration from "../configuration";
var token = localStorage.getItem("x-access-token");

export const fetchNews = createAsyncThunk("news/fetchNews", async () => {
  const response = await fetch(Configuration.BACK_BASEURL + "news/allNews", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  });
  const news = await response.json();
  return news;
});

export const newsGetById = createAsyncThunk("news/newsGetById", async (id1) => {
  const id = id1;
  const response = await fetch(Configuration.BACK_BASEURL + "news/getNews", {
    method: "POST",
    headers: {
      id: id,
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  });
  const news = await response.json();
  return news;
});

export const newsDeleted = createAsyncThunk(
  "news/deleteNews",
  async (action) => {
    const response = await fetch(
      Configuration.BACK_BASEURL + "news/deleteNews/" + action.id,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": token,
        },
      }
    );
    const news = await response.json();
    return news;
  }
);

export const saveFile = createAsyncThunk("news/saveFile", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "news/saveFile", {
    method: "POST",
    headers: {
      Accept: "application/*",
      "x-access-token": token,
    },
    body: action.dataArray,
  });
  const news = await response.json();
  return news;
});
export const newsAdded = createAsyncThunk("news/addNews", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "news/addNews", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body: JSON.stringify(action),
  });
  const news = await response.json();
  return news;
});

export const newsChangeEtat = createAsyncThunk(
  "news/changeEtat",
  async (id) => {
    var news = await fetch(
      Configuration.BACK_BASEURL + "news/changeEtat/" + id,
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
    return news;
  }
);
//getFile
export const getFileNews = createAsyncThunk("news/getFile", async (id) => {
  const response = await fetch(
    Configuration.BACK_BASEURL + "news/getFile/" + id,
    {
      method: "GET",
      responseType: "blob",
    }
  )
    .then((response) => response.blob())
    .then(function (myBlob) {
      return myBlob;
    })
    .catch((error) => {
      console.log(error);
    });
  const files = await response;
  return files;
});
const newsReduce = createSlice({
  name: "news",
  initialState: {
    entities: [],
    loading: false,
  },
  reducers: {
    /*  newsAdded(state, action) {
      fetch(Configuration.BACK_BASEURL + "news/addNews", {
        method: 'POST',
        headers: {
          'Accept': 'application/*',
          'x-access-token':token
        },
        body:action.payload.dataArray
      });
    }, */
  },
  extraReducers: {
    [fetchNews.pending]: (state, action) => {
      state.loading = true;
    },
    [fetchNews.fulfilled]: (state, action) => {
      state.loading = false;
      state.entities = [...state.entities, ...action.payload];
    },
    [fetchNews.rejected]: (state, action) => {
      state.loading = false;
    },
  },
});

/* export const { newsAdded } = newsReduce.actions; */

export default newsReduce.reducer;
