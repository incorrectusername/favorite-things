import React from "react";
import axios from "axios";
import withStyles from "@material-ui/core/styles/withStyles";
import { connect } from "react-redux";
import CreatableSelect from "react-select/creatable";

import Paper from "@material-ui/core/Paper";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Drawer from "@material-ui/core/Drawer";

import AuditLogs from "../AuditLogs";
import {
  updateRankingBecauseCategoryChanged,
  updateRankings
} from "../../utils/helpers";

import * as actionTypes from "../../actions/actionTypes";
import NumberFormatCustom from "../NumberFormat";
import { BACKEND_SERVER } from "../../constants/consts";
const styles = theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "column"
  },
  paper: {
    maxWidth: 500,
    margin: "0 auto"
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  },
  save: {
    marginLeft: "auto"
  },
  input: {
    margin: theme.spacing(1)
  }
});

class UpdateFTInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: props.title,
      description: props.description || null,
      userMsg: null,
      selectValue: props.selectValue,
      isLoadingSelect: false,
      ranking: props.ranking,
      openDrawer: false
    };
  }
  handleChange = name => event => {
    this.setState({ [name]: event.target.value, userMsg: null });
  };
  closeDrawer = () => {
    this.setState({
      openDrawer: false
    });
  };

  openDrawer = () => {
    this.setState({
      openDrawer: true
    });
  };

  /**
   * Check if all the fields are present.
   * update all the items in a given category if new item to be inserted is somewhere in
   * the between and not the lasr
   */
  onClickSave = () => {
    const { title, description, selectValue, ranking } = this.state;
    const { favoriteThings, user, id: favorite_id } = this.props;
    if (
      title === null ||
      title === "" ||
      (typeof title === "string" && title.trim() === "")
    ) {
      this.setState({
        userMsg: "title cannot be empty"
      });
      return false;
    }
    if (selectValue === undefined) {
      this.setState({
        userMsg: "Favorite item must have a category"
      });
      return false;
    }

    let actualRank = parseInt(ranking);

    const totalItems =
      favoriteThings.filter(favThing => favThing.category === selectValue.value)
        .length + 1;

    if (ranking > totalItems) {
      actualRank = parseInt(totalItems);
    }

    if (this.props.selectValue.value !== selectValue.value) {
      //user changed ranking and category both
      const allFavThings = updateRankingBecauseCategoryChanged(
        this.props.favoriteThings,
        this.props.id,
        parseInt(actualRank),
        this.props.selectValue.value,
        selectValue.value
      );
      this.props.dispatch({
        type: actionTypes.REPLACE_FAVORITE_THINGS,
        payload: allFavThings
      });
    } else if (
      this.props.ranking !== actualRank &&
      this.props.selectValue.value === selectValue.value
    ) {
      //only ranking changed
      const allFavThings = updateRankings(
        this.props.favoriteThings,
        this.props.id,
        parseInt(actualRank),
        parseInt(this.props.ranking),
        this.props.selectValue.value
      );

      this.props.dispatch({
        type: actionTypes.REPLACE_FAVORITE_THINGS,
        payload: allFavThings
      });
    } else {
      //other updates
      for (let i = 0; i < favoriteThings.length; i++) {
        if (favoriteThings[i].id === favorite_id) {
          let _updates = {
            title,
            description,
            ranking,
            category: selectValue.value,
            updated: new Date().toISOString()
          };
          Object.keys(_updates).forEach(
            key => _updates[key] == null && delete _updates[key]
          );

          favoriteThings[i] = { ...favoriteThings[i], ..._updates };
          this.props.dispatch({
            type: actionTypes.REPLACE_FAVORITE_THINGS,
            payload: favoriteThings
          });
          break;
        }
      }
    }

    axios.put(
      `${BACKEND_SERVER}/api/v1/user/${user.id}/favorite/${favorite_id}`,
      {
        title,
        description,
        ranking,
        category: selectValue.value
      }
    );

    this.props.handleDialogClose();
  };
  createOption = label => ({
    label,
    value: label.toLowerCase()
  });
  handleSelectChange = (newValue, actionMeta) => {
    this.setState({ selectValue: newValue });
  };
  handleSelectCreate = inputValue => {
    this.setState({ isLoading: true });
    const { dispatch, user } = this.props;

    axios
      .post(`${BACKEND_SERVER}/api/v1/favorites/category/user/${user.id}`)
      .then(resp => resp.data)
      .then(categories => {
        dispatch({
          //or just dispatch single category
          type: actionTypes.REPLACE_ALL_CATEGORIES_WITH_NEW_LIST,
          payload: categories.categories
        });
        this.setState({
          isLoadingSelect: false,
          selectValue: this.createOption(inputValue)
        });
      });
  };

  render() {
    const { classes, categories, user, id: favorite_id } = this.props;
    const {
      description,
      title,
      ranking,
      userMsg,
      isLoadingSelect,
      selectValue,
      openDrawer
    } = this.state;

    const selectOptions = categories.map(value => this.createOption(value));
    return (
      <Paper className={classes.paper}>
        <CardContent>
          <div className={classes.container}>
            <TextField
              id="standard-flexible"
              label="Title"
              value={title || ""}
              onChange={this.handleChange("title")}
              className={classes.textField}
              margin="none"
            />
            <TextField
              id="standard-multiline-flexible"
              label="Description"
              multiline
              rowsMax="4"
              value={description || ""}
              onChange={this.handleChange("description")}
              className={classes.textField}
              margin="none"
            />
            <div
              style={{
                display: "flex",
                width: "100%",
                alignItems: "baseline"
              }}
            >
              <div style={{ width: "100%", paddingRight: "5px", zIndex: 5 }}>
                <CreatableSelect
                  placeholder="categories"
                  isDisabled={isLoadingSelect}
                  isLoading={isLoadingSelect}
                  onChange={this.handleSelectChange}
                  onCreateOption={this.handleSelectCreate}
                  options={selectOptions}
                  value={selectValue}
                />
              </div>
              <TextField
                className={classes.formControl}
                label="Rank"
                value={ranking}
                onChange={this.handleChange("ranking")}
                id="formatted-numberformat-input"
                InputProps={{
                  inputComponent: NumberFormatCustom
                }}
              />
            </div>

            {userMsg && (
              <Typography color="textSecondary" gutterBottom>
                {userMsg}
              </Typography>
            )}
          </div>
          <Drawer
            anchor="right"
            open={openDrawer}
            onClose={this.closeDrawer}
            style={{
              minWidth: "250px"
            }}
          >
            <AuditLogs user_id={user.id} favorite_id={favorite_id} />
          </Drawer>
        </CardContent>
        <CardActions>
          <Button
            size="small"
            className={classes.save}
            color="secondary"
            onClick={this.openDrawer}
          >
            Audit logs
          </Button>

          <Button
            size="small"
            className={classes.save}
            color="secondary"
            onClick={this.onClickSave}
          >
            Save
          </Button>
        </CardActions>
      </Paper>
    );
  }
}

const mapStateToProps = state => ({
  user: state.User.user,
  categories: state.Categories.categories,
  favoriteThings: state.FavoriteThings.favoriteThings
});

export default withStyles(styles)(connect(mapStateToProps)(UpdateFTInput));
