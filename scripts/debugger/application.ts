import { Dimension, EntitySwingSource, Player, system, Vector3, world } from "@minecraft/server";
import { Root } from "../ui/scene/root";
import { VerticalLayout } from "../ui/layout/verticalLayout";
import { TreeLayout } from "../ui/controls/tree";
import { Label } from "../ui/controls/label";
import { HorizontalSplit } from "../ui/layout/horizontalSplit";
import { Button } from "../ui/controls/button";
import { WatchRegistry } from "./registry";
import { Watch } from "./decorators";

export class Application {
  @Watch("Applications")
  static list: Map<string, Application> = new Map();
  @Watch("Watch List")
  static watchList: Map<string, Object> = WatchRegistry;

  static {
    world.afterEvents.worldLoad.subscribe(() => {
      system.runInterval(() => {
        for (const [_, app] of Application.list) {
          app.root.hover(app.owner);
        }
      });
    });

    world.afterEvents.playerSwingStart.subscribe((event) => {
      const { player, swingSource } = event;
      if (swingSource !== EntitySwingSource.Attack) return;
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
    const app = new HorizontalSplit(2, [80]);
    const sidebar = new VerticalLayout();
    const trees: Map<string, TreeLayout> = new Map();

    app.add(sidebar);
    sidebar.add(new Label("Silverfish Debugger"));
    app.add(new Label("Empty"));

    for (const [key, value] of Application.watchList) {
      trees.set(key, new TreeLayout(key, value));
    }

    for (const [id, tree] of trees) {
      sidebar.add(
        new Button(id).setOnClick((ctx) => {
          app.setWindow(1, tree);
          ctx.frame();
        })
      );
    }

    this.root.add(app);
    this.root.frame();
  }

  setViewDirection(location: Vector3): void {
    const angle = (Math.atan2(location.x, location.z) * 180) / Math.PI;

    this.root.setRotation({ x: 0, y: angle + 180, z: 0 });
  }
}
