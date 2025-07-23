"use strict";
(() => {
  // widget-src/code.tsx
  var { widget } = figma;
  var { Frame } = widget;
  function Widget() {
    return /* @__PURE__ */ figma.widget.h(Frame, { width: 100, height: 100, fill: "#C4C4C4" });
  }
  widget.register(Widget);
})();
