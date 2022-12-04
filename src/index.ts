import { Bindings } from "@rdfjs/types";
import { QueryEngine } from "@comunica/query-sparql";
import { EventEmitter } from "events";

async function getManifestURLs(limit = 10, offset = 0) {
  const comunicaEngine = new QueryEngine();

  const query = `
    PREFIX cidoc: <http://www.cidoc-crm.org/cidoc-crm/>
    SELECT ?manifest
    FROM <http://stad.gent/ldes/hva>
    WHERE { 
      # object
      ?object a cidoc:E22_Man-Made_Object.
      # manifest
      OPTIONAL { ?o cidoc:P129i_is_subject_of ?manifest. }
    }
    LIMIT ${limit}
    OFFSET ${offset}
  `;

  return await comunicaEngine.queryBindings(query, {
    sources: ["https://stad.gent/sparql"],
  });
}

async function getManifestCanvasses(
  manifestURL: string,
  limit = 10,
  offset = 0
) {
  const comunicaEngine = new QueryEngine();
  const query = `
    PREFIX iiif: <http://iiif.io/api/presentation/2#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX ns: <http://www.w3.org/2003/12/exif/ns#>
    SELECT  *
    WHERE {
      ?canvas a iiif:Canvas.
      ?canvas rdfs:label ?label.
      ?canvas ns:height ?height.
      ?canvas ns:width ?width.
    }
    LIMIT ${limit}
    OFFSET ${offset}
  `;

  return await comunicaEngine.queryBindings(query, { sources: [manifestURL] });
}

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
    const canvasStream = await getManifestCanvasses(url, 1);
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
  const manifestStream = await getManifestURLs();
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
