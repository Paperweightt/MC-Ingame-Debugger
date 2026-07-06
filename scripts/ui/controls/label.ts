import { getStringSize } from "../../utils";
import { Node } from "../scene/node";
import { RenderContext } from "../scene/root";

// type Align = "Left" | "Right" | "Center";

export class Label extends Node {
  constructor(
    x: number,
    y: number,
    private string: string
    // private align: Align = "Left"
  ) {
    super(x, y);
  }

  measure() {
    const size = getStringSize(this.string);

    this.width = size.width;
    this.height = size.height;
  }

  render(ctx: RenderContext): void {
    ctx.drawText(this.string, { x: this.worldX, y: this.worldY });
  }
}
