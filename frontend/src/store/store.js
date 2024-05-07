import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import themeSlice from "./themeSlice";
import { persistStore, persistReducer } from "redux-persist";

import storage from "redux-persist/lib/storage";

const rootReducer = combineReducers({
  userReducer: userReducer,
  themeReducer: themeSlice,
});
const persistConfig = {
  key: "root",
  storage,
  version: 1,
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);
export default store;
