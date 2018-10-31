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
The IRI's of the Classes which are represented.
### `propertyIris`: `Term[]`
The IRI's of the Properties which are represented.
### `store`: `Store`
The data source.

## &lt;ConceptList>
`ConceptList` creates list of Concepts.
```jsx
  <ConceptList store={store} />
```
### `store`: `Store`
The data source.

## &lt;GraphContext>
`GraphContext` is a wrapper for all graph-based components.
```jsx
  <GraphContext src={src}>
    {store => (
      <React.Component store={store}/>
    )}
  </GraphContext>
```
### `src`: `String`
The endpoint used by the backend to retrieve the data.

## &lt;TupleContext>
`TupleContext` is a wrapper for all SPARQL Query Result using components.
```jsx
  <TupleContext src={src}>
    {data => (
      <React.Component data={data} />
    )}
  </TupleContext>
```
### `src`: `String`
The endpoint used by the backend to retrieve the SPARQL response.


## &lt;PropertyList>
`PropertyList` creates a list of properties.
```jsx
  <PropertyList 
    classIris={classIris} 
    propertyIris={propertyIris} 
    store={store}>  
  </PropertyList>
```
### `classIris`: `Term[]`
The IRI's of the Classes which are represented.
### `propertyIris`: `Term[]`
The IRI's of the Properties which are represented.
### `store`: `Store`
The data source.

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
  <Vocabulary store={store} ontology={ontologyIRI} />
```
### `store`: `Store`
The data source.
### `ontologyIRI`: `NamedNode`
The IRI of the ontology, used as a filter based on the `isDefinedBy` statements.

```jsx harmony
<ClassTree
  store={store}
  classIris={classIris}
/>
```

### `store`: `Store`
The data source.

### `classIris`: `Term[]`
The IRI's of the Classes which are represented.

## &lt;PropertyTree>

`PropertyTree` is a Tree view representation of the Properties and its children.

```jsx harmony
<PropertyTree
  store={store}
  propertyIris={propertyIris}
/>
```

### `store`: `Store`
The data source.

### `propertyIris`: `Term[]`
The IRI's of the Properties which are represented.
