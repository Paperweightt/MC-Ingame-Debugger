import { Player } from "@minecraft/server";
import { colorCodes, Rect } from "../../utils";
import { Node } from "../scene/node";
import { RenderContext } from "../scene/root";
import { Label } from "./label";

export class Button extends Node {
  onHover?: (player: Player) => void;
  onHoverEnd?: (player: Player) => void;
  onClick?: (player: Player) => void;

  constructor(text?: string) {
    super();

    if (text) {
      const label = new Label(text);

      this.add(label);

      this.setOnHover(() => {
        label.textPrimitive?.setText(colorCodes.dark_green + text);
      }).setOnHoverEnd(() => {
        label.textPrimitive?.setText(text);
      });
    }
  }

  measure() {
    this.height = 0;
    this.width = 0;

    super.measure();

    for (const child of this.children) {
      this.height = Math.max(this.height, child.height);
      this.width = Math.max(this.width, child.width);
    }
  }

  setOnHover(callback: (player: Player) => void): Button {
    this.onHover = callback;
    return this;
  }

  setOnHoverEnd(callback: (player: Player) => void): Button {
    this.onHoverEnd = callback;
    return this;
  }

  setOnClick(callback: (player: Player) => void): Button {
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
