import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";

import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

const styles = theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "column"
  },
  card: {
    minWidth: 275,
    maxWidth: 400
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
      userMsg: null
    };
  }
  handleChange = name => event => {
    this.setState({ [name]: event.target.value, userMsg: null });
  };

  onClickSave = () => {
    const { title, description } = this.state;
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
  };

  render() {
    const { classes } = this.props;
    const { description, title, userMsg } = this.state;
    return (
      <Card className={classes.card}>
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
      </Card>
    );
  }
}

export default withStyles(styles)(FTInput);
