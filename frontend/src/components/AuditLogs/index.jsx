import React from "react";
import axios from "axios";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import CircularProgress from "@material-ui/core/CircularProgress";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

import { BACKEND_SERVER } from "../../constants/consts";

class AuditLogs extends React.Component {
  state = {
    fetched: false,
    logs: []
  };

  componentDidMount() {
    const { user_id, favorite_id } = this.props;
    axios
      .get(
        `${BACKEND_SERVER}/api/v1/logs/user/${user_id}/favorite/${favorite_id}`
      )
      .then(resp => resp.data)
      .then(logs =>
        this.setState({
          logs: logs.logs.sort(
            (a, b) => new Date(a.created) - new Date(b.created)
          ),
          fetched: true
        })
      );
  }

  render() {
    const { logs, fetched } = this.state;
    if (!fetched) {
      return (
        <Paper
          style={{
            minWidth: "250px",
            margin: "0 auto",
            left: "50%"
          }}
        >
          <CircularProgress
            style={{
              margin: "0 auto",
              position: "absolute",
              left: "50%"
            }}
          />
        </Paper>
      );
    }
    return (
      <div role="presentation">
        <List
          style={{
            maxWidth: "350px"
          }}
        >
          {logs.map((log, i) => {
            return (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column"
                }}
                key={log.text + log.created + i}
              >
                <ListItem button>
                  <Typography>{log.text}</Typography>
                </ListItem>
                <Typography
                  variant="caption"
                  style={{
                    alignSelf: "flex-end"
                  }}
                >
                  At:
                  {new Date(log.created).toDateString() +
                    ", " +
                    new Date(log.created).toLocaleTimeString()}
                </Typography>
                <Divider component="li" />
              </div>
            );
          })}
        </List>
      </div>
    );
  }
}

export default AuditLogs;
