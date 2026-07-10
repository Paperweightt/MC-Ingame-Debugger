import { system, world } from "@minecraft/server";
import { getStringSize, Rect } from "../../utils";
import { Button } from "../controls/button";
import { Node } from "../scene/node";

export class HorizontalSplit extends Node {
  static DIVIDER_WIDTH = getStringSize(" ").width;
  static HALF_DIVIDER_WIDTH = getStringSize(" ").width / 2;

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
    let isMoving = false;

    button
      .setOnClick((ctx) => {
        if (isMoving) return;

        let previousX = button.worldX;

        const id = system.runInterval(() => {
          const cursor = ctx.getCursor(ctx.player);
          button.worldX = cursor ? cursor.x - HorizontalSplit.HALF_DIVIDER_WIDTH : 0;

          if (previousX !== button.worldX) {
            ctx.frame();
            previousX = button.worldX;
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

    this.dividers.add(button);
    this.children.add(button);
  }

  isDivider(child: Node): boolean {
    return child instanceof Button && this.dividers.has(child);
  }

  measure(): void {
    let width = 0;
    let height = 0;

    for (const child of this.children) {
      if (this.isDivider(child)) continue;

      child.measure();

      width += child.width + this.padding;
      height = Math.max(child.height, height);
    }

    for (const child of this.dividers) {
      if (!child.label) continue;
      child.label.string = "\n ".repeat(height / 10);
      child.measure();
    }

    this.width = width;
    this.height = height;
  }

  arrange(rect: Rect): void {
    this.worldX = rect.x + this.x;
    this.worldY = rect.y + this.y;
    this.width = Math.min(rect.width, this.width);
    this.height = Math.min(rect.width, this.height);

    const dividerIterator: SetIterator<Button> | undefined = this.dividers.values();
    let prevDivider: Button | undefined = undefined;
    let nextDivider: Button | undefined = undefined;

    for (const child of this.children) {
      if (this.isDivider(child)) {
        child.arrange(new Rect(child.worldX, child.worldY, child.width, child.height));
        continue;
      }
      nextDivider = dividerIterator.next().value;

      const start = prevDivider
        ? prevDivider.worldX + HorizontalSplit.DIVIDER_WIDTH + this.padding
        : rect.x;
      const end = nextDivider
        ? nextDivider.worldX - this.padding - HorizontalSplit.DIVIDER_WIDTH
        : rect.width;

      child.arrange(new Rect(start, rect.y, end, rect.height));

      prevDivider = nextDivider;
    }
  }
}
