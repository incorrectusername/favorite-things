import { combineReducers } from "redux";
import user from "./userReducer";

const appReducer = combineReducers({
  User: user
});

export default appReducer;
