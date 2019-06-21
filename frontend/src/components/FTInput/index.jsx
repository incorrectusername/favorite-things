import React from "react";
import uuidv1 from "uuid/v1";
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

import { firstTimeAddItem } from "../../utils/helpers";

import * as actionTypes from "../../actions/actionTypes";
import { BACKEND_SERVER } from "../../constants/consts";
import NumberFormatCustom from "../NumberFormat";
import { isNil } from "../../constants/utilityFunctions";
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
  },
  progress: {
    margin: theme.spacing(2)
  }
});

class FTInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: null,
      description: null,
      userMsg: null,
      selectValue: undefined,
      isLoadingSelect: false,
      ranking: 1
    };
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value, userMsg: null });
  };

  /**
   * Check if all the fields are present.
   * update all the items in a given category if new item to be inserted is somewhere in
   * the between and not the lasr
   */
  onClickSave = () => {
    const { title, description, selectValue, ranking } = this.state;
    const { dispatch, favoriteThings, user } = this.props;
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
    if (!isNil(description)) {
      if (description.trim().length < 10) {
        this.setState({
          userMsg: "description should be atleast 10 characters long"
        });
        return;
      }
    }

    let actualRank = ranking;
    const newTempId = uuidv1();

    const totalItems =
      favoriteThings.filter(favThing => favThing.category === selectValue.value)
        .length + 1;

    if (ranking > totalItems) {
      actualRank = totalItems;
    }

    const item = {
      user_id: user.id,
      title,
      description,
      category: selectValue.value,
      ranking: actualRank,
      id: newTempId
    };

    axios
      .post(BACKEND_SERVER + "/api/v1/favorite", item)
      .then(resp => resp.data)
      .then(favorite => {
        if (ranking <= actualRank) {
          const updateThings = firstTimeAddItem(favoriteThings, favorite);
          dispatch({
            type: actionTypes.REPLACE_FAVORITE_THINGS,
            payload: updateThings
          });
        } else {
          dispatch({
            type: actionTypes.ADD_FAVORITE_THING,
            payload: favorite
          });
        }
      });

    this.setState({
      title: null,
      description: null
    });
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
    const newOption = this.createOption(inputValue);

    axios
      .post(`${BACKEND_SERVER}/api/v1/favorites/category/user/${user.id}`, {
        category: inputValue
      })
      .then(resp => resp.data)
      .then(data => {
        dispatch({
          type: actionTypes.REPLACE_ALL_CATEGORIES_WITH_NEW_LIST,
          payload: data.categories
        });

        this.setState({
          isLoadingSelect: false,
          selectValue: newOption
        });
      })
      .catch(err => this.setState({ err }));
  };

  render() {
    const { classes, categories, favoriteThings } = this.props;
    const {
      description,
      title,
      userMsg,
      isLoadingSelect,
      selectValue
    } = this.state;

    const ranking = selectValue
      ? favoriteThings.filter(
          favThing => favThing.category === selectValue.value
        ).length + 1
      : 1;

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
        </CardContent>
        <CardActions>
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

export default withStyles(styles)(connect(mapStateToProps)(FTInput));
