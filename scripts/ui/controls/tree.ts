import { colorCodes } from "../../utils";
import { VerticalLayout } from "../layout/verticalLayout";
import { Node } from "../scene/node";
import { Button } from "./button";
import { Label } from "./label";

export class TreeLayout extends Node {
  static getClass(object: Object) {
    const name = object.constructor.name;
    switch (name) {
      case "Set":
        return "Set<>";
      case "Map":
        return "Map<>";
      case "Array":
        return "[]";
      case "Object":
        return "{}";
      default:
        return name;
    }
  }

  layout = new VerticalLayout();

  constructor(
    public key: string,
    public value: Object,
    public prefix: string = ""
  ) {
    super();
    this.add(this.layout);

    const branch = new VerticalLayout();
    const childPrefix = prefix + "│ ";
    let state = false;

    function addNode(key: string | number, value: any): void {
      if (typeof value === "object") {
        branch.add(new TreeLayout(key + ": " + TreeLayout.getClass(value), value, childPrefix));
      } else if (typeof value === "function") {
        branch.add(new Label(childPrefix + "ƒ " + key));
      } else if (typeof value === "string") {
        branch.add(new Label(`${childPrefix}≡ ${key}: "${value.replaceAll("\n", "\\ n")}"`));
      } else {
        branch.add(new Label(childPrefix + "≡ " + key + ": " + value));
      }
    }

    const label = new Label(prefix + "> " + key);

    const button = new Button()
      .setOnClick((ctx) => {
        if ((state = !state)) {
          branch.clear();

          if (value instanceof Set) {
            let index = 0;
            for (const node of value) addNode(index++, node);
          } else if (value instanceof Map) {
            for (const [key, node] of value) addNode(key, node);
          } else {
            for (const [key, node] of Object.entries(value)) addNode(key, node);
          }

          label.string = prefix + "v " + key;
          this.layout.add(branch);
        } else {
          label.string = prefix + "> " + key;
          this.layout.remove(branch);
        }
        ctx.frame();
      })
      .setOnHover(() => {
        const arrow = state ? "v " : "> ";
        label.textPrimitive?.setText(prefix + arrow + colorCodes.gray + key);
      })
      .setOnHoverEnd(() => {
        const arrow = state ? "v " : "> ";
        label.textPrimitive?.setText(prefix + arrow + key);
      });

    button.add(label);

    this.layout.add(button);
  }

  measure(): void {
    super.measure();

    this.height = this.layout.height;
    this.width = this.layout.width;
  }
}
