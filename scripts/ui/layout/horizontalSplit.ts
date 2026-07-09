import { Rect } from "../../utils";
import { Button } from "../controls/button";
import { Node } from "../scene/node";

export class HorizontalSplit extends Node {
  dividers: Set<Button> = new Set();

  constructor(public padding: number = 0) {
    super();
  }

  add(child: Node): void {
    if (this.children.size !== 0) {
      this.addDivider();
    }

    this.children.add(child);
  }

  addDivider(): void {
    const button = new Button("\n ");

    this.dividers.add(button);
    this.children.add(button);
  }

  measure(): void {
    let width = 0;
    let height = 0;

    for (const child of this.children) {
      if (child instanceof Button && this.dividers.has(child)) continue;

      child.measure();

      width += child.width + this.padding;
      height = Math.max(child.height, height);
    }

    for (const child of this.dividers) {
      if (!child.label) continue;
      child.label.textPrimitive?.setText("\n ".repeat(height / 10));
      child.label.string = "\n ".repeat(height / 10);
    }

    this.width = width;
    this.height = height;
  }

  arrange(rect: Rect): void {
    let y = rect.y;
    let x = rect.x;
    let isDivider = false;

    this.worldX = rect.x + this.x;
    this.worldY = rect.y + this.y;
    this.width = Math.min(rect.width, this.width);
    this.height = Math.min(rect.width, this.height);

    for (const child of this.children) {
      child.arrange(new Rect(x, y, rect.width, rect.height));

      x += child.width + this.padding;

      isDivider = !isDivider;
    }
  }
}
