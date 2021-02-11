import {combineReducers, createStore} from 'redux'
import userReducer from "./reducers/userReducer";
import notificationReducer from "./reducers/notificationReducer";
import studentNotificationReducer from "./reducers/studentNotificationReducer";
import chatReducer from "./reducers/chatReducer";

const rootReducer = combineReducers({
  userReducer,
  notificationReducer,
  chatReducer
});

const store = createStore(rootReducer);

export default store;
