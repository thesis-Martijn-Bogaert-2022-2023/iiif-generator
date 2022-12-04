import { QueryEngine } from "@comunica/query-sparql";

export class ManifestQueryEngine {
  private engine = new QueryEngine();
  private getQuery(limit: number, offset: number) {
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

  async getManifestURLs(limit = 10, offset = 0) {
    return await this.engine.queryBindings(this.getQuery(limit, offset), {
      sources: ["https://stad.gent/sparql"],
    });
  }
}

export class CanvasQueryEngine {
  private engine = new QueryEngine();
  private getQuery() {
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

  async getManifestCanvas(manifestURL: string) {
    return await this.engine.queryBindings(this.getQuery(), {
      sources: [manifestURL],
    });
  }
}
