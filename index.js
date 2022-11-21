const { QueryEngine } = require('@comunica/query-sparql');

const query = `
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX la: <https://linked.art/ns/terms/>
PREFIX adms: <http://www.w3.org/ns/adms#>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX cidoc: <http://www.cidoc-crm.org/cidoc-crm/>

SELECT ?o ?title ?note ?image ?objectname ?associatie ?objectnumber ?creator ?timespan
WHERE {
  # object
  ?o a cidoc:E22_Man-Made_Object.
  
  # title
  #OPTIONAL { ?o cidoc:P102_has_title ?title. }
  ?o cidoc:P102_has_title ?title.
  
  # note
  OPTIONAL { ?o cidoc:P3_has_note ?note. }
  
  # IIIF manifest
  OPTIONAL { ?o cidoc:P129i_is_subject_of ?image. }
  
  # object name
  OPTIONAL { ?o cidoc:P41i_was_classified_by ?classified. }
  OPTIONAL { ?classified cidoc:P42_assigned ?assigned. }
  OPTIONAL { ?assigned skos:prefLabel ?objectname. }
  
  # association
  OPTIONAL { ?o cidoc:P128_carries ?carries. }
  OPTIONAL { ?carries cidoc:P129_is_about ?about. }
  OPTIONAL { ?about cidoc:P2_has_type ?type. }
  OPTIONAL { ?type skos:prefLabel ?associatie. }
  
  # object number
  OPTIONAL { ?o adms:identifier ?identifier. }
  OPTIONAL { ?identifier skos:notation ?objectnumber. }
  
  # creator
  OPTIONAL { ?o cidoc:P108i_was_produced_by ?production. }
  OPTIONAL { ?production cidoc:P14_carried_out_by ?producer. }
  OPTIONAL { ?producer la:equivalent ?equivalent. }
  OPTIONAL { ?equivalent rdfs:label ?creator. }
  
  # timespan
  OPTIONAL { ?o cidoc:P108i_was_produced_by ?produced. }
  OPTIONAL { ?produced cidoc:P4_has_time-span ?timespan. }
}
LIMIT 100
`;

async function test() {
  const myEngine = new QueryEngine();
  const bindingsStream = await myEngine.queryBindings(query,
    {
      sources: [
        'https://stad.gent/sparql',
        //'https://lodi.ilabt.imec.be/sparql/gent',
      ]
    }
  );

  bindingsStream.on('data', (binding) => {
    console.log(binding.toString());
    console.log('-------------');
  });

  bindingsStream.on('end', () => {
    console.log('Done');
  });

  bindingsStream.on('error', (error) => {
    console.error(error);
  });
}

test();