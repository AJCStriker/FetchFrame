# API Documentation

## Table of Contents

1. [Exports](#exports)
2. [Frame](#frame)
3. [Schema](#schema)

## Exports

The FetchFrame package exports two classes Frame and Schema. All examples are in ES6 although the package can easily be loaded using require("fetchframe").Frame style syntax as well.

## Frame

### new Frame(schema: Schema [, context: Object])

Create a new `Frame` for the desired Schema with the given context.

Frames also provide isolated caches - so data will not leak from one Frame to another. Frames will be garbage collected and disposed once they are no longer needed preventing unnecessary memory consumption over time.

**schema**

`schema` takes a Schema object to be used as the request layer's Schema for building out dimension arguments and caches

**context**

`context` takes a generic JavaScript object that is passed to batch requesters to account for when requesting new content.

### Frame Object

The Frame object has all of the types in the Schema added to its prototype so you are able to access them using `Frame.TYPE`.

When accessing a type it will return a DataType object which can then be queried and mutated.

## DataType

The DataType object exposes the different query and cache functions for an individual type in the Frame schema.

### loadBy(dimension: String, query: String)

Query for the DataType using the specified dimension and query.

**dimension**

`dimension` is a string representing the dimension to query

**query**

`query` is a string representing the value of the dimension you wish to retrieve.

The Frame will automatically generate helper methods for each dimension. The following two calls are exactly the same:

```javascript
DataStore.User.loadBy("id", 15) === DataStore.User.loadById(15)
```

### markDirty(object: Object)

Provide a Object of the data type that can be mapped using the dimension keys for the Schema. This will be run through each dimension key function and then invalidated from the dimension cache accordingly.

**object**

`object` is a string representing the value of the dimension you wish to retrieve.

### nuke()

Remove all items from the cache for the given DataType.

## Schema

Schemas are built by passing a JSON object into the constructor function that represents the different data types in the Frame and the methods used to fetch them.

Behind the scenes the Schema is responsible for taking the user's provided information and building out the necessary DataLoader instances for those dimensions to be queried.

The Schema is where most of the "magic" happens allowing the necessary wiring to be initialized for the useful features such as accessor functions and cross caching of objects.

### new Schema(schema: Object)

**schema**

`schema` is a JSON object that allows you to configure the options and structure of your data frame. The options below are documented in reference to the following JSON snippet from the Getting Started guide:

```javascript
{
  resources: {
    User: {
      dimensions: {
        id: {
          dimensionKey: (user_object) => user_object.id,
          batch: true,
          cache: true,
          retrieve: (query, context) => getUsersByIds(query)
        }
      },
      cache: true
    }
  }
}
```

**resources**

`resources` is a top level key in the schema object that defines the different data types present in your system and how to access them.

Each key in the resources object will be converted into a DataSource with the key value as the name.

Each resource object can have the following settings:

**resource.cache** - Controls whether this object will be cached at all. This is useful if for some reason you wish to fetch information separately each time you need it.

Defaults to true.

**resource.dimensions** - Dimensions is a JSON object where each key is a dimension by which the DataType can be queried and cached. The format of the Dimension object can be found below.

**resource.dimensions[].dimensionKey** - The dimensionKey is a function that takes a complete object of the form returned by the retrieve function and returns an Immutable object that fulfills equality comparison via ```===```. Normally this will be a string but anything that for the same input will return an exactly equal response can be used.

The generated key is used to reference the different caches across the loaders.

Note currently that Objects and Maps do not work but we would like to find a way to support them.

**resource.dimensions[].batch** - The Batch flag is used to determine if the resolve function handles multiple or single queries. Normally the retrieve function is provided with an array of keys and should return an array of promises. When batch is set to true retrieve will instead be passed an individual key and should return a individual response instead.

The default setting is true and there are no use cases we are aware of at this time where it is necessary to disable batching. It is carried forward into this library out of respect for Facebook's undoubtedly superior minds thinking it's needed. If you do have a use case for this please let us know by opening an issue explaining how you are using it!

**resource.dimensions[].cache** - The Cache flag is used to mark this particular dimension as being un-cacheable - particularly useful for situations where you want to return multiple items for a given query which would otherwise interfere with the cache due to the non standard format. This does not disable the underlying cache on DataLoader it only disables the cross caching mechanism meaning that calls to the same dimension will still be served from the cache if possible.

The default settings is true.

**resource.dimensions[].retrieve** - The Retrieve function is used to accept an array of query terms for the given dimension and return an array of promises, in the same order as the argument array, which resolve to the end value of the DataType.

For example a retrieve function might accept an array of User IDs then perform a batched query to a SQL database to retrieve information about those users.

The following arguments are passed to retrieve:

```javascript
function retrieve(query, context)
```

```query``` is the key that will be indexed by DataLoader. It

```context``` is the JSON object that was provided to the Frame at construction. This allows the query to scope itself to a particular tenant or authorization level.
