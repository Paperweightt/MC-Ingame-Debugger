import { Rect } from "../../utils";
import { Node } from "../scene/node";

export class Horizontal extends Node {
  constructor(public padding: number = 0) {
    super();
  }

  measure(): void {
    let width = 0;
    let height = 0;

    for (const child of this.children) {
      child.measure();

      width += child.width + this.padding;
      height = Math.max(child.height, height);
    }

    this.width = width;
    this.height = height;
  }

  arrange(rect: Rect): void {
    let y = rect.y;
    let x = rect.x;

    for (const child of this.children) {
      child.arrange(new Rect(x, y, rect.width, rect.height));

      x += child.width + this.padding;
    }
  }
}
