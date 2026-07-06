import { Dimension, Player, Vector3, world } from "@minecraft/server";
import { Root } from "../ui/scene/root";
import { Label } from "../ui/controls/label";

export class Application {
  root: Root;

  constructor(
    public dimension: Dimension,
    public location: Vector3,
    public owner: Player
  ) {
    this.root = new Root(this.dimension, this.location);

    this.build();
  }

  build(): void {
    const label = new Label(0, 0, "hello world?");

    this.root.children.add(label);
    this.root.frame();
  }
}
