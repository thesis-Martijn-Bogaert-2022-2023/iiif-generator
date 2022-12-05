import { Bindings } from "@rdfjs/types";

export class Canvas {
  private id: string;
  private height: number;
  private width: number;
  private image: string;

  constructor(id: string, height: number, width: number, image: string) {
    this.id = id;
    this.height = height;
    this.width = width;
    this.image = image;
  }

  toString() {
    console.log(`
        Canvas: {
            id: ${this.id}
            height: ${this.height}
            width: ${this.width}
            image: ${this.image}
        }
    `);
  }

  static getCanvasFromBindings(canvasBindings: Bindings) {
    return new Canvas(
      canvasBindings.get("canvas").value,
      parseInt(canvasBindings.get("height").value),
      parseInt(canvasBindings.get("width").value),
      canvasBindings.get("label").value
    );
  }
}
