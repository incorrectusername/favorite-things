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

const styles = theme => ({
  card: {
    minWidth: 275,
    maxWidth: 400
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
    editing: false
  };

  editClick = () => {
    this.setState({
      editClick: true
    });
  };

  handleDialogClose = () => {
    this.setState({
      editClick: false
    });
  };

  render() {
    const { classes, favoriteThing } = this.props;
    const { editClick } = this.state;
    return (
      <>
        <Dialog
          onClose={this.handleDialogClose}
          open={editClick}
          aria-labelledby="simple-dialog-title"
        >
          <DialogTitle id="simple-dialog-title">Set backup account</DialogTitle>
        </Dialog>
        <Card className={classes.card}>
          <CardContent>
            <Typography variant="h5" component="h2">
              {favoriteThing.title}
            </Typography>
            <Typography variant="body2" component="p">
              {favoriteThing.description}
            </Typography>
          </CardContent>
          <CardActions className={classes.CardActions}>
            <Tooltip title="category" aria-label="category">
              <Chip
                label={favoriteThing.category || "none"}
                className={classes.chip}
              />
            </Tooltip>
            <Tooltip title="ranking" aria-label="ranking">
              <Chip
                label={favoriteThing.ranking || 0}
                className={classes.chip}
              />
            </Tooltip>
            <Button size="small" onClick={this.editClick}>
              Edit
            </Button>
          </CardActions>
        </Card>
      </>
    );
  }
}

export default withStyles(styles)(Item);
