import { Rect } from "../../utils";
import { RenderContext } from "./root";

export abstract class Node {
  children: Set<Node> = new Set();

  x = 0;
  y = 0;
  width = 0;
  height = 0;

  constructor(
    public xOffset: number = 0,
    public yOffset: number = 0
  ) {}

  add(child: Node): void {
    this.children.add(child);
  }

  remove(child: Node): void {
    this.children.delete(child);
  }

  arrange(rect: Rect): void {
    this.x = this.xOffset + rect.x;
    this.y = this.yOffset + rect.y;

    for (const child of this.children) {
      child.arrange(
        new Rect(
          this.x,
          this.y,
          Math.min(rect.width, this.width),
          Math.min(rect.width, this.height)
        )
      );
    }
  }

  render(ctx: RenderContext): void {
    for (const child of this.children) {
      child.render(ctx);
    }
  }

  measure(): void {
    for (const child of this.children) {
      child.measure();
    }
  }
}
