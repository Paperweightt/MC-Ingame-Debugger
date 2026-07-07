import { VerticalLayout } from "../layout/verticalLayout";
import { Node } from "../scene/node";
import { Button } from "./button";

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

    const button = new Button(prefix + "> " + key).setOnClick((ctx) => {
      if ((state = !state)) {
        branch.clear();

        if (value instanceof Set) {
          let key = 0;
          for (const node of value) {
            addNode(key, node);
            key++;
          }
        }
        if (value instanceof Map) {
          for (const [key, node] of value) {
            addNode(key, node);
          }
        } else {
          for (const [key, node] of Object.entries(value)) {
            addNode(key, node);
          }
        }

        this.layout.add(branch);
      } else {
        this.layout.remove(branch);
      }
      ctx.frame();
    });

    this.layout.add(button);
  }

  measure(): void {
    super.measure();

    this.height = this.layout.height;
    this.width = this.layout.width;
  }
}
