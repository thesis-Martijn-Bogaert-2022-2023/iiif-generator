const { QueryEngine } = require('@comunica/query-sparql');

async function test() {
  const myEngine = new QueryEngine();
  const bindingsStream = await myEngine.queryBindings(
    `SELECT ?s ?p ?o WHERE {
      ?s ?p <http://dbpedia.org/resource/Belgium>.
      ?s ?p ?o
    } LIMIT 100`,
    {
      sources: [
        'http://fragments.dbpedia.org/2016-04/en'
      ]
    }
  );

  bindingsStream.on('data', (binding) => {
    console.log(binding.toString()); // Quick way to print bindings for testing

    console.log(binding.has('s')); // Will be true

    // Obtaining values
    console.log(binding.get('s').value);
    console.log(binding.get('s').termType);
    console.log(binding.get('p').value);
    console.log(binding.get('o').value);
  });

  bindingsStream.on('end', () => {
    // The data-listener will not be called anymore once we get here.
    console.log('Done');
  });

  bindingsStream.on('error', (error) => {
    console.error(error);
  });
}

test();