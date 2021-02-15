import * as React from "react";
import { useEffect, useState } from "react";

export default function scrollButton({display, direction, scrollFunction}) {
  const [scrollActionID, setScrollActionID] = useState(0);

  useEffect(
    () => {
      if (!display) {
        clearInterval(scrollActionID)
      }
    }, [display]
  )

  return display ? (
    <button
      className={"scroll-button-" + direction}
      onMouseDown={() => {
        scrollFunction(direction);
        setScrollActionID(setInterval(
          () => {scrollFunction(direction)}, 350
        ))
      }}
      onMouseLeave={() => {
        clearInterval(scrollActionID);
      }}
      onMouseUp={() => {
        clearInterval(scrollActionID);
      }}
    >
      {direction === "right" ? "→" : "←"}
    </button>
  ) : null
}
