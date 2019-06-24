import React from "react";
import PropTypes from "prop-types";
import axios from "axios";

import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import FormControl from "@material-ui/core/FormControl";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";

import { BACKEND_SERVER } from "../../constants/consts";
import * as actionTypes from "../../actions/actionTypes";
import { SIGN_UP } from "../../constants/routes";
import { getCookie } from "../../utils/helpers";
const styles = theme => ({
  main: {
    width: "auto",
    display: "block", // Fix IE 11 issue.
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    [theme.breakpoints.up(400 + theme.spacing(3) * 2)]: {
      width: 400,
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme.spacing(3)}px`
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    marginTop: theme.spacing(3)
  }
});

class SignIn extends React.Component {
  state = {
    email: "",
    password: "",
    err: undefined
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  handleSubmit = event => {
    event.preventDefault();
    const { email, password } = this.state;

    axios
      .post(BACKEND_SERVER + "/api/v1/login", {
        email,
        password
      })
      .then(resp => resp.data)
      .then(data => {
        window.document.cookie = "loggedIn=1";
        window.document.cookie = `id=${data.user.id}`;
        this.props.dispatch({
          type: actionTypes.LOGIN,
          payload: data.user
        });
        this.setState({
          email: "",
          password: "",
          err: undefined
        });
      })
      .catch(err => this.setState({ err }));
  };
  render() {
    const { classes } = this.props;
    const { email, password, err } = this.state;
    if (getCookie("loggedIn") && parseInt(getCookie("loggedIn")) === 1) {
      return <Redirect to="/" />;
    }
    return (
      <main className={classes.main}>
        <CssBaseline />
        <Paper className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form} onSubmit={this.handleSubmit}>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="email">Email Address</InputLabel>
              <Input
                id="email"
                onChange={this.handleChange("email")}
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
              />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="password">Password</InputLabel>
              <Input
                onChange={this.handleChange("password")}
                name="password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
              />
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign in
            </Button>
            <Button
              type="button"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={() => {
                window.location.href = SIGN_UP;
              }}
            >
              Sign up instead?
            </Button>
            {err && (
              <Typography component="span">
                Incorrect username or password
              </Typography>
            )}
          </form>
        </Paper>
      </main>
    );
  }
}

const mapStateToProps = state => ({
  user: state.User.user
});

SignIn.propTypes = {
  classes: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(withStyles(styles)(SignIn));
