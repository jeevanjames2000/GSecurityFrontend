import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
export const fetchGatepassByID = createAsyncThunk(
  "gatepass/fetchGatepassByID",
  async (searchQuery, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      if (searchQuery) queryParams.append("searchQuery", searchQuery);
      const response = await fetch(
        `http://172.17.58.151:9000/gatepass/getGatepassByID?${queryParams.toString()}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch gate pass by search query.");
      }
      const data = await response.json();
      const parsedData = data.map((pass) => ({
        ...pass,
        particulars: pass.particulars,
      }));
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return parsedData;
    } catch (error) {
      return rejectWithValue(
        error.message || "Error fetching gate pass by search query."
      );
    }
  }
);
const gatepassSlice = createSlice({
  name: "gatepass",
  initialState: {
    passes: [],
    passesByID: [],
    passesCount: 0,
    gatepassSearch: "",
    isLoading: false,
    error: null,
  },
  reducers: {
    gatepassSearchState: (state, action) => {
      state.gatepassSearch = action.payload;
    },
    passByIDState: (state, action) => {
      state.gatepassSearch = action.payload;
      state.passesCount = action.payload;
      state.passesByID = action.payload;
    },
    clearState: (state) => {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGatepassByID.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGatepassByID.fulfilled, (state, action) => {
        state.isLoading = false;
        state.passesByID = action.payload;
      })
      .addCase(fetchGatepassByID.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});
export const { gatepassSearchState, passByIDState, clearState } =
  gatepassSlice.actions;
export default gatepassSlice.reducer;
