import { colorCodes, Rect } from "../../utils";
import { Node } from "../scene/node";
import { ButtonContext, RenderContext } from "../scene/root";
import { Label } from "./label";

export class Button extends Node {
  private callbacks: {
    onHover?: (ctx: ButtonContext) => void;
    onHoverEnd?: (ctx: ButtonContext) => void;
    onClick?: (ctx: ButtonContext) => void;
  } = {};

  label?: Label;

  constructor(text?: string) {
    super();

    if (text) {
      this.label = new Label(text);

      this.add(this.label);

      this.setOnHover((ctx) => {
        this.label?.setString(colorCodes.gray + text);
        ctx.frame();
      }).setOnHoverEnd((ctx) => {
        this.label?.setString(text);
        ctx.frame();
      });
    }
  }

  measure() {
    super.measure();

    const child = this.children.values().next().value;

    this.height = child?.height || 0;
    this.width = child?.width || 0;
  }

  setOnHover(callback: (ctx: ButtonContext) => void): Button {
    this.callbacks.onHover = callback;
    return this;
  }

  setOnHoverEnd(callback: (ctx: ButtonContext) => void): Button {
    this.callbacks.onHoverEnd = callback;
    return this;
  }

  setOnClick(callback: (ctx: ButtonContext) => void): Button {
    this.callbacks.onClick = callback;
    return this;
  }

  render(ctx: RenderContext): void {
    super.render(ctx);
    ctx.createButton(new Rect(this.worldX, this.worldY, this.width, this.height), this.callbacks);
  }
}
