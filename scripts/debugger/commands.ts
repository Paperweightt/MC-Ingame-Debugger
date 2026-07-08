import { Player, system } from "@minecraft/server";
import { Application } from "./application";

export class Command {
  static PREFIX = "debug";

  static {
    system.afterEvents.scriptEventReceive.subscribe((event) => {
      if (!(event.sourceEntity instanceof Player)) return;

      const { id, sourceEntity: player } = event;

      const [prefix, command] = id.split(":");
      // const args = event.message.split(" ");

      if (prefix !== this.PREFIX) return;

      if (["c", "con", "console"].includes(command)) {
        new Application(player.dimension, player.location, player);
      }
    });
  }
}
