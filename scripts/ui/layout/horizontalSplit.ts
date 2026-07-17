import { system, world } from "@minecraft/server";
import { getStringSize, Rect } from "../../utils";
import { Button } from "../controls/button";
import { Node } from "../scene/node";

class Divider extends Node {
  button: Button;

  constructor(
    public child: Node,
    public padding: number = 0
  ) {
    super();
    this.button = new Button("\n ");
    let isMoving = false;

    this.button
      .setOnClick((ctx) => {
        if (isMoving) return;

        let previousX = this.worldX;

        const id = system.runInterval(() => {
          const cursor = ctx.getCursor(ctx.player);
          if (!cursor) return;

          this.worldX = cursor.x - HorizontalSplit.HALF_DIVIDER_WIDTH;

          if (previousX !== this.worldX) {
            ctx.frame();
            previousX = this.worldX;
          }
        });

        const event = world.afterEvents.playerSwingStart.subscribe((data) => {
          if (data.player !== ctx.player) return;
          system.clearRun(id);
          world.afterEvents.playerSwingStart.unsubscribe(event);
          isMoving = false;
        });

        isMoving = true;
      })
      .setOnHover(() => {})
      .setOnHoverEnd(() => {});

    this.add(this.button);

    this.children.add(child);
  }

  setHeight(height: number) {
    if (!this.button.label) return;
    this.button.label.setString("\n ".repeat(height / 10));
  }

  replaceChild(node: Node) {
    this.remove(this.child);
    this.add(node);

    this.child = node;
  }

  measure() {
    super.measure();
    this.width = HorizontalSplit.DIVIDER_WIDTH + this.padding + this.child.width;
    this.height = this.child.height;
  }

  arrange(rect: Rect): void {
    let y = rect.y;

    this.worldX = Math.max(rect.x, this.worldX);

    // if (this.worldX > rect.x + rect.width) {
    //   world.sendMessage("world x over width");
    //   this.worldX = Math.min(
    //     this.worldX,
    //     rect.x + rect.width - HorizontalSplit.HALF_DIVIDER_WIDTH - this.padding
    //   );
    // }
    // if (rect.width - this.padding - HorizontalSplit.DIVIDER_WIDTH < 0) {
    //   world.sendMessage("here");
    // }
    this.worldY = rect.y + this.y;
    this.width = Math.min(rect.width - this.worldX, this.width);
    this.height = Math.min(rect.width, this.height);

    this.button.arrange(new Rect(this.worldX, y, Infinity, Infinity));
    this.child.arrange(
      new Rect(
        this.worldX + this.padding + HorizontalSplit.DIVIDER_WIDTH,
        y,
        this.width - this.padding - HorizontalSplit.DIVIDER_WIDTH,
        rect.height
      )
    );
  }
}

export class HorizontalSplit extends Node {
  static DIVIDER_WIDTH = getStringSize(" ").width;
  static HALF_DIVIDER_WIDTH = getStringSize(" ").width / 2;

  dividers: Set<Button> = new Set();

  constructor(
    public padding: number = 0,
    public defaults: number[] = []
  ) {
    super();
  }

  add(child: Node): void {
    if (this.children.size !== 0) {
      super.add(new Divider(child, this.padding));
    } else {
      super.add(child);
    }
  }

  setWindow(index: number, node: Node) {
    const list: Divider[] = [...this.children] as Divider[];

    if (index === 0) throw new Error("Not implemented");

    list[index].replaceChild(node);
  }

  remove(child: Node): void {
    super.remove(child);
  }

  measure(): void {
    let width = 0;
    let height = 0;

    for (const child of this.children) {
      child.measure();

      width += child.width + this.padding;
      height = Math.max(child.height, height);
    }

    for (const child of this.children) {
      if (child instanceof Divider) child.setHeight(height);
    }

    this.width = width;
    this.height = height;
  }

  arrange(rect: Rect): void {
    this.worldX = rect.x + this.x;
    this.worldY = rect.y + this.y;
    this.width = Math.min(rect.width, this.width);
    this.height = Math.min(rect.width, this.height);

    const children = [...this.children];

    for (let i = 0; i < children.length; i++) {
      const prevDivider = children[i - 1];
      const currentDivider = children[i];
      const nextDivider = children[i + 1];

      const start =
        i > 1 ? prevDivider.worldX + HorizontalSplit.DIVIDER_WIDTH + this.padding : rect.x;
      const end = nextDivider ? nextDivider.worldX - this.padding : rect.width;
      const width = end - start;

      currentDivider.arrange(new Rect(start, this.worldY, width, Infinity));
    }
  }
}
