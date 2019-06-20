import React from "react";
import uuidv1 from "uuid/v1";
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
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

import {
  firstTimeAddItem,
  updateRankingBecauseCategoryChanged,
  updateRankings
} from "../../utils/helpers";

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

const logs = [
  { text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
  {
    text:
      "Donec lobortis nibh non nisi ultricies ullamcorper rhoncus id tellus."
  },
  { text: "Aliquam nec enim vel leo rhoncus ultricies quis congue massa." },
  {
    text:
      "Fusce molestie tortor sit amet metus rutrum, vel placerat metus aliquet."
  },
  { text: "Fusce porttitor arcu in libero blandit, ut viverra nisl finibus." },
  { text: "Phasellus luctus libero non purus cursus tristique." },
  { text: "Nam in nulla eget nulla fermentum vestibulum." },
  { text: "Ut sit amet lacus id augue hendrerit dignissim." }
];

const LogList = props => {
  const { classes, logs } = props;
  return (
    <div className={classes.list} role="presentation">
      <List
        style={{
          maxWidth: "350px"
        }}
      >
        {logs.map(log => {
          return (
            <ListItem button key={log.text}>
              <ListItemText primary={log.text} />
              <Divider />
            </ListItem>
          );
        })}
      </List>
    </div>
  );
};

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
    const { dispatch, favoriteThings } = this.props;
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

    let actualRank = ranking;

    const totalItems =
      favoriteThings.filter(favThing => favThing.category === selectValue.value)
        .length + 1;

    if (ranking > totalItems) {
      actualRank = totalItems;
    }

    console.log(
      this.props.ranking,
      parseInt(actualRank),
      this.props.selectValue.value,
      selectValue.value
    );
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
    }

    //TODO: make network call to update an item

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
    const { dispatch } = this.props;

    // TODO: Make a network call to save new category
    console.group("Option created");
    console.log("Wait a moment...");
    setTimeout(() => {
      const newOption = this.createOption(inputValue);
      console.log(newOption);
      console.groupEnd();

      dispatch({
        type: actionTypes.ADD_FAVORITE_CATEGORY,
        payload: newOption.value
      });

      this.setState({
        isLoadingSelect: false,
        selectValue: newOption
      });
    }, 1000);
  };

  render() {
    const { classes, categories } = this.props;
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
          <Drawer anchor="right" open={openDrawer} onClose={this.closeDrawer}>
            <LogList classes={classes} logs={logs} />
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
