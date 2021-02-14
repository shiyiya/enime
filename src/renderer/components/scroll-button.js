import * as React from "react";

export default class scrollButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollActionId: 0
    };
    this.scrollOffset = props.direction === "right" ? 170 : -170;
  }

  render() {
    return (
      <button
        className={"scroll-button-" + this.props.direction}
        onMouseDown={() => {
          this.props.scrollFunction(this.scrollOffset);
          this.state.scrollActionID = setInterval(
            () => this.props.scrollFunction(this.scrollOffset),
            350);
        }}
        onMouseLeave={() => {
          clearInterval(this.state.scrollActionID);
        }}
        onMouseUp={() => {
          clearInterval(this.state.scrollActionID);
        }}
      >
        {this.props.direction === "right" ? "→" : "←"}
      </button>
    );
  }
}
