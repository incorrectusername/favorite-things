import React, { Component } from "react";
import uuidv1 from "uuid/v1";
import { connect } from "react-redux";
import withStyles from "@material-ui/core/styles/withStyles";
import Select from "react-select";

import Grid from "@material-ui/core/Grid";

import FTInput from "../../components/FTInput";
import FTItem from "../../components/FTItem";

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
    category: "All"
  };

  componentDidMount = () => {};

  handleChange = (newValue, actionMeta) => {
    this.setState({
      category: newValue.value
    });
  };

  render() {
    const { classes, favoriteThings, categories } = this.props;
    const { category } = this.state;
    let favoriteThingsToRender = [...favoriteThings];

    if (category !== "All") {
      favoriteThingsToRender = favoriteThingsToRender.filter(
        favThing => favThing.category === category
      );
      favoriteThingsToRender.sort((a, b) => a - b);
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
