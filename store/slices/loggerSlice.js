import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Constants from "../../constants/Constants";
const API_URL = `${Constants.GSecurity_API_URL}/auth/logger`;
export const logErrorToDB = createAsyncThunk(
  "logger/logErrorToDB",
  async (errorDetails, { rejectWithValue }) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(errorDetails),
      });
      if (!response.ok) {
        throw new Error("Failed to log error");
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message || "Error logging failed");
    }
  }
);
const loggerSlice = createSlice({
  name: "logger",
  initialState: {
    loading: false,
    success: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(logErrorToDB.pending, (state) => {
        state.loading = true;
        state.success = false;
        state.error = null;
      })
      .addCase(logErrorToDB.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(logErrorToDB.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      });
  },
});
export default loggerSlice.reducer;
