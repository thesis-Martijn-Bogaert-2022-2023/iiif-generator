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
      FROM <http://stad.gent/ldes/archief>
      WHERE { 
        # Object
        ?object a cidoc:E22_Man-Made_Object.
        # Manifest
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
      PREFIX pres: <http://iiif.io/api/presentation/2#>
      PREFIX oa: <http://www.w3.org/ns/oa#>
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX terms: <http://purl.org/dc/terms/>
      PREFIX dcmitype: <http://purl.org/dc/dcmitype/>
      PREFIX elem: <http://purl.org/dc/elements/1.1/>
      PREFIX exif: <http://www.w3.org/2003/12/exif/ns#>
      PREFIX siocserv: <http://rdfs.org/sioc/services#>
      PREFIX doap: <http://usefulinc.com/ns/doap#>

      SELECT  *
      WHERE {
          # Canvas
          ?canvas a iiif:Canvas.
          ?canvas rdfs:label ?canvas_label.
          ?canvas ns:height ?canvas_height.
          ?canvas ns:width ?canvas_width.
          ?canvas pres:hasImageAnnotations/rdf:first ?image.
        
          # Image
          ?image a oa:Annotation.
          ?image iiif:attributionLabel ?image_attribution.
          ?image terms:rights ?image_license.
          ?image oa:motivatedBy ?image_motivation.
          ?image oa:hasTarget ?image_on.
          ?image oa:hasBody ?resource.
        
          # Resource
          ?resource a dcmitype:Image.
          ?resource elem:format ?resource_format.
          ?resource exif:height ?resource_height.
          ?resource exif:width ?resource_width.
          ?resource siocserv:has_service ?service.
        
          # Service
          ?service doap:implements ?service_profile.
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
