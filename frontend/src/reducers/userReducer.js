import { LOGIN, LOG_OUT } from "../actions/actionTypes";

const INITIAL_STATE = {
  user: null
};
const user = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        user: { ...action.payload }
      };
    case LOG_OUT:
      document.cookie =
        "loggedIn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      return {
        ...state,
        ...INITIAL_STATE
      };
    default:
      return state;
  }
};

export default user;
