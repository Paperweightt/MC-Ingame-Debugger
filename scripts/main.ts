import { world } from "@minecraft/server";
import { Application } from "./debugger/application";

world.afterEvents.worldLoad.subscribe(() => {
  const overworld = world.getDimension("overworld");
  const player = world.getPlayers({ name: "Paperweightt192" })[0];

  new Application(overworld, { x: 0, y: -50, z: 0 }, player);
});
