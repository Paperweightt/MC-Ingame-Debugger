import { TextPrimitive } from "@minecraft/server";
import { getStringSize } from "../../utils";
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
    this.textPrimitive = ctx.drawText(this.string, {
      x: this.worldX + this.width / 2,
      y: this.worldY,
    });
  }
}
