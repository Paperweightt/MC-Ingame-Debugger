import { Dimension, Player, system, Vector3, world } from "@minecraft/server";
import { Root } from "../ui/scene/root";
import { VerticalLayout } from "../ui/layout/verticalLayout";
import { Button } from "../ui/controls/button";
import { TreeLayout } from "../ui/controls/tree";

system.runInterval(() => {
  for (const [_, app] of Application.list) {
    app.root.hover(app.owner);
  }
});

world.afterEvents.playerSwingStart.subscribe((event) => {
  const { player } = event;
  const app = Application.list.get(player.id);

  if (!app) return;

  app.root.click(player);
});

export class Application {
  static list: Map<string, Application> = new Map();

  root: Root;

  constructor(
    public dimension: Dimension,
    public location: Vector3,
    public owner: Player
  ) {
    Application.list.set(owner.id, this);

    this.root = new Root(this.dimension, this.location);
    this.build();
  }

  build(): void {
    const words = ["hi", "hello", "wahhhh"];
    const sidebar = new VerticalLayout();

    for (const word of words) {
      sidebar.add(
        new Button(word).setOnClick((ctx) => {
          ctx.player.sendMessage(word);
        })
      );
    }

    sidebar.add(
      new TreeLayout("location", { x: { x: { x: 0, y: 0, z: 0 }, y: 0, z: 0 }, y: 0, z: 0 })
    );

    this.root.add(sidebar);
    this.root.frame();
  }
}
