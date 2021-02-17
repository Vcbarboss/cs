import {combineReducers, createStore} from 'redux'
import userReducer from "./reducers/userReducer";
import notificationReducer from "./reducers/notificationReducer";
import studentNotificationReducer from "./reducers/studentNotificationReducer";
import chatReducer from "./reducers/chatReducer";
import sectorReducer from "./reducers/sectorReducer";

const rootReducer = combineReducers({
  userReducer,
  notificationReducer,
  chatReducer,
  sectorReducer,
});

const store = createStore(rootReducer);

export default store;
