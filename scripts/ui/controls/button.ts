import { colorCodes, Rect } from "../../utils";
import { Node } from "../scene/node";
import { ButtonContext, RenderContext } from "../scene/root";
import { Label } from "./label";

export class Button extends Node {
  onHover?: (ctx: ButtonContext) => void;
  onHoverEnd?: (ctx: ButtonContext) => void;
  onClick?: (ctx: ButtonContext) => void;

  constructor(text?: string) {
    super();

    if (text) {
      const label = new Label(text);

      this.add(label);
    }
  }

  measure() {
    super.measure();

    const child = this.children.values().next().value;

    this.height = child?.height || 0;
    this.width = child?.width || 0;
  }

  setDefaultHover(): void {
    this.setOnHover(() => {
      label.textPrimitive?.setText(colorCodes.gray + text);
    }).setOnHoverEnd(() => {
      label.textPrimitive?.setText(text);
    });
  }

  setOnHover(callback: (ctx: ButtonContext) => void): Button {
    this.onHover = callback;
    return this;
  }

  setOnHoverEnd(callback: (ctx: ButtonContext) => void): Button {
    this.onHoverEnd = callback;
    return this;
  }

  setOnClick(callback: (ctx: ButtonContext) => void): Button {
    this.onClick = callback;
    return this;
  }

  render(ctx: RenderContext): void {
    super.render(ctx);
    ctx.createButton(new Rect(this.worldX, this.worldY, this.width, this.height), {
      onHover: this.onHover,
      onClick: this.onClick,
      onHoverEnd: this.onHoverEnd,
    });
  }
}
