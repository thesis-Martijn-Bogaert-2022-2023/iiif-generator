import { Bindings } from "@rdfjs/types";
import { Canvas } from "./iiif-types.js";
import { CanvasQueryEngine, ManifestQueryEngine } from "./querying.js";

// Create query engines
const manifestQueryEngine = new ManifestQueryEngine();
const canvasQueryEngine = new CanvasQueryEngine();

let counter = 1;

// Create manifest stream
const manifestStream = await manifestQueryEngine.getManifestURLs();

// Handle new manifest
manifestStream.on("data", async (manifest: Bindings) => {
  const url = manifest.get("manifest").value;
  //console.log("NEW manifest:", url);

  // Create canvas stream
  const canvasStream = await canvasQueryEngine.getManifestCanvas(url);

  // Handle new canvas
  canvasStream.on("data", (canvas: Bindings) => {
    console.log(counter++, Canvas.fromBindings(canvas).toString());
  });

  // Handle successful canvas stream ending
  canvasStream.on("end", () => {
    //console.log("END canvas stream");
  });

  // Handle unsuccessful canvas stream ending
  canvasStream.on("error", (error: string) => {
    console.error("ERR canvas stream", error);
  });
});

// Handle successful manifest stream ending
manifestStream.on("end", () => {
  //console.log("END manifest stream");
});

// Handle unsuccessful manifest stream ending
manifestStream.on("error", (error: string) => {
  console.error("ERR manifest stream", error);
});
