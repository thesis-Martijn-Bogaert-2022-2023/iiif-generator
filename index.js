const { QueryEngine } = require('@comunica/query-sparql');

async function test() {
  const myEngine = new QueryEngine();
  const bindingsStream = await myEngine.queryBindings(
    `
    PREFIX cidoc: <http://www.cidoc-crm.org/cidoc-crm/>

    SELECT ?object ?title
    FROM <http://stad.gent/ldes/dmg>
    WHERE {
      ?object cidoc:P102_has_title ?title.
    }
    LIMIT 10
    `,
    {
      sources: [
        'https://lodi.ilabt.imec.be/sparql/gent'
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