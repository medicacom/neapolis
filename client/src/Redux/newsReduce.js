import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Configuration from "../configuration";
var token = localStorage.getItem("x-access-token");

export const fetchNews = createAsyncThunk("news/fetchNews", async () => {
  const response = await fetch(Configuration.BACK_BASEURL + "news/allNews", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },

  });
  const news = await response.json();
  return news;
});

export const newsGetById = createAsyncThunk("news/newsGetById", async (id1) => {
  const  id  = id1;
  const response = await fetch(Configuration.BACK_BASEURL + "news/getNews", {
    method: 'POST',
    headers: {
      'id':id,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  
  });
  const news = await response.json();
  return news;
});

export const newsDeleted = createAsyncThunk("news/deleteNews", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "news/deleteNews/"+action.id, {
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

export const newsAdded = createAsyncThunk("news/addNews", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "news/addNews", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body: JSON.stringify(action)
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

/* export const subscribe = createAsyncThunk("news/subscribe", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "news/subscribe", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body: JSON.stringify(action)
  });
  const news = await response.status;
  return news;
}); */

const newsReduce = createSlice({
  name: "news",
  initialState: {
    entities: [],
    loading: false,
  },
  reducers: {
    /* newsDeleted(state, action) {
      const { id } = action.payload;
      fetch(Configuration.BACK_BASEURL + "news/deleteNews/"+id, {
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

/* export const { newsAdded, newsUpdated } = newsReduce.actions; */

export default newsReduce.reducer;
