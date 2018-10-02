# API Reference

## &lt;GraphContext>

`GraphContext` is a wrapper for alle graph-based components.

```jsx
<GraphContext src={iri}>
  <SomeComponent />
</GraphContext>
```

### `src`: `NamedNode | NamedNode[]`

One or more resource IRIs, which will be dereferenced to retrieve the RDF data (media type: `application/ld+json`).

## &lt;Vocabulary>

A resource representation, which visualizes the vocabulary (classes & properties). Component must be wrapped within a `GraphContext`.

```jsx
<Vocabulary ontology={iri} />
```

### `ontology`: `NamedNode`

The IRI of the OWL ontology resource.
