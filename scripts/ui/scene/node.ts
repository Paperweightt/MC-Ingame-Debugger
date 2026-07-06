import { Rect } from "../../utils";
import { RenderContext } from "./root";

export abstract class Node {
  protected children: Set<Node> = new Set();

  worldX = 0;
  worldY = 0;
  width = 0;
  height = 0;

  constructor(
    public x: number = 0,
    public y: number = 0
  ) {}

  add(child: Node): void {
    this.children.add(child);
  }

  remove(child: Node): void {
    this.children.delete(child);
  }

  arrange(rect: Rect): void {
    this.worldX = this.x + rect.x;
    this.worldY = this.y + rect.y;

    for (const child of this.children) {
      child.arrange(
        new Rect(
          this.worldX,
          this.worldY,
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
