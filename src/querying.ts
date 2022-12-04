import { QueryEngine } from "@comunica/query-sparql";
import { EventEmitter } from "stream";

/**
 * Handles Comunica QueryEngine for retrieving IIIF Manifest URLs from the Stad Gent SparQL endpoint.
 */
export class ManifestQueryEngine {
  private engine = new QueryEngine();
  private getQuery(limit: number, offset: number): string {
    return `
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
  }

  /**
   * Retrieve IIIF Manifests URLs from the Stad Gent SparQL endpoint.
   * @param limit Specifies the number of IIIF Manifest URLs to retrieve.
   * @param offset Specifies the number of IIIF Manifest URLs to skip.
   * @returns a Promise for an EventEmitter that emits RDF-JS Bindings. Each Binding holds the URL to a IIIF Manifest.
   */
  async getManifestURLs(limit = 10, offset = 0): Promise<EventEmitter> {
    return await this.engine.queryBindings(this.getQuery(limit, offset), {
      sources: ["https://stad.gent/sparql"],
    });
  }
}

/**
 * Handles Comunica QueryEngine for retrieving information from a given IIIF Manifest.
 * The engine assumes each manifest to describe only one canvas.
 */
export class CanvasQueryEngine {
  private engine = new QueryEngine();
  private getQuery(): string {
    return `
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
      LIMIT 1
    `;
  }

  /**
   * Retrieve Canvas data from the given IIIF Manifest.
   * @param manifestURL Specifies the URL the the IIIF Manifest to query.
   * @returns a Promise for an EventEmitter that emits RDF-JS Bindings. Each Binding holds the data of one canvas found in the given IIIF Manifest.
   */
  async getManifestCanvas(manifestURL: string): Promise<EventEmitter> {
    return await this.engine.queryBindings(this.getQuery(), {
      sources: [manifestURL],
    });
  }
}
