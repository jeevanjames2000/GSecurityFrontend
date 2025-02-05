import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
const API_URLS = {
  PROFILE: "https://studentmobileapi.gitam.edu/LoginGym",
  SEARCH: "http://172.17.58.151:9000/global/getCardsByID",
};
const DEFAULT_ERROR_MESSAGE = "An error occurred while fetching data.";
const fetchAPI = async (
  url,
  options = {},
  errorMessage = DEFAULT_ERROR_MESSAGE
) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(errorMessage);
    }
    return await response.json();
  } catch (error) {
    throw new Error(error.message || errorMessage);
  }
};
export const fetchProfile = createAsyncThunk(
  "home/fetchProfile",
  async (searchStore, { rejectWithValue }) => {
    const body = JSON.stringify({
      UserName: searchStore,
      Password: "Ganesh@2024",
    });
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    };
    const data = await fetchAPI(
      API_URLS.PROFILE,
      options,
      "Failed to fetch profile data."
    );
    return { source: "Violations", data };
  }
);
export const fetchDataBySearchQuery = createAsyncThunk(
  "home/fetchDataBySearchQuery",
  async (searchQuery, { rejectWithValue }) => {
    const queryParams = new URLSearchParams({ searchQuery });
    const url = `${API_URLS.SEARCH}?${queryParams.toString()}`;
    const sdata = await fetchAPI(
      url,
      {},
      "Failed to fetch data by search query."
    );
    const { data, source } = sdata;

    if (!source || !data) {
      throw new Error("Invalid API response.");
    }
    return { source, data };
  }
);
export const fetchLeaves = createAsyncThunk(
  "home/fetchLeaves",
  async ({ regdNo, token }, { rejectWithValue }) => {
    // console.log("regdNo, token: ", regdNo, token);
    try {
      const formBody = new URLSearchParams();
      formBody.append("regdno", "2024107163");

      const response = await fetch(
        "https://studentmobileapi.gitam.edu/Gsecurity_permissionstatus",
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${"eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiMjAyNDEwNzE2MyIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6IlN0dWRlbnQiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjJiODkyNTdiLWVhYWUtNDRhYy04Mzg0LTYwN2I5NmQ2YzdkMCIsImlzcyI6Ind3dy5naXRhbS5lZHUiLCJhdWQiOiJ3d3cuZ2l0YW0uZWR1In0.QdM3h5_kykCJIUG5fRpQfGwBUi7i2JIjEN_XZfBBE80"}`,
          },
          body: formBody.toString(),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch leave permissions.");
      }

      const data = await response.json();
      console.log("Leaves Data:", data);
      return data;
    } catch (error) {
      console.error("Error fetching leaves:", error);
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  searchStore: "",
  profile: null,
  cardData: [],
  cardType: "Violations",
  isLoading: false,
  error: null,
  image: "",
  noProfile: false,
  noCardData: false,
  leaves: [],
};
const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    searchState: (state, action) => {
      state.searchStore = action.payload;
    },
    setCardType: (state, action) => {
      state.cardType = action.payload;
    },
    clearState: (state) => {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    const handlePending = (state) => {
      state.isLoading = true;
      state.error = null;
      state.noProfile = false;
      state.noCardData = false;
    };

    builder
      .addCase(fetchProfile.pending, (state, action) => {
        state.isLoading = true;
        state.noProfile = false;
        state.noCardData = false;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.noProfile = false;
        state.profile = action.payload.data;
        const isStaff = action.payload.data.role === "staff";
        state.image = isStaff
          ? `https://gstaff.gitam.edu/img1.aspx?empid=${state.searchStore}`
          : `https://doeresults.gitam.edu/photo/img.aspx?id=${state.searchStore}`;
        state.cardType = "Violations";
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.noProfile = true;
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchDataBySearchQuery.pending, handlePending)
      .addCase(fetchDataBySearchQuery.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cardData = action.payload.data;
        state.cardType = action.payload.source;
      })
      .addCase(fetchDataBySearchQuery.rejected, (state, action) => {
        state.noCardData = true;
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchLeaves.fulfilled, (state, action) => {
        state.isLoading = false;
        state.leaves = action.payload;
      });
  },
});
export const { searchState, clearState, setCardType } = homeSlice.actions;
export default homeSlice.reducer;
