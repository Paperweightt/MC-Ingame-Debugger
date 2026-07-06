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
        label.textPrimitive?.setText(colorCodes.gray + text);
      }).setOnHoverEnd(() => {
        label.textPrimitive?.setText(text);
      });
    }
  }

  measure() {
    super.measure();

    const child = this.children.values().next().value;

    this.height = child?.height || 0;
    this.width = child?.width || 0;
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
