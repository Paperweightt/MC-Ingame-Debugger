import { TextPrimitive } from "@minecraft/server";
import { getStringSize, getStringWithinBounds } from "../../utils";
import { Node } from "../scene/node";
import { RenderContext } from "../scene/root";

export class Label extends Node {
  textPrimitive?: TextPrimitive;

  constructor(public string: string) {
    super();
  }

  measure() {
    const size = getStringSize(this.string);

    this.width = size.width;
    this.height = size.height;
  }

  render(ctx: RenderContext): void {
    const stringWithinBounds = getStringWithinBounds(this.string, this.width, this.height);

    this.textPrimitive = ctx.drawText(stringWithinBounds.string, {
      x: this.worldX + stringWithinBounds.width / 2,
      y: this.worldY,
    });
  }
}
