import { Rect } from "../../utils";
import { RenderContext } from "./root";

export abstract class Node {
  protected children: Set<Node> = new Set();

  worldX = 0;
  worldY = 0;
  width = 0;
  height = 0;
  x = 0;
  y = 0;

  add(child: Node): void {
    this.children.add(child);
  }

  remove(child: Node): void {
    this.children.delete(child);
  }

  clear(): void {
    this.children.clear();
  }

  arrange(rect: Rect): void {
    this.worldX = this.x + rect.x;
    this.worldY = this.y + rect.y;
    this.width = Math.min(rect.width, this.width);
    this.height = Math.min(rect.height, this.height);

    for (const child of this.children) {
      child.arrange(new Rect(this.worldX, this.worldY, this.width, this.height));
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
