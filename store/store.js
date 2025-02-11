import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import violationsReducer from "./slices/violationSlice";
import profileReducer from "./slices/profileSlice";
import gatePassReducer from "./slices/gatePassSlice";
import homeSlice from "./slices/homeSlice";
import authSlice from "./slices/authSlice";
import loggerSlice from "./slices/loggerSlice";

const profilePersistConfig = {
  key: "profile",
  storage: AsyncStorage,
  whitelist: ["profile"],
};

const persistedProfileReducer = persistReducer(
  profilePersistConfig,
  profileReducer
);

const store = configureStore({
  reducer: {
    violations: violationsReducer,
    profile: persistedProfileReducer,
    gatepass: gatePassReducer,
    home: homeSlice,
    auth: authSlice,
    logger: loggerSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
export default store;
