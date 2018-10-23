# API Reference

## &lt;ClassList>

`ClassList` returns list of classes with properties

```jsx
<ClassList src={classIris, propertyIris, store}>
  <SomeComponent />
</ClassList>
```

## &lt;ConceptList>

`ConceptList` returns list of concepts 

```jsx
<ConceptList src={store}>
  <SomeComponent />
</ConceptList>
```

## &lt;GraphContext>

`GraphContext` is a wrapper for all graph-based components.

```jsx
<GraphContext src={iri}>
  <SomeComponent />
</GraphContext>
```

## &lt;ListIndex>

`ListIndex` return index of classes

```jsx
<ListIndex src={resourceIris}>
  <SomeComponent />
</ListIndex>
```

## &lt;LoadingIndicator>

`LoadingIndicator` Loads data (?)

```jsx
<LoadingIndicator>
  <SomeComponent />
</LoadingIndicator>
```

## &lt;PropertyList>

`PropertyList` returns list of properties

```jsx
<PropertyList src={classIris, propertyIris, store}>
  <SomeComponent />
</PropertyList>
```

## &lt;Resource>

`Resource` Returns a resource (?)

```jsx
<Resource src={ResourceIris, store}>
  <SomeComponent />
</Resource>
```

## &lt;Vocabulary>

A resource representation, which visualizes the vocabulary (classes & properties). Component must be wrapped within a `GraphContext`.

```jsx
<Vocabulary ontology={iri} />
```




