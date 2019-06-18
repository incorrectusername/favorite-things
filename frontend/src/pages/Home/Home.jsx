import React, { Component } from "react";
import uuidv1 from "uuid/v1";
import { connect } from "react-redux";
import withStyles from "@material-ui/core/styles/withStyles";

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
  }
});

class Home extends Component {
  state = {
    greetMsg: "",
    extraMsg: undefined
  };

  componentDidMount = () => {};

  render() {
    const { classes, favoriteThings } = this.props;
    return (
      <>
        <FTInput />
        <div className={classes.root}>
          <GridList cellHeight={160} className={classes.gridList} cols={3}>
            {[0, ...favoriteThings].map(favoriteThing => (
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
