import { createStore } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist-indexeddb-storage";
import authReducer from "./Reducer/AuthReducer";

const authPersistConfig = {
  key: "root",
  storage: storage("db"),
};

const persistedReducer = persistReducer(authPersistConfig, authReducer);
const store = createStore(persistedReducer);
const persistor = persistStore(store);
export { store, persistor };
