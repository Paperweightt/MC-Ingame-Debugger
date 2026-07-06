import { Dimension, TextPrimitive, Vector2, Vector3, world } from "@minecraft/server";
import { Node } from "./node";
import { Rect } from "../../utils";
import { VECTOR3_ZERO, Vector3Utils } from "@minecraft/math";

export interface RenderContext {
  dimension: Dimension;
  layoutDirty: boolean;
  drawText: (text: string, location: Vector2, rotation?: Vector3) => TextPrimitive;
  createButton: (rect: Rect) => void;
}

export class Root extends Node {
  static scenes: Set<Root> = new Set();
  static BLOCK_TO_PIXELS = 37.5;

  textPrimitives: TextPrimitive[] = [];
  buttons: Rect[] = [];
  layoutDirty = true;
  scale = 1;
  width: number = Infinity;
  height: number = Infinity;

  constructor(
    public dimension: Dimension,
    public location: Vector3
  ) {
    super();
    Root.scenes.add(this);
  }

  render(ctx: RenderContext): void {
    for (const child of this.children) {
      child.render(ctx);
    }

    this.layoutDirty = ctx.layoutDirty;
  }

  frame() {
    const ctx: RenderContext = {
      dimension: this.dimension,
      drawText: this.drawText.bind(this),
      createButton: this.createButton.bind(this),
      layoutDirty: this.layoutDirty,
    };

    if (this.layoutDirty) {
      world.sendMessage("hi");
      this.measure();
      this.arrange(new Rect(0, 0, this.width, this.height));

      this.layoutDirty = false;
    }

    this.clear();

    this.render(ctx);
  }

  drawText(text: string, location: Vector2, rotation: Vector3 = VECTOR3_ZERO): TextPrimitive {
    const textPrimitive = new TextPrimitive(
      {
        x: this.location.x + location.x * Root.BLOCK_TO_PIXELS * this.scale,
        y: this.location.y + location.y * Root.BLOCK_TO_PIXELS * this.scale,
        z: this.location.z,
      },
      text
    );

    textPrimitive.rotation = rotation;
    textPrimitive.useRotation = true;

    world.sendMessage(Vector3Utils.toString(textPrimitive.location));

    this.textPrimitives.push(textPrimitive);
    world.primitiveShapesManager.addText(textPrimitive, this.dimension);

    return textPrimitive;
  }

  createButton(rect: Rect): void {}

  clear(): void {
    for (const textPrimitive of this.textPrimitives) {
      textPrimitive.remove();
    }
  }
}
