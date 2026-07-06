import { Player, Vector3 } from "@minecraft/server";
import { chars } from "./mojangles";

export class Rect {
  constructor(
    public x: number,
    public y: number,
    public width: number,
    public height: number
  ) {}
}

export interface Size {
  width: number;
  height: number;
}

export function getStringSize(string: string): Size {
  const strings = string.split("\n");
  let width = 0;

  for (const string of strings) {
    let amount = 0;

    for (const char of string) {
      if (!Object.hasOwn(chars, char)) {
        throw new Error(`Unknown char: "${char}"`);
      }

      amount += chars[char] + 1;
    }

    width = Math.max(amount, width);
  }

  return {
    width: width + 1 + (width % 2 ? 0 : 1),
    height: strings.length * 10,
  };
}

export function getPlayerEye(player: Player): Vector3 {
  const headModelSize = 8;
  const headHeight = headModelSize / 32;
  const location = player.getHeadLocation();

  location.y += headHeight / 2 - 0.022;

  return location;
}

export const colorCodes = {
  black: "§0",
  dark_blue: "§1",
  dark_green: "§2",
  dark_aqua: "§3",
  dark_red: "§4",
  dark_purple: "§5",
  gold: "§6", // orange
  gray: "§7",
  dark_gray: "§8",
  blue: "§9",
  green: "§a", // lime
  aqua: "§b",
  red: "§c", // hot pink
  light_purple: "§d", // magenta
  yellow: "§e",
  white: "§f",
  light_blue: "§w",
  minecoin_gold: "§g",
  material_quartz: "§h",
  material_iron: "§i",
  material_netherite: "§j",
  material_redstone: "§m",
  material_copper: "§n",
  material_gold: "§p",
  material_diamond: "§s",
  material_lapis: "§t",
  material_amethyst: "§u",
  material_resin: "§v",
  obfuscated: "§k",
  bold: "§l",
  italic: "§o",
  reset: "§r",
} as const;
