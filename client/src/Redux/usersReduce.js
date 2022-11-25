import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Configuration from "../configuration";
var token = localStorage.getItem("x-access-token");

export const loginFetch = createAsyncThunk("user/login", async (payload) => {
  const response = await fetch(Configuration.BACK_BASEURL + "user/login", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  var status = await response.status;
  var data = await response.json();
  var obj =
    status === 200
      ? { status: status, data: data }
      : { status: status, data: [] };
  const users = await obj;
  return users;
});

export const userAdded = createAsyncThunk("user/addUser", async (action) => {
  var users = await fetch(Configuration.BACK_BASEURL + "user/addUser", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-access-token": token,
    },
    body: JSON.stringify(action),
  })
    .then((response) => {
      return response.json();
    })
    .catch((error) => {
      return { status: 403, error: error };
    });
  return users;
  /*  const response = await fetch(Configuration.BACK_BASEURL + "user/addUser", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
    body: JSON.stringify(action)
  });
  var status = await response.status;
  var data = await response.json();
  var obj = status === 200? {status:status,data:data}: {status:status,data:[]};
  const users = await obj;
  return users; */
});
export const fetchUsers = createAsyncThunk("user/fetchUsers", async () => {
  /* const response = await fetch(Configuration.BACK_BASEURL + "user/allUser", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  });
  var status = await response.status;
  var data = await response.json();
  var obj = status === 200? {status:status,data:data}: {status:status,data:[]};
  const users = await obj;
  return users; */

  var users = await fetch(Configuration.BACK_BASEURL + "user/allUser", {
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
  return users;
});
export const getPersonnel = createAsyncThunk("user/getPersonnel", async () => {

  var users = await fetch(Configuration.BACK_BASEURL + "user/getPersonnel", {
    method: "GET",
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
  return users;
});

export const userGetById = createAsyncThunk("user/userGetById", async (id1) => {
  const id = id1;
  var users = await fetch(Configuration.BACK_BASEURL + "user/getUser", {
    method: "POST",
    headers: {
      id: id,
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
  return users;
  /* 
  const response = await fetch(Configuration.BACK_BASEURL + "user/getUser", {
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
  const users = await obj;
  return users; */
});
export const getActiveUser = createAsyncThunk("user/getActive", async () => {
  /* const response = await fetch(Configuration.BACK_BASEURL + "user/getActive", {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'x-access-token':token
    },
  
  });
  var status = await response.status;
  var data = await response.json();
  var obj = status === 200? {status:status,data:data}: {status:403,data:[]};
  const users = await obj;
  return users; */
  var users = await fetch(Configuration.BACK_BASEURL + "user/getActive", {
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
  return users;
});
/* export const getFile = createAsyncThunk("user/getFile", async (file) => {
  const response = await fetch(Configuration.BACK_BASEURL + "user/getFile/"+file, {
    method: "GET",
    responseType: "blob",
    //Force to receive data in a Blob Format
  })
  .then((response) => {
    return response.url;
  })
  .catch((error) => {
    console.log(error);
  })
  const files = await response;
  return files;
});
export const userSignature = createAsyncThunk("user/userSignature", async (action) => {
  const response = await fetch(Configuration.BACK_BASEURL + "user/saveSignature", {
    method: 'POST',
    headers: {
      'Accept': 'application/*',
      'x-access-token':token
    },
    body:action.signatureArray
  });
  const files = await response.json();
  return files;
}); */
export const getDetailUser = createAsyncThunk(
  "user/getDetailUser",
  async (id) => {
    var users = await fetch(
      Configuration.BACK_BASEURL + "user/getDetailUser/" + id,
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
    return users;
  }
);

export const verification = createAsyncThunk("user/verification", async () => {
  /*  const response = await fetch(
    Configuration.BACK_BASEURL + "user/verification",
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-access-token": token,
      },
    }
  );
  var status = await response.status;
  var data = await response.json();
  var obj =
    status === 200
      ? { status: status, data: data }
      : { status: status, data: [] };
  const users = await obj;
  return users; */
  var users = await fetch(Configuration.BACK_BASEURL + "user/verification", {
    method: "GET",
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
  return users;
});

export const userChangeEtat = createAsyncThunk(
  "user/changeEtat",
  async (id) => {
    /* const response = await fetch(
      Configuration.BACK_BASEURL + "user/changeEtat/" + id,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": token,
        },
      }
    );
    var status = await response.status;
    var data = await response.json();
    var obj =
      status === 200
        ? { status: status, data: data }
        : { status: status, data: [] };
    const users = await obj;
    return users; */
    var users = await fetch(
      Configuration.BACK_BASEURL + "user/changeEtat/" + id,
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
    return users;
  }
);

export const validationUser = createAsyncThunk("user/validation", async (action) => {
    var users = await fetch(
      Configuration.BACK_BASEURL + "user/validation/" + action.id,
      {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": token,
        },
        body: JSON.stringify(action),
      }
    )
      .then((response) => {
        return response.json();
      })
      .catch((error) => {
        return { status: 403, error: error };
      });
    return users;
  }
);

const usersReduce = createSlice({
  name: "users",
  initialState: {
    entities: [],
    loading: false,
  },
  reducers: {
    profilUpdated(state, action) {
      fetch(Configuration.BACK_BASEURL + "user/updateProfile", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": token,
        },
        body: JSON.stringify(action.payload),
      });
    },
  },
  extraReducers: {
    [getDetailUser.pending]: (state, action) => {
      state.loading = true;
    },
    [getDetailUser.fulfilled]: (state, action) => {
      state.loading = false;
      state.users = [...state.entities, action.payload];
    },
    [getDetailUser.rejected]: (state, action) => {
      state.loading = false;
    },
  },
});

export const { profilUpdated } = usersReduce.actions;

export default usersReduce.reducer;
