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

## &lt;TupleContext>

`TupleContext` is a wrapper for alle tuple-based components.

```jsx
<TupleContext src={url}>
  <SomeComponent />
</TupleContext>
```

### `src`: `string`

A single url, which will return a tuple result (media type: `application/sparql-results+json`).

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

## &lt;TupleList>

A list of tuples. Component must be wrapped within a `TupleContext`.

```jsx
<TupleList />
```
