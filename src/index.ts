import { Bindings } from "@rdfjs/types";
import { Canvas } from "./iiif-types.js";
import { ManifestBuilder } from "./manifest-builder.js";
import { CanvasQueryEngine, ManifestQueryEngine } from "./querying.js";
import { writeFileSync } from "fs";

// Create query engines
const manifestQueryEngine = new ManifestQueryEngine();
const canvasQueryEngine = new CanvasQueryEngine();

// Create Manifest Builder
const manifestBuilder = new ManifestBuilder();
const AMOUNT_OF_CANVASSES = 10;
let counter = 0;

// Create manifest stream
const manifestStream = await manifestQueryEngine.getManifestURLs(
  AMOUNT_OF_CANVASSES
);

// Handle new manifest
manifestStream.on("data", async (manifest: Bindings) => {
  // Create canvas stream
  const url = manifest.get("manifest").value;
  const canvasStream = await canvasQueryEngine.getManifestCanvas(url);

  // Handle new canvas
  canvasStream.on("data", (canvas: Bindings) => {
    const newCanvas = Canvas.fromBindings(canvas);
    console.log(counter + 1, newCanvas.toString());
    manifestBuilder.addCanvas(newCanvas);
    counter++;

    if (counter >= AMOUNT_OF_CANVASSES) {
      writeFileSync("./manifest.json", manifestBuilder.getManifest());
    }
  });

  // Handle unsuccessful canvas stream ending
  canvasStream.on("error", (error: string) => {
    console.error("ERR canvas stream", error);
  });
});

// Handle unsuccessful manifest stream ending
manifestStream.on("error", (error: string) => {
  console.error("ERR manifest stream", error);
});
