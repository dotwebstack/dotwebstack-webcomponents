import load from './load';

afterEach(() => {
  document.head.innerHTML = '';
});

it('Returns quads from embedded script block.', async () => {
  document.head.innerHTML = `
    <script id="data" type="application/ld+json">
      {
        "@context": {
          "owl": "http://www.w3.org/2002/07/owl#",
          "rdfs": "http://www.w3.org/2000/01/rdf-schema#"
        },
        "@id": "http://bag.basisregistraties.overheid.nl/def/bag",
        "@type": "owl:Ontology",
        "rdfs:label": "Basisregistraties adressen en gebouwen vocabulaire"
      }
    </script>
  `;

  const store = await load('#data');
  expect(store).toHaveProperty('size', 2);
});

it('Throws error when script block is not found.', async () => {
  expect.assertions(1);

  try {
    await load('#data');
  } catch (e) {
    expect(e.message).toMatch('Element not found.');
  }
});
