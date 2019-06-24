import {
  ADD_FAVORITE_CATEGORY,
  REPLACE_ALL_CATEGORIES_WITH_NEW_LIST
} from "../actions/actionTypes";

const INITIAL_STATE = {
  categories: []
};
const categories = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ADD_FAVORITE_CATEGORY:
      return {
        ...state,
        categories: [...state.categories, action.payload]
      };
    case REPLACE_ALL_CATEGORIES_WITH_NEW_LIST:
      return {
        ...state,
        categories: [...action.payload]
      };
    default:
      return state;
  }
};

export default categories;
