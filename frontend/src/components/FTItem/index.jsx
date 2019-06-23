import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Chip from "@material-ui/core/Chip";
import Tooltip from "@material-ui/core/Tooltip";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import Popover from "@material-ui/core/Popover";
import IconButton from "@material-ui/core/IconButton";
import MoreIcon from "@material-ui/icons/MoreVert";

import MetaData from "../MetaData";
import UpdateFTItem from "../UpdateFTItem";

const styles = theme => ({
  card: {
    minWidth: 275,
    maxWidth: 400,
    padding: theme.spacing(1),
    margin: theme.spacing(1, 1),
    border: "1px solid transparent",
    borderRadius: "8px",
    borderColor: "#e0e0e0"
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)"
  },
  title: {
    fontSize: 14
  },
  chip: {
    margin: theme.spacing(1)
  },
  cardActions: {
    display: "flex",
    justifyContent: "space-between"
  }
});

class Item extends React.Component {
  state = {
    editing: false,
    anchorEl: null
  };

  editClick = () => {
    this.setState({
      editing: true
    });
  };

  handleDialogClose = () => {
    this.setState({
      editing: false
    });
  };

  createOption = label => ({
    label,
    value: label.toLowerCase()
  });

  handlePopOverCLick = event => {
    this.setState({
      anchorEl: event.currentTarget
    });
  };

  handleAnchorClose = () => {
    this.setState({
      anchorEl: null
    });
  };

  render() {
    const { classes, favoriteThing } = this.props;
    const { editing, anchorEl } = this.state;
    const open = Boolean(anchorEl);

    const id = open ? "simple-popover" : null;

    return (
      <>
        <Dialog
          onClose={this.handleDialogClose}
          open={editing}
          aria-labelledby="simple-dialog-title"
        >
          <DialogTitle id="simple-dialog-title">
            <div>
              Edit Favorite Item
              <br />
              <Typography variant="caption" display="block" gutterBottom>
                <span>
                  updated:
                  {new Date(favoriteThing.updated).toDateString() +
                    ", " +
                    new Date(favoriteThing.updated).toLocaleTimeString()}
                </span>
              </Typography>
            </div>
          </DialogTitle>
          <UpdateFTItem
            id={favoriteThing.id}
            title={favoriteThing.title}
            description={favoriteThing.description}
            selectValue={this.createOption(favoriteThing.category)}
            ranking={favoriteThing.ranking}
            handleDialogClose={this.handleDialogClose}
          />
        </Dialog>
        <Card className={classes.card}>
          <CardContent>
            <Typography variant="h5" component="h2">
              {favoriteThing.title}
            </Typography>
            <Typography variant="body2" component="p">
              {favoriteThing.description}
            </Typography>
            <Typography variant="caption" component="p">
              created:{new Date(favoriteThing.created).toLocaleDateString()}
            </Typography>
          </CardContent>
          <CardActions className={classes.CardActions}>
            <Tooltip title="category" aria-label="category">
              <Chip
                label={favoriteThing.category || "none"}
                className={classes.chip}
                variant="outlined"
                color="primary"
              />
            </Tooltip>
            <Tooltip title="ranking" aria-label="ranking">
              <Chip
                label={favoriteThing.ranking || 0}
                className={classes.chip}
                variant="outlined"
                color="primary"
              />
            </Tooltip>
            <Button size="small" onClick={this.editClick}>
              Edit
            </Button>
            <Tooltip title="Edit Metadata" aria-label="Edit Metadata">
              <IconButton
                edge="end"
                color="inherit"
                onClick={this.handlePopOverCLick}
              >
                <MoreIcon />
              </IconButton>
            </Tooltip>
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={this.handleAnchorClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center"
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "center"
              }}
            >
              <MetaData
                metadata={favoriteThing.meta_data || {}}
                id={favoriteThing.id}
              />
            </Popover>
          </CardActions>
        </Card>
      </>
    );
  }
}

export default withStyles(styles)(Item);
