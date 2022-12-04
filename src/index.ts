import { Bindings } from "@rdfjs/types";
import { CanvasQueryEngine, ManifestQueryEngine } from "./querying.js";

// Get manifest URLs
const manifestQueryEngine = new ManifestQueryEngine();
const canvasQueryEngine = new CanvasQueryEngine();

const manifestStream = await manifestQueryEngine.getManifestURLs();

let counter = 1;

manifestStream.on("data", async (manifest: Bindings) => {
  const url = manifest.get("manifest").value;
  console.log("NEW manifest:", url);

  const canvasStream = await canvasQueryEngine.getManifestCanvas(url);

  canvasStream.on("data", (canvas: Bindings) => {
    console.log(counter++, ")", "NEW canvas:", canvas.toString());
  });

  canvasStream.on("end", () => {
    console.log("END canvas stream");
  });

  canvasStream.on("error", (error: string) => {
    console.error("ERR canvas stream", error);
  });
});

manifestStream.on("end", () => {
  console.log("END manifest stream");
});

manifestStream.on("error", (error: string) => {
  console.error("ERR manifest stream", error);
});
