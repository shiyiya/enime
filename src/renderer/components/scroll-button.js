import * as React from "react";

export default class scrollButton extends React.Component {
  constructor(props) {
    super(props);
    console.log(props.direction, props.display)
    this.state = {
      scrollActionId: 0
    };
  }

  componentDidUpdate() {
    if (!this.props.display) {
      clearInterval(this.state.scrollActionID)
    }
  }

  render() {
    return this.props.display ? (
      <button
        className={"scroll-button-" + this.props.direction}
        onMouseDown={() => {
          this.props.scrollFunction(this.props.direction);
          this.state.scrollActionID = setInterval(
            () => {this.props.scrollFunction(this.props.direction)}, 350
          );
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
    ) : null
  }
}
