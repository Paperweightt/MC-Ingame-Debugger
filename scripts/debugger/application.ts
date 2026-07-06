import { Dimension, Player, Vector3 } from "@minecraft/server";
import { Root } from "../ui/scene/root";
import { Label } from "../ui/controls/label";
import { VerticalLayout } from "../ui/layout/verticalLayout";

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
    const words = ["hi", "hello", "wahhhh"];
    const sidebar = new VerticalLayout();

    for (const word of words) {
      sidebar.add(new Label(word));
    }

    this.root.add(sidebar);
    this.root.frame();
  }
}
