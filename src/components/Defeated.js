import React, { Component } from "react";
import Unit from "./Unit";
import uuid from "react-uuid";
import "./Defeated.css";

import Slide from "@material-ui/core/Slide";

export default class Defeated extends Component {
  // To prevent needless re-rendering when props don't change
  shouldComponentUpdate(nextProps) {
    if (
      this.props.black === nextProps.black &&
      this.props.white === nextProps.white
    ) {
      return false;
    } else return true;
  }

  // Helper function to for conditional animation rendering, will animate only the last item added to the array so that the whole
  // array doesn't animate at once

  renderUnits = array => {
    return array.map((unit, i) => {
      if (i === array.length - 1) {
        return (
          <div className="unit-spacing bounce-in-fwd" key={uuid()}>
            <Unit name={unit.name} alignment={unit.alignment} key={uuid()} />
          </div>
        );
      } else {
        return (
          <div className="unit-spacing" key={uuid()}>
            <Unit name={unit.name} alignment={unit.alignment} key={uuid()} />
          </div>
        );
      }
    });
  };

  render() {
    return (
      <Slide
        direction="right"
        in={true}
        mountOnEnter
        unmountOnExit
        timeout={1500}
      >
        <div className="component-main-frame">
          {this.renderUnits(this.props.black)}
          <br />
          {this.renderUnits(this.props.white)}
        </div>
      </Slide>
    );
  }
}
