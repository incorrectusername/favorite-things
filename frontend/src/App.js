import React, { Component } from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import "./App.css";
import AppShell from "./AppShell";

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div className="App">
          <AppShell />
        </div>
      </Provider>
    );
  }
}

export default App;
