import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Constants from "../../constants/Constants";
export const fetchProfile = createAsyncThunk(
  "auth/fetchProfile",
  async (searchStore, { rejectWithValue }) => {
    try {
      const response = await fetch(Constants.LOGIN_GYM_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          UserName: searchStore,
          Password: Constants.GET_PROFILE_PASSWORD,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch profile data.");
      }
      const data = await response.json();

      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Error fetching profile data.");
    }
  }
);
const authSlice = createSlice({
  name: "auth",
  initialState: {
    searchStore: "",
    profile: null,
    isLoading: false,
    image: "",
    error: null,
  },
  reducers: {
    loginSearchState: (state, action) => {
      state.searchStore = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
        const isStaff = action.payload.role === "staff";
        state.image = isStaff
          ? `https://gstaff.gitam.edu/img1.aspx?empid=${state.searchStore}`
          : `https://doeresults.gitam.edu/photo/img.aspx?id=${state.searchStore}`;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});
export const { loginSearchState } = authSlice.actions;
export default authSlice.reducer;
