import { VerticalLayout } from "../layout/verticalLayout";
import { Node } from "../scene/node";
import { Button } from "./button";

export class TreeLayout extends Node {
  layout = new VerticalLayout();

  constructor(
    public key: string,
    public value: Object
  ) {
    super();
    this.add(this.layout);

    const branch = new VerticalLayout();
    let state = false;

    const button = new Button(key).setOnClick((ctx) => {
      if (!state) {
        for (const [key, node] of Object.entries(value)) {
          branch.add(new TreeLayout(key, node));
        }

        this.layout.add(branch);
      } else {
        branch.clear();
        this.layout.remove(branch);
      }

      ctx.frame();

      state = !state;
    });

    this.layout.add(button);
    this.layout.add(branch);
  }

  measure(): void {
    super.measure();

    this.height = this.layout.height;
    this.width = this.layout.width;
  }
}
