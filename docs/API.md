# API Documentation

## Table of Contents

1. [Exports](#exports)
2. [Frame](#frame)
3. [Schema](#schema)

## Exports

The FetchFrame package exports two classes Frame and Schema. All examples are in ES6 although the package can easily be loaded using require("fetchframe").Frame style syntax as well.

## Frame

### new Frame(schema [, context])

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

### loadBy(dimension, query)

Query for the DataType using the specified dimension and query.

**dimension**

`dimension` is a string representing the dimension to query

**query**

`query` is a string representing the value of the dimension you wish to retrieve.

The Frame will automatically generate helper methods for each dimension. The following two calls are exactly the same:

```javascript
DataStore.User.loadBy("id", 15) === DataStore.User.loadById(15)
```

### markDirty(object)

Provide a Object of the data type that can be mapped using the dimension keys for the Schema. This will be run through each dimension key function and then invalidated from the dimension cache accordingly.

### nuke()

Remove all items from the cache for the given DataType.

## Schema

Schemas are built by passing a JSON object into the constructor function that represents the different data types in the Frame and the methods used to fetch them.

Behind the scenes the Schema is responsible for taking the user's provided information and building out the necessary DataLoader instances for those dimensions to be queried.

The Schema is where most of the "magic" happens allowing the necessary wiring to be initialized for the useful features such as accessor functions and cross caching of objects.
