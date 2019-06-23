import React from "react";
import axios from "axios";
import { connect } from "react-redux";
import withStyles from "@material-ui/core/styles/withStyles";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import AddIcon from "@material-ui/icons/Add";
import Fab from "@material-ui/core/Fab";
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";

import { REPLACE_FAVORITE_THINGS } from "../../actions/actionTypes";
import { BACKEND_SERVER } from "../../constants/consts";

class MetaData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      metadata: props.metadata,
      addEntry: false,
      userMsg: null
    };
  }

  addEntryClick = () => {
    this.setState({
      addEntry: true
    });
  };

  updateGlobalStateOfItem = () => {
    const { id, favoriteThings, dispatch } = this.props;

    dispatch({
      type: REPLACE_FAVORITE_THINGS,
      payload: favoriteThings.map(item => {
        const _item = { ...item };
        if (item.id === id) {
          _item.meta_data = this.state.metadata;
        }
        return _item;
      })
    });
  };

  updateToDb = meta_data => {
    const { id, user } = this.props;

    axios.put(`${BACKEND_SERVER}/api/v1/user/${user.id}/favorite/${id}`, {
      meta_data
    });
  };

  saveNewEntry = (key, value) => {
    const { metadata } = this.state;

    if (
      key === "" ||
      value === "" ||
      key.trim() === "" ||
      value.trim() === "" ||
      key === undefined ||
      value === undefined
    ) {
      return this.setState({
        userMsg: "key/value pair cannot be empty"
      });
    }

    if (metadata[key] !== undefined) {
      return this.setState({
        userMsg: `key ${key} is repeated`
      });
    }

    this.setState(
      prevState => ({
        metadata: { ...prevState.metadata, [key]: value },
        userMsg: null
      }),
      this.updateGlobalStateOfItem
    );
    this.updateToDb({ ...metadata, [key]: value });
  };

  deleteExistingEntry = key => {
    const newMetaData = { ...this.state.metadata };
    delete newMetaData[key];
    this.setState(
      {
        metadata: { ...newMetaData }
      },
      this.updateGlobalStateOfItem
    );

    this.updateToDb(newMetaData);
  };

  render() {
    const textFields = Object.entries(this.state.metadata).map(entry => {
      return (
        <StyledMetaDataItem
          key={entry[0]}
          metaKey={entry[0]}
          metaValue={entry[1]}
          deleteExistingEntry={this.deleteExistingEntry}
        />
      );
    });

    return (
      <Paper>
        {textFields}
        <div style={{ padding: "0 5px" }}>{this.state.userMsg}</div>
        {this.state.addEntry && (
          <StyledAddMetaDataItem saveNewEntry={this.saveNewEntry} />
        )}
        {!this.state.addEntry && (
          <div
            style={{
              display: "flex",
              padding: "8px",
              justifyContent: "space-between"
            }}
          >
            <Fab
              size="small"
              color="secondary"
              aria-label="Add"
              style={{
                width: "35px",
                height: "15px",
                float: "right"
              }}
              onClick={this.addEntryClick}
            >
              <AddIcon />
            </Fab>
          </div>
        )}
      </Paper>
    );
  }
}

const styles = theme => ({
  row: {
    display: "flex",
    flexWrap: "no-wrap",
    width: 200,
    alignItems: "center",
    margin: "10px"
  }
});

class MetaDataItem extends React.Component {
  render() {
    const { metaKey, metaValue, classes, deleteExistingEntry } = this.props;
    return (
      <div className={classes.row}>
        <IconButton
          aria-label="Delete"
          className={classes.margin}
          onClick={() => deleteExistingEntry(metaKey)}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
        <Typography
          component="div"
          style={{ width: "inherit", marginLeft: "10px" }}
        >
          {metaKey}
        </Typography>
        :
        <Typography
          component="div"
          style={{ width: "inherit", marginLeft: "10px" }}
        >
          {metaValue}
        </Typography>
      </div>
    );
  }
}

const StyledMetaDataItem = withStyles(styles)(MetaDataItem);

class AddMetaDataItem extends React.Component {
  state = {
    metaKey: "",
    metaValue: ""
  };
  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };
  addNewEntries = () => {
    this.props.saveNewEntry(this.state.metaKey, this.state.metaValue);
  };
  render() {
    const { metaKey, metaValue } = this.state;
    const { classes } = this.props;
    return (
      <>
        <div className={classes.row}>
          <TextField
            id="standard-uncontrolled"
            label="key"
            className={classes.textField}
            margin="normal"
            value={metaKey || ""}
            name="metaKey"
            onChange={this.handleChange("metaKey")}
          />
          :
          <TextField
            id="standard-uncontrolled"
            label="value"
            className={classes.textField}
            margin="normal"
            value={metaValue || ""}
            name="metaValue"
            onChange={this.handleChange("metaValue")}
          />
        </div>
        <Button
          variant="contained"
          color="primary"
          onClick={this.addNewEntries}
          style={{ float: "right", margin: "0 5px 5px 5px" }}
        >
          Save
        </Button>
      </>
    );
  }
}

const StyledAddMetaDataItem = withStyles(styles)(AddMetaDataItem);

const mapStateToProps = state => ({
  user: state.User.user,
  favoriteThings: state.FavoriteThings.favoriteThings
});

export default connect(mapStateToProps)(MetaData);
