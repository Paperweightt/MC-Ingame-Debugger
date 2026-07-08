import { Dimension, Player, TextPrimitive, Vector2, Vector3, world } from "@minecraft/server";
import { Node } from "./node";
import { getPlayerEye, Rect } from "../../utils";
import { VECTOR3_ZERO, Vector3Utils as Vec3 } from "@minecraft/math";

export interface RenderContext {
  dimension: Dimension;
  drawText: (text: string, location: Vector2, rotation?: Vector3) => TextPrimitive;
  createButton: (rect: Rect, callbacks: ButtonCallbacks) => void;
}

export interface ButtonCallbacks {
  onHover?: (ctx: ButtonContext) => void;
  onHoverEnd?: (ctx: ButtonContext) => void;
  onClick?: (ctx: ButtonContext) => void;
}

export interface ButtonContext {
  dimension: Dimension;
  player: Player;
  frame: () => void;
}

export class Root extends Node {
  static scenes: Set<Root> = new Set();
  static BLOCK_TO_PIXELS = 37.5;

  textPrimitives: [TextPrimitive, Vector2][] = [];
  buttons: { rect: Rect; callbacks: ButtonCallbacks }[] = [];
  layoutDirty = true;
  scale = 1;
  previousButtonHovered?: ButtonCallbacks;
  width: number = Infinity;
  height: number = Infinity;
  rotation: Vector3 = VECTOR3_ZERO;

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
  }

  frame(): void {
    const ctx: RenderContext = {
      dimension: this.dimension,
      drawText: this.drawText.bind(this),
      createButton: this.createButton.bind(this),
    };

    if (this.layoutDirty) {
      this.measure();
      this.arrange(new Rect(0, 0, this.width, this.height));

      this.layoutDirty = false;
    }

    this.clear();

    this.render(ctx);
  }

  drawText(text: string, location: Vector2): TextPrimitive {
    const rotatedLocation = Vec3.rotateY(
      {
        x: (-location.x / Root.BLOCK_TO_PIXELS) * this.scale,
        y: (location.y / Root.BLOCK_TO_PIXELS) * this.scale,
        z: 0,
      },
      (this.rotation.y * Math.PI) / 180
    );

    const textPrimitive = new TextPrimitive(Vec3.add(this.location, rotatedLocation), text);

    textPrimitive.rotation = this.rotation;
    textPrimitive.useRotation = true;

    this.textPrimitives.push([textPrimitive, location]);
    world.primitiveShapesManager.addText(textPrimitive, this.dimension);

    return textPrimitive;
  }

  click(player: Player): void {
    const cursor = this.getCursor(player);
    if (!cursor) return;
    const button = this.getButton(cursor);
    if (!button) return;

    const ctx: ButtonContext = {
      dimension: this.dimension,
      frame: this.frame.bind(this),
      player: player,
    };

    if (button.onClick) button.onClick(ctx);
  }

  hover(player: Player): void {
    const cursor = this.getCursor(player);
    if (!cursor) return;
    const button = this.getButton(cursor);

    if (button === this.previousButtonHovered) return;

    const ctx: ButtonContext = {
      dimension: this.dimension,
      frame: this.frame.bind(this),
      player: player,
    };

    if (this.previousButtonHovered !== button && this.previousButtonHovered?.onHoverEnd) {
      this.previousButtonHovered.onHoverEnd(ctx);
    }

    this.previousButtonHovered = button;

    if (!button) return;

    if (button.onHover) {
      button.onHover(ctx);
    }
  }

  getButton({ x, y }: Vector2): ButtonCallbacks | undefined {
    for (const { rect, callbacks } of this.buttons) {
      if (rect.contains(x, y)) return callbacks;
    }
  }

  getCursor(player: Player): Vector2 | undefined {
    const location = Vec3.rotateY(
      Vec3.subtract(getPlayerEye(player), this.location),
      ((-this.rotation.y + 90) * Math.PI) / 180
    );
    const dir = Vec3.rotateY(player.getViewDirection(), ((-this.rotation.y + 90) * Math.PI) / 180);

    if (dir.x < 0) return;

    const t = -location.x / dir.x;
    if (t < 0) return;

    const hitY = location.y + t * dir.y;
    const hitZ = location.z + t * dir.z;

    return {
      x: hitZ * Root.BLOCK_TO_PIXELS * this.scale - 0.5,
      y: hitY * Root.BLOCK_TO_PIXELS * this.scale - 0.5,
    };
  }

  createButton(rect: Rect, callbacks: ButtonCallbacks): void {
    this.buttons.push({ rect, callbacks });
  }

  setRotation(rotation: Vector3): void {
    this.rotation = rotation;

    for (const [textPrimitive, location] of this.textPrimitives) {
      const rotatedLocation = Vec3.rotateY(
        {
          x: (-location.x / Root.BLOCK_TO_PIXELS) * this.scale,
          y: (location.y / Root.BLOCK_TO_PIXELS) * this.scale,
          z: 0,
        },
        (this.rotation.y * Math.PI) / 180
      );

      textPrimitive.setLocation(Vec3.add(this.location, rotatedLocation));
      textPrimitive.rotation = rotation;
    }
  }

  clear(): void {
    for (const [textPrimitive] of this.textPrimitives) {
      textPrimitive.remove();
    }
    this.textPrimitives = [];
    this.buttons = [];
    this.previousButtonHovered = undefined;
  }
}
