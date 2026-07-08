import { Dimension, Player, system, Vector3, world } from "@minecraft/server";
import { Root } from "../ui/scene/root";
import { VerticalLayout } from "../ui/layout/verticalLayout";
import { TreeLayout } from "../ui/controls/tree";

export class Application {
  static list: Map<string, Application> = new Map();
  static test = 0;

  static {
    system.runInterval(() => {
      for (const [_, app] of Application.list) {
        app.root.hover(app.owner);
      }
    });

    world.afterEvents.playerSwingStart.subscribe((event) => {
      const { player } = event;
      Application.list.get(player.id)?.root.click(player);
    });
  }

  root: Root;

  constructor(
    public dimension: Dimension,
    public location: Vector3,
    public owner: Player
  ) {
    Application.list.set(owner.id, this);

    this.root = new Root(this.dimension, this.location);
    this.setViewDirection(owner.location);
    this.build();
  }

  build(): void {
    const sidebar = new VerticalLayout();

    sidebar.add(new TreeLayout("debugger", this.root));
    sidebar.add(new TreeLayout("paperweightt", this.owner));

    this.root.add(sidebar);
    this.root.frame();
  }

  setViewDirection(location: Vector3): void {
    const angle = (Math.atan2(location.x, location.z) * 180) / Math.PI;

    this.root.setRotation({ x: 0, y: angle + 180, z: 0 });
  }
}
