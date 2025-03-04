import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "../../constants/Constants";
const fetchImageAsBase64 = async (url) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error fetching image:", error);
    return null;
  }
};
export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
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
      const isStaff = data.role === "staff";
      const imageUrl = isStaff
        ? `https://gstaff.gitam.edu/img1.aspx?empid=${searchStore}`
        : `https://doeresults.gitam.edu/photo/img.aspx?id=${searchStore}`;
      const imageBase64 = await fetchImageAsBase64(imageUrl);
      await AsyncStorage.setItem("authUser", JSON.stringify(data));
      if (imageBase64) {
        await AsyncStorage.setItem("profileImage", imageBase64);
      }
      return { ...data, image: imageBase64 };
    } catch (error) {
      return rejectWithValue(error.message || "Error fetching profile data.");
    }
  }
);
export const loadProfileFromStorage = createAsyncThunk(
  "profile/loadProfileFromStorage",
  async () => {
    const storedProfile = await AsyncStorage.getItem("authUser");
    const storedImage = await AsyncStorage.getItem("profileImage");
    if (storedProfile) {
      return {
        ...JSON.parse(storedProfile),
        image: storedImage || null,
      };
    }
    return null;
  }
);
export const sendPushTokenToServer = createAsyncThunk(
  "profile/sendPushTokenToServer",
  async ({ pushToken, regdNo }, { rejectWithValue }) => {
    if (!pushToken || !regdNo) {
      return rejectWithValue("Push token not available.");
    }

    try {
      const apiUrl = `${Constants.GSecurity_NGROK_API_URL}/auth/expoPushtoken`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pushToken,
          regdNo,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send push token to server");
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  searchStore: "",
  profile: null,
  isLoading: false,
  error: null,
  image: null,
  deviceType: "",
};
const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    profileSearchState: (state, action) => {
      state.searchStore = action.payload;
    },
    clearProfile: (state) => {
      state.profile = null;
      state.image = null;
      state.searchStore = "";
      state.deviceType = "";
    },

    setDeviceType: (state, action) => {
      state.deviceType = action.payload;
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
        state.image = action.payload.image;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "failed to fetch profile";
      })
      .addCase(loadProfileFromStorage.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.image = action.payload?.image || null;
      });
  },
});
export const { profileSearchState, clearProfile, setDeviceType } =
  profileSlice.actions;
export default profileSlice.reducer;
