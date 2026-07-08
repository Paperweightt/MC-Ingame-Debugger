import { Rect } from "../../utils";
import { Node } from "../scene/node";

export class VerticalLayout extends Node {
  constructor(public padding: number = 0) {
    super();
  }

  measure(): void {
    let width = 0;
    let height = 0;

    for (const child of this.children) {
      child.measure();

      height += child.height + this.padding;
      width = Math.max(child.width, width);
    }

    this.width = width;
    this.height = height;
  }

  arrange(rect: Rect): void {
    let y = rect.y;
    let x = rect.x;

    this.worldX = rect.x + this.x;
    this.worldY = rect.y + this.y;
    this.width = Math.min(rect.width, this.width);
    this.height = Math.min(rect.width, this.height);

    for (const child of this.children) {
      child.worldX = x;
      child.worldY = y;
      child.arrange(new Rect(x, y, rect.width, rect.height));

      y -= child.height + this.padding;
    }
  }
}
