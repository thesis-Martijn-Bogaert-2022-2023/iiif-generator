import { Bindings } from "@rdfjs/types";
import { EventEmitter } from "events";
import { CanvasQueryEngine, ManifestQueryEngine } from "./querying.js";

async function workflow() {
  const exception = "exception";
  const success = "success";
  const newManifest = "new-manifest";

  // Workflow setup
  const workflow = new EventEmitter();
  workflow.on(exception, (error: string) => {
    console.error(error);
  });
  workflow.on(success, (response: string) => {
    console.log(response);
  });
  workflow.on(newManifest, async (url: string) => {
    // Get manifest canvasses
    const canvasQueryEngine = new CanvasQueryEngine();
    const canvasStream = await canvasQueryEngine.getManifestCanvas(url);
    canvasStream.on("data", (canvas: Bindings) => {
      workflow.emit(success, "NEW canvas: " + canvas.toString());
    });
    canvasStream.on("end", () => {
      workflow.emit(success, "Canvas stream DONE");
    });
    canvasStream.on("error", (error: string) => {
      workflow.emit(exception, "Canvas stream ERROR" + error);
    });
  });

  // Get manifest URLs
  const manifestQueryEngine = new ManifestQueryEngine();
  const manifestStream = await manifestQueryEngine.getManifestURLs();
  manifestStream.on("data", (manifest: Bindings) => {
    const url = manifest.get("manifest").value;
    console.log("NEW manifest:", url);
    workflow.emit(newManifest, url);
  });
  manifestStream.on("end", () => {
    workflow.emit(success, "Manifest stream DONE");
  });
  manifestStream.on("error", (error: string) => {
    workflow.emit(exception, "Manifest stream ERROR" + error);
  });
}

workflow();
