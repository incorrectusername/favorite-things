import React from "react";
import { connect } from "react-redux";
import { Route, Redirect } from "react-router-dom";
import * as routes from "../../constants/routes";
import { getCookie } from "../../utils/helpers";

const PrivateRoute = ({
  component: Component,

  user,
  ...rest
}) => {
  return (
    <Route
      {...rest}
      render={props =>
        parseInt(getCookie("loggedIn")) === 1 ? (
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
