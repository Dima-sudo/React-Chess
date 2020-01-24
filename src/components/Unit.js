import React, { Component } from "react";
import "./Unit.css";

class Unit extends Component {

  render() {
    return (
      <i
        className={`fas fa-chess-${this.props.name} ${this.props.alignment}`}
      ></i>
    );
  }
}

export default Unit;
