# API Reference

## &lt;GraphContext>

`GraphContext` is a wrapper for alle graph-based components.

```jsx
<GraphContext src={{
  url: 'http://example.org/foo',
  graph: 'http://example.org/bar',
}}>
  <SomeComponent />
</GraphContext>
```

### `src`: `object[]`

One or more source URLs, where the RDF data will be retrieved from.

## &lt;Resource>

The default resource representation, which provides a simple list of properties. Component must be wrapped within a `GraphContext`.

```jsx
<Resource iri="http://example.org/foo" />
```

### `iri`: `string`

The IRI of the resource to be represented.

### `graph`: `string` (optional)

Default: empty (default graph)

The named graph wherein the resource resides.

## &lt;Vocabulary>

A resource representation, which visualizes the vocabulary (concepts & definitions). Component must be wrapped within a `GraphContext`.

```jsx
<Vocabulary />
```

## &lt;ResourceList>

A list of resources. Component must be wrapped within a `TupleContext`.

```jsx
<Model />
```
