import React from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import Typography from "@material-ui/core/Typography";
import Slide from "@material-ui/core/Slide";
import Grow from "@material-ui/core/Grow";

import "./History.css";

import uuid from "react-uuid";

export default class History extends React.Component {
  // To stop needless re-rendering if props don't change
  shouldComponentUpdate(nextProps) {
    if (this.props.history === nextProps.history) return false;
    else return true;
  }

  render() {
    // let classes = useStyles();

    // Renders an animated scrollable list that displays the turn history passed from the main board component
    return (
      <Slide
        direction="left"
        in={true}
        mountOnEnter
        unmountOnExit
        timeout={1500}
      >
        <List id="list-main-frame" subheader={<li />}>
          <li>
            <ul key={uuid()}>
              <ListSubheader className="list-subheader">
                <Typography
                  variant="h5"
                  gutterBottom
                >{`${this.props.player}'s Turn`}</Typography>
              </ListSubheader>
              {this.props.history.map((item, i) => {
                // If statemen  ts so that the whole array doesn't get animated everytime the props update

                if (i === 0) {
                  return (
                    <Grow in={true} timeout={1000} key={uuid()}>
                      <ListItem
                        key={uuid()}
                        className="list-item"
                        divider={true}
                      >
                        <ListItemText primary={`${item}`} className="primary" />
                      </ListItem>
                    </Grow>
                  );
                } else {
                  return (
                    <ListItem key={uuid()} className="list-item" divider={true}>
                      <ListItemText primary={`${item}`} className="primary" />
                    </ListItem>
                  );
                }
              })}
            </ul>
          </li>
        </List>
      </Slide>
    );
  }
}
