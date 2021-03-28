import * as React from "react";
import { useEffect, useState } from "react";

export default function ScrollButton(props) {
  const [scrollHandle, setScrollHandle] = useState({});

  const scrollPage = () => {
    const targetElement = props.targetRef.current.getElement();
    if (props.direction === "right") {
      targetElement.scrollLeft += targetElement.clientWidth;
    } else {
      targetElement.scrollLeft -= targetElement.clientWidth;
    }
    props.onScroll(props.direction, targetElement);
  };

  const requestInterval = (fn, delay) => {
    let start = new Date().getTime();
    let handle = {};

    function loop() {
      const current = new Date().getTime();
      const delta = current - start;

      if (delta >= delay) {
        fn();
        start = new Date().getTime();
      }
      handle.value = requestAnimationFrame(loop);
    }

    handle.value = requestAnimationFrame(loop);
    return handle;
  };

  useEffect(
    () => {
      if (!props.display) {
        cancelAnimationFrame(scrollHandle.value);
      }
    }, [props.display]
  );

  return props.display ? (
    <button
      className={"scroll-button-" + props.direction}
      onMouseDown={() => {
        scrollPage();
        setScrollHandle(requestInterval(
          scrollPage, 350
        ));
      }}
      onMouseLeave={() => {
        cancelAnimationFrame(scrollHandle.value);
      }}
      onMouseUp={() => {
        cancelAnimationFrame(scrollHandle.value);
      }}
    ></button>
  ) : null;
}
