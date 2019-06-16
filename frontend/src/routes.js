import React from "react";
import * as routes from "./constants/routes";
import Home from "./pages/Home/Home";
import HomeIcon from "@material-ui/icons/Home";
import Login from "./pages/Login";

export default [
  {
    path: routes.HOME,
    exact: true,
    component: Home,
    name: "Home",
    isPrivate: true,
    listItemIcon: <HomeIcon />
  },
  {
    path: routes.LOG_IN,
    exact: true,
    component: Login,
    name: "Login",
    listItemIcon: <HomeIcon />
  }
];
