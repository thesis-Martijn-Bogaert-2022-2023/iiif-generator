import { Canvas } from "./iiif-types.js";

export class ManifestBuilder {
  // Properties
  private canvasses: Canvas[] = [];

  // Private methods
  private getCanvasObjects(): string[] {
    return this.canvasses.map((canvas) => {
      return `
        {
          "@id": "${canvas.id}",
          "@type": "sc:Canvas",
          "label": "${canvas.label}",
          "height": ${canvas.height},
          "width": ${canvas.width},
          "images": [
            {
              "@type": "oa:Annotation",
              "attribution": "${canvas.image.attribution}",
              "license": "${canvas.image.license}",
              "motivation": "${canvas.image.motivation}",
              "resource": {
                "@id": "${canvas.image.resource.id}",
                "@type": "dctypes:Image",
                "format": "${canvas.image.resource.format}",
                "height": ${canvas.image.resource.height},
                "width": ${canvas.image.resource.width},
                "service": {
                  "@context": "https:///iiif.io/api/image/2/context.json",
                  "@id": "${canvas.image.resource.service.id}",
                  "profile": "${canvas.image.resource.service.profile}"
                }
              },
              "on": "${canvas.image.on}"
            }
          ]
        }
      `;
    });
  }

  // Public methods
  addCanvas(canvas: Canvas) {
    this.canvasses.push(canvas);
  }

  getAmountOfCanvasses() {
    return this.canvasses.length;
  }

  getManifest(): string {
    return `
{
  "@context": "http://iiif.io/api/presentation/2/context.json",
  "@type": "sc:Manifest",
  "@id": "http://localhost:3000/manifest.json",
  "label": "Custom collection",
  "description": "Collection composed of Collections of Ghent data",
  "attribution": "Collections of Ghent",
  "sequences": [
    {
      "@type": "sc:Sequence",
      "canvases": [${this.getCanvasObjects().join(",\n")}]
    }
  ]
}
    `;
  }
}
