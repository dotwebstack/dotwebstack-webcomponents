# API Reference

## &lt;ClassList>

`ClassList` creates list of classes with its properties.

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

`GraphContext` is a wrapper for all graph-based components, using Json-LD.

```jsx
<GraphContext src={src}>
  {store => (
    <React.Component store={store}/>
  )}
</GraphContext>
```

### `src`: `String`
The endpoint used by the backend to retrieve the data.

## &lt;GraphSearch>

`GraphSearch` lets the user send a search query which generate Json-LD responses.

```jsx
<GraphSearch endpoint={endpoint} queryParam="term" query="concept">
  {store => (
    <React.Component store={store}/>
  )}
</GraphSearch>
```

### `endpoint`: `String`
The endpoint used by the backend to retrieve the data. Default is "q".

### `queryParam`?: `String`
Optional query parameter used to create the definite URL.

### `query`?: `String`
Optional predefined search field value, for making the first search automatically render a result.

## &lt;PropertyList>

`PropertyList` creates a list of properties.

```jsx
<PropertyList
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

## &lt;Vocabulary>

A resource representation, which visualizes the vocabulary (classes & properties). Component must be wrapped within a `GraphContext`.

```jsx
<Vocabulary
  store={store}
/>
```

### `store`: `Store`
The data source.

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

## &lt;TupleSearch>

`TupleSearch` lets the user send a search query for CONSTRUCT queries.

```jsx
<TupleSearch endpoint={src} queryParam={'term'} query={'concept'}>
  {result => (
    <React.Component result={result}/>
  )}
</TupleSearch>
```

### `endpoint`: `String`
The endpoint used by the backend to retrieve the data.

### `queryParam`?: `String`
Optional query parameter used to create the definite URL.

### `suggest`?: SuggestProps (optional)
Optional parameter to define suggest options. The provided endpoint should return a JSON list in the following format
```json
{
    _embedded: {
      suggesties: [
          "AlgemeenZorg_Thema",
          "WoonfunctieVoorZorg",
          "ZeerZorgwekkendeStof",
          "Zorgclusterwoning",
          "ZorgOpAfroep",
          "ZorgOpAfspraak",
          "Zorgplicht",
      ]
    }
}
```
The query param used for the suggestions is by default 'zoekTerm' and can be configured by searchParam
Suggestions are initiated after 500 ms, this gives the user some time to type. This delay can be configured by the delay property

### `defaultValue`?: `String`
Optional predefined search field value, for making the first search automatically render a result.

## &lt;TupleList>

`TupleList` is a table view representation of the SPARQL Query Result.

```jsx
<TupleList
  result={result}
  columns={columns}
  pagination={true}
  valueProps={{
    linkBuilder: term => term.value,
    local: true,
  }}
/>
```

### `result`: `TupleResult`
The data source.

### `columns`: `Column[]`
Custom settings on how to represent a column.

### `pagination`: `Pagination` (optional)
Settings for enabling and configuration of the paginator (`true` applies default configuration).

### `valueProps`: `ValueProps` (optional)
Optional object with properties, which will be passed to every instance of the `Value` component.

### `sortByColumn`: `[string, boolean]` (optional)
The column on which the list will be sorted initially. The value is an array with exactly 2 elements (tuple).
First element is the column name, second element is a boolean whether the column is sorted in ascending order or not.

### `suggest`: SuggestProps (optional)
This property is used in combination with the search property. When the search property is provided a user gets a search
input in order to filter the TupleList result. Use the *suggestions* [TupleResult, string] property of the SuggestProps to provide suggestions
based on the result and the provided column name (should be a field which is also used in search to provide consistency)
When using suggestions it is best practice to use the same field (and only that field) in the search prop.

### `search`: SearchListProps
The list will be sorted while typing when instant search is true (use when no suggestions are enabled, 
set to false when suggestions are provided)
Search will use all names in the TupleResult by default, or a custom list if provided.

When using bootstrap, use the following css to provide a cancel option in the input
```css
input[type=search]::-webkit-search-cancel-button {
      -webkit-appearance: searchfield-cancel-button;
    }
```


```jsx
type Column = {
  name: string;
  label?: string;
  sortable?: boolean;
  customRender?: (term: Term) => JSX.Element;
};
```

### `name`: `string`
The binding name

### `label`: `string` (optional)
A readable representation of the column header. It defaults to the column name.

### `sortable`: `boolean` (optional)
A boolean indicating whether this column can be sorted. It defaults to `false`.

### `customRender`: `(term: Term) => JSX.Element` (optional)
A way to add custom rendering to a column element

```jsx
type Pagination = boolean | {
  pageSize?: number;
};
```

### `pageSize`: `number`
The number of items which are shown in the table view.

## &lt;Resource>

`Resource` a detailed view of one ResourceIri. It provides a simple list of properties.

```jsx
<Resource
  store={store}
  resourceIri={resourceIri}
  rows={rows}
  valueProps={{
    linkBuilder: term => term.value,
  }}
/>
```

### `store`: `Store`
The data source.

### `resourceIri`: `Term`
The IRI of the `Resource` to be represented.

### `rows`: `Row[]`
Custom settings on how to represent the `Resource` view

### `valueProps`: `ValueProps` (optional)
Optional object with properties, which will be passed to every instance of the `Value` component (except `term` property).

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



## &lt;ResourceSelector>

`ResourceSelector` is a simple set of links allowing navigation to related resources.
The related resources are retrieved from an endpoint.

The URL used to retrieve related resources is composed using the values of the
`endpoint`, `resourceParam` and `resource` props in the following manner:
`${endpoint}?${resourceParam}=${resource}`.

Retrieval is accomplished by a nested `TupleContext` component.
See its documentation for a description of the expected JSON format.

```jsx
<ResourceSelector
  endpoint={endpoint}
  resourceParam={resourceParam}
  resource={resource}
  resourceColumn={resourceColumn}
  displayColumn={displayColumn}
  transformBindingSets={transform}
  createLinkHref={createLinkHref}
  linkClassName={linkClassName}
  linkSelectedClassName{linkSelectedClassName}
/>
```

### `endpoint`: `string`
The URL of the endpoint to fetch related resources from.

### `resourceParam`: `string`
The query string parameter that is used to pass the resource IRI to the endpoint.

### `resource`: `string`
The IRI of the resource that is represented. It is passed to the endpoint to
retrieve related resources.

### `resourceColumn`: `string`
The column in the result set that contains the IRI's of the retrieved resources.

### `displayColumn`: `string`
The column in the result set that contains the values used as labels (text) for
the links.

### `transformBindingSets`: `(bindingSets: BindingSet[]) => BindingSet[]` (optional)
If specified, this function is called with the result set as an argument,
allowing it to apply a transformation to the result set before rendering.
This can be used to filter or sort retrieved entries, for example.

### `createLinkHref`: `(resource: string) => string`
Function used to create the href (URL) for a link corresponding to the specified
resource. This function is called for each resource retrieved from the endpoint
in order to render a corresponding link.

### `linkClassName`: `string` (optional)
Class name(s) to use for rendered links.
If not specified, the default value `btn btn-info` is used.

### `linkSelectedClassName`: `string` (optional)
Class name(s) to use for the link that corresponds to `resource`.
If not specified, the default value `btn btn-success` is used.

## &lt;Value>

`Value` renders the value of the Term. `NamedNode` terms will be rendered as a link.

```jsx
<Value
  term={term}
  local={local}
  linkBuilder={term => term.value}
/>
```

### `term`: `Term`
The IRI of the Resource which is represented.

### `local`: `boolean` (optional)
Whether the link text contains the local name or the full IRI. When no `local` is provided, it defaults to false.

### `linkBuilder`: `(term: Term) => string` (optional)
A callback function to be able to customize the `href` attribute of the link (only relevant for `NamedNode` terms).

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
