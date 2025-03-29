import { configureStore, combineReducers } from '@reduxjs/toolkit'
import userReducer from './user/userSlice';
import themeReducer from './theme/themeSlice';
import {persistReducer} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import persistStore from 'redux-persist/es/persistStore';

//if there are more reducers then we can add them using combineReducers
const rootReducer = combineReducers({
  user: userReducer,
  theme: themeReducer
});

const persistConfig = {
  key: 'root',
  storage,
  version: 1
}

//we have installed redux-persist , because when we refresh the page , state managed by redux, i.e the data stored in it usually gone
//but redux-persist will store the data in the local memory, so even if you refresh the page, data won't be lost
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
  //we have to add this middleware otherwise redux-toolkit will give an error
});

export const persistor = persistStore(store);