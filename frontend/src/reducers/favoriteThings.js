import {
  ADD_FAVORITE_THING,
  REPLACE_FAVORITE_THINGS
} from "../actions/actionTypes";

const INITIAL_STATE = {
  favoriteThings: []
};
const favoriteThings = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ADD_FAVORITE_THING:
      return {
        ...state,
        favoriteThings: [...state.favoriteThings, action.payload]
      };

    case REPLACE_FAVORITE_THINGS:
      return {
        ...state,
        favoriteThings: [...action.payload]
      };
    default:
      return state;
  }
};

export default favoriteThings;
