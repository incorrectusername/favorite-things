import React, { Component } from "react";
import uuidv1 from "uuid/v1";
import { connect } from "react-redux";
import withStyles from "@material-ui/core/styles/withStyles";
import Select from "react-select";

import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";

import FTInput from "../../components/FTInput";
import FTItem from "../../components/FTItem";

const styles = theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    backgroundColor: theme.palette.background.paper,
    marginTop: "20px"
  },
  gridList: {
    width: "100%"
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
        <div className={classes.root}>
          <GridList cellHeight={160} className={classes.gridList} cols={3}>
            {favoriteThingsToRender.map(favoriteThing => (
              <GridListTile key={uuidv1()} cols={1}>
                <FTItem favoriteThing={favoriteThing} />
              </GridListTile>
            ))}
          </GridList>
        </div>
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
