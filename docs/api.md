# API Reference

## &lt;ClassList>
`ClassList` creates list of classes with its properties
```jsx
<ClassList
  classIris={classIris}
  propertyIris={propertyIris}
  store={store}
/>
```
### `classIris`: `Term[]`
### `propertyIris`: `Term[]`
### `store`: `Store`

## &lt;ConceptList>
`ConceptList` creates list of Concepts. Component must be wrapped in a `GraphContext`.
```jsx
<ConceptList store={store} />
```
### `store`: `Store`
The data source.

## &lt;GraphContext>
`GraphContext` is a wrapper for all graph-based components.
```jsx
<GraphContext src={endpoint}>
  <SomeComponent />
</GraphContext>
```
### `endpoint`: `Iri`

## &lt;ListIndex>
`ListIndex` creates index of classes
```jsx
<ListIndex resourceIris={propertyIris}> 
</ListIndex>
```
### `propertyIris`: `Term[]`
### `classIris`: `Term[]`

## &lt;LoadingIndicator>
`LoadingIndicator` Indicates data is being loaded
```jsx
<LoadingIndicator> 
</LoadingIndicator>
```

## &lt;PropertyList>
`PropertyList` creates a list of properties
```jsx
<PropertyList classIris={classIris}
              propertyIris={propertyIris}  
              store={store}>  
</PropertyList>
```
### `classIris`: `Term[]`
### `propertyIris`: `Term[]`
### `store`: `Store`

## &lt;Resource>
`Resource` Creates the default Resource detail view, which provides a simple list of properties.
```jsx
<Resource
  resourceIri={resourceIri}  
  store={store}
/>
```
### `resourceIri`: `Term`
The IRI of the Resource which is represented.
### `store`: `Store`
The data source.

## &lt;Vocabulary>
A resource representation, which visualizes the vocabulary (classes & properties). Component must be wrapped within a `GraphContext`.
```jsx
<Vocabulary store={store} 
            ontology={ontologyIRI} />
```
### `store`: `Store`
### `ontologyIRI`: `namedNode`




