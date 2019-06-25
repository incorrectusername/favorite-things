import React, { Component } from "react";
import uuidv1 from "uuid/v1";
import axios from "axios";
import { connect } from "react-redux";
import withStyles from "@material-ui/core/styles/withStyles";
import Select from "react-select";
import CircularProgress from "@material-ui/core/CircularProgress";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";

import FTInput from "../../components/FTInput";
import FTItem from "../../components/FTItem";
import { BACKEND_SERVER } from "../../constants/consts";
import { getCookie } from "../../utils/helpers";
import * as actionTypes from "../../actions/actionTypes";
import { isNil } from "../../constants/utilityFunctions";
const styles = theme => ({
  root: {},
  gridList: {
    width: "100%",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    backgroundColor: theme.palette.background.paper,
    marginTop: "20px",
    flexGrow: 1
  },
  select: {
    maxWidth: 300,
    padding: 10
  }
});

class Home extends Component {
  state = {
    category: "All",
    showPage: false,
    error: false
  };

  componentDidMount = () => {
    const { dispatch, user, categories, favoriteThings } = this.props;
    const promises = [Promise.resolve({})];
    if (categories.length === 0) {
      promises.push(
        axios
          .get(
            BACKEND_SERVER +
              "/api/v1/favorites/category/user/" +
              getCookie("id")
          )
          .then(resp => resp.data)
          .then(categories =>
            dispatch({
              type: actionTypes.REPLACE_ALL_CATEGORIES_WITH_NEW_LIST,
              payload: categories.categories
            })
          )
      );
    }
    if (isNil(user)) {
      promises.push(
        axios
          .get(BACKEND_SERVER + "/api/v1/user/" + getCookie("id"))
          .then(resp => resp.data)
          .then(user =>
            dispatch({
              type: actionTypes.LOGIN,
              payload: user.user
            })
          )
      );
    }

    if (!isNil(favoriteThings) && favoriteThings.length === 0) {
      promises.push(
        axios
          .get(`${BACKEND_SERVER}/api/v1/favorites/user/${getCookie("id")}`)
          .then(resp => resp.data)
          .then(favorites =>
            dispatch({
              type: actionTypes.REPLACE_FAVORITE_THINGS,
              payload: favorites.favorites
            })
          )
      );
    }

    Promise.all(promises)
      .then(() => {
        return this.setState({
          showPage: true,
          error: false
        });
      })
      .catch(err => {
        return this.setState({
          error: true
        });
      });
  };

  handleChange = (newValue, actionMeta) => {
    this.setState({
      category: newValue.value
    });
  };

  render() {
    const { classes, favoriteThings, categories } = this.props;
    const { category, showPage, error } = this.state;
    let favoriteThingsToRender = [...favoriteThings];

    if (!showPage && !error) {
      return <CircularProgress className={classes.progress} />;
    }

    if (error) {
      return (
        <Paper
          style={{
            height: "100px",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            justifyContent: "center"
          }}
        >
          <Typography variant="h5" component="h3" style={{ margin: "0 auto" }}>
            Could not fetch data from server
          </Typography>
          <Typography component="p">Please refresh the page.</Typography>
        </Paper>
      );
    }
    if (category !== "All") {
      favoriteThingsToRender = favoriteThingsToRender.filter(
        favThing => favThing.category === category
      );
      favoriteThingsToRender.sort((a, b) => a.ranking - b.ranking);
    }

    const categoryOptions = [
      { value: "All", label: "All" },
      ...categories.map(value => ({ label: value, value }))
    ];
    return (
      <>
        <FTInput />
        <Select
          className={classes.select}
          classNamePrefix="select"
          defaultValue={categoryOptions[0]}
          isSearchable
          onChange={this.handleChange}
          name="categories"
          options={categoryOptions}
        />
        <Grid container className={classes.root} spacing={2}>
          <Grid item xs={12}>
            <Grid container justify="center" spacing={1}>
              {favoriteThingsToRender.map(favoriteThing => (
                <FTItem key={uuidv1()} favoriteThing={favoriteThing} />
              ))}
            </Grid>
          </Grid>
        </Grid>
      </>
    );
  }
}

const mapStateToProps = state => ({
  user: state.User.user,
  categories: state.Categories.categories,
  favoriteThings: state.FavoriteThings.favoriteThings
});

export default withStyles(styles)(connect(mapStateToProps)(Home));
