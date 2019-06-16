import React from "react";
import { connect } from "react-redux";
import { Route, Redirect } from "react-router-dom";
import { isNil } from "../../constants/utilityFunctions";
import * as routes from "../../constants/routes";
import CircularProgress from "@material-ui/core/CircularProgress";

const PrivateRoute = ({
  component: Component,

  user,
  ...rest
}) => {
  console.log(!isNil(user));
  return (
    <Route
      {...rest}
      render={props =>
        !isNil(user) && !isNil(user.uid) ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: routes.LOG_IN,
              state: { fromPath: props.location }
            }}
          />
        )
      }
    />
  );
};
const mapStateToProps = state => {
  return {
    user: state.User.user
  };
};

export default connect(mapStateToProps)(PrivateRoute);
