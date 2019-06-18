import { combineReducers } from "redux";
import user from "./userReducer";
import favoriteThings from "./favoriteThings";
import categories from "./categories";

const appReducer = combineReducers({
  User: user,
  FavoriteThings: favoriteThings,
  Categories: categories
});

export default appReducer;
