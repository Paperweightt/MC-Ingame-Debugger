import { Node } from "../scene/node";
import { RenderContext } from "../scene/root";
import { Label } from "./label";

export class Button extends Node {
  onHover?: (ctx: RenderContext) => void;
  onHoverEnd?: (ctx: RenderContext) => void;
  onClick?: (ctx: RenderContext) => void;

  constructor(label?: string) {
    super();

    if (label) {
      this.add(new Label(label));
    }
  }

  measure() {
    this.height = 0;
    this.width = 0;

    for (const child of this.children) {
      this.height = Math.max(this.height, child.height);
      this.width = Math.max(this.width, child.width);
    }
  }

  setOnHover(callback: (ctx: RenderContext) => void): Button {
    this.onHover = callback;
    return this;
  }

  setOnHoverEnd(callback: (ctx: RenderContext) => void): Button {
    this.onHoverEnd = callback;
    return this;
  }

  setOnClick(callback: (ctx: RenderContext) => void): Button {
    this.onClick = callback;
    return this;
  }
}
