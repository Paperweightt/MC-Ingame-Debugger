import { Rect } from "../../utils";
import { Node } from "../scene/node";

export class VerticalLayout extends Node {
  measure(): void {
    let width = 0;
    let height = 0;

    for (const child of this.children) {
      child.measure();

      height += child.height;
      width = Math.max(child.width, width);
    }

    this.width = width;
    this.height = height;
  }

  arrange(rect: Rect): void {
    let y = rect.y;
    let x = rect.x;

    for (const child of this.children) {
      child.arrange(rect);

      child.worldX = x;
      child.worldY = y;
      y -= child.height;
    }
  }
}
