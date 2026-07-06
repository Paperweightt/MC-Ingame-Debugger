import { world } from "@minecraft/server";
import { getStringSize } from "../../utils";
import { Node } from "../scene/node";
import { RenderContext } from "../scene/root";

type Align = "Left" | "Right" | "Center";

export class Label extends Node {
  constructor(
    x: number,
    y: number,
    private string: string,
    private align: Align = "Left"
  ) {
    super(x, y);
  }

  measure() {
    const size = getStringSize(this.string);
    this.width = size.height;
    this.height = size.width;
  }

  render(ctx: RenderContext): void {
    world.sendMessage("hi");
    ctx.drawText(this.string, { x: this.x, y: this.y });
  }
}
