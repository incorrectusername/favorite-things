import thunk from "redux-thunk";
import { createStore, applyMiddleware } from "redux";
// eslint-disable-next-line import/no-extraneous-dependencies
import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "../reducers";

export const configureStore = (
  initialState = {},
  options = { logger: true }
) => {
  const middleware = [thunk];

  if (process.env.NODE_ENV !== "production" && options.logger) {
    /* eslint-disable global-require */
    const { createLogger } = require("redux-logger");
    const logger = createLogger({ collapsed: true });
    middleware.push(logger);
  }

  const store = createStore(
    rootReducer,
    initialState,
    composeWithDevTools(applyMiddleware(...middleware))
  );
  return store;
};

export const store = configureStore();
store.dispatch({
  type: "LOGIN",
  payload: { email: "sfaf", uid: "da" }
});
store.dispatch({
  type: "ADD_FAVORITE_THING",
  payload: {
    title: "my title",
    description: null,
    ranking: 1,
    id: "1",
    category: "food",
    created: Date.now(),
    updated: Date.now()
  }
});

store.dispatch({
  type: "ADD_FAVORITE_THING",
  payload: {
    title: "my title 2",
    description: "description",
    ranking: 2,
    id: "2",
    category: "food",
    created: Date.now(),
    updated: Date.now()
  }
});
store.dispatch({
  type: "ADD_FAVORITE_THING",
  payload: {
    title: "my title",
    description: null,
    ranking: 1,
    id: "1",
    category: "food",
    created: Date.now(),
    updated: Date.now()
  }
});

store.dispatch({
  type: "ADD_FAVORITE_THING",
  payload: {
    title: "my title 2",
    description: "description",
    ranking: 2,
    id: "2",
    category: "food",
    created: Date.now(),
    updated: Date.now()
  }
});

store.dispatch({
  type: "ADD_FAVORITE_THING",
  payload: {
    title: "my title",
    description: null,
    ranking: 1,
    id: "1",
    category: "food",
    created: Date.now(),
    updated: Date.now()
  }
});

store.dispatch({
  type: "ADD_FAVORITE_THING",
  payload: {
    title: "my title 2",
    description: "description",
    ranking: 2,
    id: "2",
    category: "food",
    created: Date.now(),
    updated: Date.now()
  }
});

store.dispatch({
  type: "ADD_FAVORITE_THING",
  payload: {
    title: "my title",
    description: null,
    ranking: 1,
    id: "1",
    category: "food",
    created: Date.now(),
    updated: Date.now()
  }
});

store.dispatch({
  type: "ADD_FAVORITE_THING",
  payload: {
    title: "my title 2",
    description: "description",
    ranking: 2,
    id: "2",
    category: "food",
    created: Date.now(),
    updated: Date.now()
  }
});

store.dispatch({
  type: "ADD_FAVORITE_THING",
  payload: {
    title: "my title",
    description: null,
    ranking: 1,
    id: "1",
    category: "food",
    created: Date.now(),
    updated: Date.now()
  }
});

store.dispatch({
  type: "ADD_FAVORITE_THING",
  payload: {
    title: "my title 2",
    description: "description",
    ranking: 2,
    id: "2",
    category: "food",
    created: Date.now(),
    updated: Date.now()
  }
});

store.dispatch({
  type: "ADD_FAVORITE_THING",
  payload: {
    title: "my title",
    description: null,
    ranking: 1,
    id: "1",
    category: "food",
    created: Date.now(),
    updated: Date.now()
  }
});

store.dispatch({
  type: "ADD_FAVORITE_THING",
  payload: {
    title: "my title 2",
    description: "description sdfkl",
    ranking: 2,
    id: "2",
    category: "food",
    created: Date.now(),
    updated: Date.now()
  }
});

export default configureStore;
