import { colorCodes } from "../../utils";
import { VerticalLayout } from "../layout/verticalLayout";
import { Node } from "../scene/node";
import { Button } from "./button";
import { Label } from "./label";

export class TreeLayout extends Node {
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
        branch.add(new TreeLayout("" + key, value, childPrefix));
      } else if (typeof value === "function") {
        branch.add(new Button(childPrefix + "ƒ " + key));
      } else {
        branch.add(new Button(childPrefix + "≡ " + key + ": " + value));
      }
    }

    const label = new Label(prefix + "> " + key);

    const button = new Button()
      .setOnClick((ctx) => {
        if ((state = !state)) {
          branch.clear();

          if (value instanceof Set) {
            let key = 0;
            for (const node of value) {
              addNode(key, node);
              key++;
            }
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
        label.textPrimitive?.setText(colorCodes.gray + label.string);
      })
      .setOnHoverEnd(() => {
        label.textPrimitive?.setText(label.string);
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
