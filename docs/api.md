# API Reference

## &lt;ConciseBoundedDescription>

`ConciseBoundedDescription` displays all resources from a particular URL or endpoint.
Each resource is rendered as a `<Resource>` component.

Optionally, resources can be provided or dynamically determined that are treated as a "primary topic" or
"information resource". If present, the primary topic is displayed with the annotation "Primary topic".
If present, the information resource is displayed in a collapsed/compact state, showing only those
properties that are configured. The component may be expanded by the user.

```jsx
<ConciseBoundedDescription
  store={store}
  primaryTopic={namedNode('http://example.org/topic38')}
  determinePrimaryTopic={store => ... }
  informationResource={namedNode('http://example.org/doc38')}
  determineInformationResource={store => ... }
  resourceProps={{ ... }}
  prefixes={{ ex: 'http://example.org/' }}
  informationResourceCollapsedRows={rows}
/>
```

### `store`: `Store`
The data source.

### `primaryTopic`: `NamedNode` (optional)
Property to manually set the resource to be treated as the primary topic.

### `determinePrimaryTopic`: `(store: Store) => NamedNode | BlankNode | null` (optional)
Function to dynamically determine the primary topic.

### `informationResource`: `NamedNode` (optional)
Property to manually set the resource to be treated as the information resource.

### `determineInformationResource`: `(store: Store, primaryTopic: NamedNode | BlankNode | null) => NamedNode | BlankNode | null` (optional)
Function to dynamically determine the information resource.
The primary topic is determined *before* and passed to this function as well.

### `resourceProps`: `ResourceProps` (optional)
A subset of `<Resource>` props. Passed directly to rendered `<Resource>` components.

```jsx
type ResourceProps = {
  rows?: Row[];
  valueProps?: ValueProps;
  hideEmptyProperties?: boolean;
  showAllProperties?: boolean;
  formatPredicate?: (predicate: string, inverse: boolean, shorten: (resource: string) => string) => string | null;
  includeProperty?: (predicate: string, inverse: boolean) => boolean;
  disableAutoLabel?: boolean;
  disableLegacyFormatting?: boolean,
  prefixes?: any;
  renderHeading?: boolean;
};
```

### `prefixes`: `any` (optional)
An object of key-value pairs defining prefixes to apply to any rendering of property predicates, values and types of literals.
A set of default prefixes is built-in. The contents of `prefixes` are merged with the default prefixes.

### `informationResourceCollapsedRows`: `Row[]` (optional)
A set of row definitions that specify which properties will be displayed in the information resource component,
when it is in a collapsed (compact) state.

```jsx
type Row = {
  predicate: NamedNode;
  inverse?: boolean;
  label?: string;
  customRender?: (terms: Term[]) => JSX.Element;
};
```

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

### `search`: SearchListProps (optional)
The list will be sorted while typing when instant search is true (use when no suggestions are enabled, 
set to false when suggestions are provided)
Search will use all names in the TupleResult by default, or a custom list if provided.

When using bootstrap, use the following css to provide a cancel option in the input
```css
input[type=search]::-webkit-search-cancel-button {
      -webkit-appearance: searchfield-cancel-button;
    }
```

### `alphabeticIndexBar`: AlphabetIndexBarProps (optional)
When this property is provided a AlphabetIndexBar will be embedded with the TupleList. This AlphabetIndexBar filters the resuts of the list
based on the first letter of the provided `field`


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

`Resource` is a detailed view of a specified resource (IRI).
It is a list of properties (predicates) and their corresponding values (objects).

```jsx
<Resource
  store={store}
  resourceIri={resourceIri}
  rows={rows}
  valueProps={{
    linkBuilder: term => term.value,
  }}
  hideEmptyProperties
  showAllProperties
  formatPredicate={(predicate, inverse, shorten) => shorten(predicate)}
  includeProperty={(predicate, inverse) => true}
  disableAutoLabel
  disableLegacyFormatting
  prefixes={{
    ex: 'http://example.org/',
  }}
  renderHeading
  resourceType="SomeTypeToDisplay"
  className="some-css-class"
/>
```

### `store`: `Store`
The data source.

### `resourceIri`: `Term`
The IRI of the resource to be represented.

### `rows`: `Row[]` (optional)
Custom settings on how to represent the `Resource` view.
If not specified, all found properties are displayed.
See [`showAllProperties`](#showallproperties).

```jsx
type Row {
  predicate: NamedNode;
  inverse?: boolean;
  label?: string;
  customRender?: (terms: Term[]) => JSX.Element;
}
```

- `predicate: NamedNode` The predicate of the row being represented
- `inverse: boolean` If `true`, indicates the resource is the object of the predicate, not the subject
- `label: string` A readable representation of the predicate
- `customRender: (terms: Term[]) => JSX.Element` A way to add custom rendering to a row element

### `valueProps`: `ValueProps` (optional)
Properties that are passed to every `Value` component rendered by the `Resource`.

See [`<Value>`](#value) for more information.

### `hideEmptyProperties`: `boolean` (optional)
If `hideEmptyProperties` is `true`, any properties specified in `rows`, for which no values are present, are not displayed.
The default value is `false`.
If a `Row` has a `customRender`, it is unaffected by this setting.

### `showAllProperties`: `boolean` (optional)
If `showAllProperties` is `true`, any other properties found in the store, in addition to those specified in `rows`, are displayed.
Otherwise, only the properties defined in `rows` are displayed.
The default value is `false` if `rows` is specified, `true` otherwise.

### `formatPredicate`: `(predicate: string, inverse: boolean, shorten: (resource: string) => string) => string | null` (optional)
If `formatPredicate` is specified, it is invoked for each property, with the property's corresponding predicate.
The return value is used as a display label for the property link.

`formatPredicate` is invoked with the following arguments:
- `predicate: string` is the property's corresponding predicate
- `inverse: boolean` indicates whether or not the predicate's direction is inversed.
In other words, the specified resource is the object of the triple with this predicate, as opposed to the subject, as is normally the case.
- `shorten: (resource: string) => string` provides access to the built-in IRI shortening logic.

The specified `formatPredicate` function may return `null`.
If this occurs, the default mechanism is used as a fallback, which is:
- If the property is `inverse`, format as `"is {label} of"`, otherwise format as `"{label}"`.
- The value of `label` depends on the `disableAutoLabel` flag.
If `disableAutoLabel` is `true`, `label` is created by shortening the predicate IRI by applying default and configured prefixes. 
Otherwise, the predicate IRI's "local name" is used (the part after the last occurring `#` or `/`).

### `includeProperty`: `(predicate: string, inverse: boolean) => boolean` (optional)
If `includeProperty` is specified, it is invoked for every property not specified in `rows`, in order to determine whether or not to display it.
In other words, this is a property filter.
Properties specified in `rows` are unaffected.

### `disableAutoLabel`: `boolean` (optional)
Affects default formatting of property predicates as text.
If `true`, default formatting is shortening the predicate IRI by applying default and configured prefixes.
Otherwise, the predicate IRI's "local name" is used (the part after the last occurring `#` or `/`).
The default value is `false`.

### `disableLegacyFormatting`: `boolean` (optional)
This is a convenience flag that is directly passed to the `Value` components rendered by `Resource`.
The default value is `false`.

See [`<Value>`](#value) for more information.

### `prefixes`: `any` (optional)
An object of key-value pairs defining prefixes to apply to any rendering of property predicates, values and types of literals.
A set of default prefixes is built-in. The contents of `prefixes` are merged with the default prefixes.

Example:
```
{
  ex: 'http://example.org/',
  xyz: 'http://xyz.org/',
}
```

### `renderHeading`: `boolean` (optional)
If set to `true`, a resource heading is rendered.

### `resourceType`: `string` (optional)
A string representing a stereotype or type annotation, which is displayed in the resource heading, if enabled.

### `className`: `string` (optional)
CSS class(es) that are added to the resource's table element, as well as to its heading element, if any.

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

`Value` renders the value of the `Term`. `NamedNode` terms will be rendered as a link.

```jsx
<Value
  term={term}
  local={local}
  linkBuilder={term => term.value}
  formatString={literal => literal.value}
  formatLangString={literal => literal.value}
  formatOtherLiteral={(literal, shorten) => literal.value},
  prefixes={{
    ex: 'http://example.org/',
  }}
  getNamedNodeLabels={(namedNode, shorten) => [ ...literals... ]},
  disableLegacyFormatting
  disableLink
/>
```

### `term`: `Term`
The `term` which is represented.

### `local`: `boolean` (optional)
Whether the link text contains the local name or the full IRI. When no `local` is provided, it defaults to `false`.

### `linkBuilder`: `(term: Term) => string` (optional)
A callback function to be able to customize the `href` attribute of the link (only relevant for `NamedNode` terms).

### `formatString`: `(literal: Literal) => string` (optional)
If specified, `formatString` is invoked to format literals of type `xsd:string`.
The default implementation renders `literal.value`.

Has no effect unless `disableLegacyFormatting` is `true`.

### `formatLangString`: `(literal: Literal) => string` (optional)
If specified, `formatLangString` is invoked to format literals of type `rdf:langString`.
The default implementation renders `"{value} ({language})"`.

Has no effect unless `disableLegacyFormatting` is `true`.

### `formatOtherLiteral`: `(literal: Literal, shorten: (resource: string) => string) => string` (optional)
If specified, `formatOtherLiteral` is invoked to format literals of types that are not `xsd:string` or `rdf:langString`.
The default implementation renders `"{value} ({shorten(datatype)})"`.

Has no effect unless `disableLegacyFormatting` is `true`.

### `prefixes`: `any` (optional)
An object of key-value pairs defining prefixes to apply to any rendering of property predicates, values and types of literals.
A set of default prefixes is built-in. The contents of `prefixes` are merged with the default prefixes.

Example:
```
{
  ex: 'http://example.org/',
  xyz: 'http://xyz.org/',
}
```

### `getNamedNodeLabels`: `(namedNode: NamedNode, shorten: (resource: string) => string) => Literal[]` (optional)
If specified, `getNamedNodeLabels` is used to retrieve zero or more display labels to use when rendering a particular resource.
This may be used to look up `rdfs:label` values, for example.
The provided `shorten` function can be used to apply the standard IRI-shortening mechanism.

### `disableLegacyFormatting`: `boolean` (optional)
Flag to disable legacy formatting.
If `true`, the previous, simpler formatting logic is disabled, and more control is granted over formatting through various props.
In addition, without further configuration, rendering differences exist between modes.
For example, legacy mode does not shorten any IRIs, while the new mode does.

For sake of backwards compatibility, the default value is `false`.

### `disableLink`: `boolean` (optional)
If set to `true`, a resource value will not be rendered as a link, but as text only.
The default value is `false`.

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
