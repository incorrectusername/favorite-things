import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { connect } from "react-redux";
import CreatableSelect from "react-select/creatable";

import Paper from "@material-ui/core/Paper";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

import * as actionTypes from "../../actions/actionTypes";
import NumberFormatCustom from "../NumberFormat";
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

class FTInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: null,
      description: null,
      userMsg: null,
      selectOptions: [],
      selectValue: undefined,
      isLoadingSelect: false,
      ranking: 0
    };
  }
  handleChange = name => event => {
    this.setState({ [name]: event.target.value, userMsg: null });
  };

  onClickSave = () => {
    const { title, description, selectValue } = this.state;
    const { dispatch } = this.props;
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
    console.log(selectValue);
    if (selectValue === undefined) {
      this.setState({
        userMsg: "Favorite item must have a category"
      });
      return false;
    }

    dispatch({
      type: actionTypes.ADD_FAVORITE_THING,
      payload: {
        title,
        description,
        category: selectValue.value
      }
    });

    this.setState({
      title: null,
      description: null,
      selectValue: undefined
    });
  };
  createOption = label => ({
    label,
    value: label.toLowerCase().replace(/\W/g, "")
  });
  handleSelectChange = (newValue, actionMeta) => {
    console.group("Value Changed");
    console.log(newValue);
    console.log(`action: ${actionMeta.action}`);
    console.groupEnd();
    this.setState({ value: newValue });
  };
  handleSelectCreate = inputValue => {
    this.setState({ isLoading: true });
    const { dispatch } = this.props;

    console.group("Option created");
    console.log("Wait a moment...");
    setTimeout(() => {
      const { selectOptions } = this.state;
      const newOption = this.createOption(inputValue);
      console.log(newOption);
      console.groupEnd();

      dispatch({
        type: actionTypes.ADD_FAVORITE_CATEGORY,
        payload: newOption.value
      });

      this.setState({
        isLoadingSelect: false,
        selectOptions: [...selectOptions, newOption],
        selectValue: newOption
      });
    }, 1000);
  };

  render() {
    const { classes } = this.props;
    const {
      description,
      title,
      userMsg,
      isLoadingSelect,
      selectOptions,
      selectValue,
      ranking
    } = this.state;
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
