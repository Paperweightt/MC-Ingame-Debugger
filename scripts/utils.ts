import { Player, Vector3 } from "@minecraft/server";
import { chars } from "./mojangles";

export class Rect {
  constructor(
    public x: number,
    public y: number,
    public width: number,
    public height: number
  ) {}

  contains(x: number, y: number): boolean {
    if (x < this.x) return false;
    if (y > this.y) return false;
    if (x > this.x + this.width) return false;
    if (y < this.y - this.height) return false;

    return true;
  }
}

export interface Size {
  width: number;
  height: number;
}

export interface StringWithBounds extends Size {
  string: string;
}

export function getStringWithinBounds(
  string: string,
  width: number,
  height: number
): StringWithBounds {
  let maxWidth = 0;
  let currentWidth = 0;
  let validLineCount = 0;
  let hasCharsInLine = false;
  let outputString = [];

  if (width <= 0 || height <= 0)
    return {
      string: "",
      width: 0,
      height: 0,
    };

  for (let i = 0; i < string.length; i++) {
    const char = string[i];

    if (char === "\n") {
      if (hasCharsInLine) {
        validLineCount++;
        if (currentWidth > maxWidth) maxWidth = currentWidth;
      }
      currentWidth = 0;
      hasCharsInLine = false;
      outputString.push("\n");
      continue;
    }
    const charWidth = chars[char];
    if (!charWidth) throw new Error(`Unknown char: "${char}"`);

    if (char === "§") {
      const nextChar = string[i + 1];
      if (colorCodeChars.includes(nextChar)) {
        outputString.push(char, nextChar);
        i++;
        continue;
      }
    }

    currentWidth += charWidth + 1;
    outputString.push(char);
    hasCharsInLine = true;

    if (currentWidth > width - 2) {
      const nextNewline = string.indexOf("\n", i);
      if (nextNewline !== -1) {
        i = nextNewline;
      } else {
        break;
      }
    }
  }

  if (hasCharsInLine) {
    validLineCount++;
    if (currentWidth > maxWidth) maxWidth = currentWidth;
  }

  return {
    string: outputString.join(""),
    width: maxWidth > 0 ? maxWidth + 1 + (maxWidth % 2 ? 0 : 1) : 0,
    height: Math.min(validLineCount * 10, height),
  };
}

export function getStringSize(string: string): Size {
  let maxWidth = 0;
  let currentWidth = 0;
  let validLineCount = 0;
  let hasCharsInLine = false;

  for (let i = 0; i < string.length; i++) {
    const char = string[i];

    if (char === "\n") {
      if (hasCharsInLine) {
        validLineCount++;
        if (currentWidth > maxWidth) maxWidth = currentWidth;
      }
      currentWidth = 0;
      hasCharsInLine = false;
      continue;
    }

    const charWidth = chars[char];
    if (!charWidth) throw new Error(`Unknown char: "${char}"`);

    currentWidth += charWidth + 1;
    hasCharsInLine = true;
  }

  if (hasCharsInLine) {
    validLineCount++;
    if (currentWidth > maxWidth) maxWidth = currentWidth;
  }

  return {
    width: maxWidth > 0 ? maxWidth + 1 + (maxWidth % 2 ? 0 : 1) : 0,
    height: validLineCount * 10,
  };
}

export function getPlayerEye(player: Player): Vector3 {
  const location = player.getHeadLocation();

  location.y += 0.103;

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

export const colorCodeChars = Object.values(colorCodes).map((str) => str[1]);

export type DeepChangeCallback = (path: string[], oldValue: any, newValue: any) => void;

export function deepProxy<T extends object>(
  obj: T,
  callback: DeepChangeCallback,
  path: string[] = [],
  proxyCache = new WeakMap<object, any>()
): T {
  const handler: ProxyHandler<object> = {
    get(target, prop) {
      const value = Reflect.get(target, prop);

      if (prop === "prototype") return value;

      if (typeof prop === "string" && value !== null && typeof value === "object") {
        const currentPath = [...path, prop];

        if (!proxyCache.has(value)) {
          proxyCache.set(value, deepProxy(value, callback, currentPath, proxyCache));
        }

        return proxyCache.get(value);
      }

      if (typeof value === "function") {
        return value.bind(target);
      }

      return value;
    },

    set(target, prop, value, receiver) {
      if (typeof prop !== "string") return Reflect.set(target, prop, value, receiver);

      const currentPath = [...path, prop];
      const oldValue = Reflect.get(target, prop);

      const success = Reflect.set(target, prop, value, receiver);

      if (success && oldValue !== value) {
        callback(currentPath, oldValue, value);
      }
      return success;
    },
  };

  return new Proxy(obj, handler) as T;
}
