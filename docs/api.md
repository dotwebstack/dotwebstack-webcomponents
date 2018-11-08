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

## &lt;Vocabulary>
A resource representation, which visualizes the vocabulary (classes & properties). Component must be wrapped within a `GraphContext`.
```jsx
  <Vocabulary store={store} ontology={ontologyIRI} />
```
### `store`: `Store`
The data source.
### `ontologyIRI`: `NamedNode`
The IRI of the ontology, used as a filter based on the `isDefinedBy` statements.

## &lt;ClassTree>
```jsx
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
```jsx
<PropertyTree
  store={store}
  propertyIris={propertyIris}
/>
```
### `store`: `Store`
The data source.
### `propertyIris`: `Term[]`
The IRI's of the Properties which are represented.

## &lt;TupleContext>
`TupleContext` is a wrapper for all SPARQL Query Result using components.
```jsx
  <TupleContext src={src}>
    {data => (
      <React.Component data={data} />
    )}
  />
```
### `src`: `String`
The endpoint used by the backend to retrieve the SPARQL response.

## &lt;TupleList>

`TupleList` is a table view representation of the SPARQL Query Result.

```jsx
<TupleList
  result={result}
  columns={columns}
  pageSize={10}
/>
```

### `result`: `TupleResult`
The data source.

### `columns`: `Column[]`
Custom settings on how to represent a column. 

### `pageSize`: `number`
The number of items which are shown in the table view.

```jsx
type Column {
  name: string; 
  label?: string; 
  sortable?: boolean; 
  customRender?: (term: Term) => JSX.Element; 
}
```
### `name`: `string`
The binding name

### `label`: `string`
A readable representation of the column header

### `sortable`: `string`
Is a column sortable or not

### `customRender`: `(term: Term) => JSX.Element`
A way to add custom rendering to a column element
## &lt;Resource>

`Resource` a detailed view of one ResourceIri. It provides a simple list of properties.

```jsx 
<Resource 
  store={store} 
  resourceIri={resourceIri} 
  rows={rows}
/>
```

### `store`: `Store`
The data source.

### `resourceIri`: `Term`
The IRI of the `Resource` to be represented.

### `rows`: `Row[]`
Custom settings on how to represent the `Resource` view

```jsx 
type Row {
  predicate: NamedNode;
  label?: string;
  render?: (terms: Term[]) => JSX.Element;
}
```
### `predicate`: `NamedNode`
The predicate of the row being represented

### `label`: `string`
A readable representation of the predicate

### `customRender?`: `(terms: Term[]) => JSX.Element`
A way to add custom rendering to a row element
## &lt;TermValue>
`TermValue` shows the Term; an extracted localname - from the resourceIri - when it's local or the actual value when it's not. 
```jsx
<TermValue 
  term={term}
  local={local}
/>
```
### `term`: `Term`
The IRI of the Resource which is represented.
### `local`: `boolean` (optional)
Whether the term links to a local- or remote definition. When no `local` is provided, it defaults as false.

## &lt;Label>
`Label` shows the correct label of the resourceIri. In order of preference when present: SKOS:prefLabel, RDFS:label or localName (extracted from full resourceIri name).
```jsx
<Label
  resourceIri={Term}
  store={Store}
/>
```
### `resourceIri`: `Term`
The IRI of the Resource which is represented.
### `store`: `Store`
The data source.
    