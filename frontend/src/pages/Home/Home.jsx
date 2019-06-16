import React, { Component } from "react";
import Typography from "@material-ui/core/Typography";
import FTInput from "../../components/FTInput";
class Home extends Component {
  state = {
    greetMsg: "",
    extraMsg: undefined
  };

  componentDidMount = () => {};

  render() {
    return (
      <>
        <FTInput />
      </>
    );
  }
}

export default Home;
