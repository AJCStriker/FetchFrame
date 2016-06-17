# Getting Started

## Step 1 - Installing FetchFrame
The first step is installing FetchFrame via NPM

```sh
npm install --save fetchframe
```

As we have a dependancy on DataLoader you should also be aware that we require an implementation of the ES6 Map and ES6 Promise specification, which you should polyfill if necessary.

## Step 2 - Creating a Schema

FetchFrame is centered around two fundamental concepts - a Frame and a Schema.

A Frame is a class that can be initialized for each request. Frames take a Schema and a Context as arguments which allows them to initialize a new set of interlinked DataLoader cache's for each request.

However to create a Frame we first need a Schema. The Schema is an object that lays out individual resources in your DataLayer, the "dimensions" you wish to query them by and methods for caching items.

Let's see how this works by creating a new Schema for a simple web application.

```javascript
import { Schema } from "fetchframe"

let mySchema = new Schema({
  resources: {
    User: {
      dimensions: {
        id: {
          dimensionKey: (user_object) => user_object.id,
          retrieve: (query) => {
          /*
             Do any pre processing you wish for query
             you could even query different databases
             if you need to do multi database sharding;
             For example if each application tennant
             uses a unique database.
           */

            return MyDatabase.getUsersByIds(query)
          }
        },
        email_address: {
          dimensionKey: (user_object) => user_object.name.email_address,
          retrieve: (query) => MyDatabase.getUsersByEmails(query)
        }
      },
      cache: true
    }
  }
})
```

Okay so what does all of this mean?

The full documentation for the Schema constructor is provided below but from a high level we have told our application this: We have a type called User, we want to be able to **query and retrieve** that type using two possible dimensions ID and First Name. We then provided the dimensionKey field for each dimension. This maps an object of the Type, in our case User, to the key that would returned the same object for this query.

The dimensionKey is used to populate the cache of each dimension with a response to any dimension in the Type. For example if a user was retrieved by ID in the above example - they would also get cached by their email_address in the email_address dimension loader reducing the amount of wiring needed to use the original DataLoader system effectively.

## Step 3 - Creating a Frame

A Frame is essentially a disposable instance of a Schema that represents a unique context and cache.

Frames are designed to accept a context primarily to serve authentication and multi tenant use cases. Let's take a look at an example:

```javascript
import Schema from "./schema.js"
import { Frame } from "fetchframe"

export let FrameMiddleware = (req, res, next) => {

  // Create a context for the DataFrame - you can pass any information you want to the context - although passing req itself is a bit of an anti pattern.
  let context = {
      authenticated_user: req.authenticatedUser,
      Marco: "Polo",
      ip: req.ip
  }

  let frame = new DataFrame(Schema, context)

  req.DataStore = frame

}
```

## Step 4 - Querying using the DataStore

Now that we have a Frame setup let's see how we can make queries to the underlying types themselves

```javascript

export let requestHandler = (req, res) => {

  let email_address = req.query.email_address

  let resultPromise = req.DataStore.User.loadByEmailAddress(email_address)

  resultPromise
    .then((user) => {

      /*
       This returns instantly and does not start a fetch request
       because the result has already been cached at the data layer
       even though it was queried by another dimension
      */
      return req.DataStore.User.loadById(user.id)

    })
    .then((user) => {

      res.render('a template', { user })

    })

}

```

What just happened? Where did that method come from? FetchFrame will automatically create CamelCased handlers for your Frame that make it really easy to load data by the dimensions defined. All of this comes with the benefit of being automatically cached and making the minimum number of database calls possible to speed up your application!

Dimension names are camel cased for the function so you should take care not to overlap your dimension names for a given type. If you do an error will be thrown at Schema creation time - so you won't be able to start your app.

## Step 5 - Marking a mutation

The caching layer in FetchFrame is a small wrapper around the normal DataLoader caching system in the original facebook library. To make life a bit easier it automatically handles cache storage across your dimensions for the same type.

One place this becomes troublesome is when you want to load an object, thus adding it to the cache, then modify it and fetch it again ( for some reason ) - this can be resolved by providing the item and marking it as dirt like so:

```javascript
DataStore.User.markDirty(user)
```

It should be noted that you will need to provide an object that provides all the necessary dimensionKeys - If a dimension key returns an undefined value the item will not be cleared from that particular dimensions cache which could lead to inconsistencies.

Finally you can destroy the cache of your Frame if you need to - perhaps if you use a long lived connection like a WebSocket and want to regularly clear your cache to reduce memory use?

You can do this as follows:

```javascript
DataStore.User.clearAll()
```

## All Done - Thanks for reading

Congratulations! You are now familiar with the basics of FetchFrame. It is highly recommended that you read the API docs and the specific documentation for Frame and Schema before using it in production - but if you are the hacker type you should have enough to run with!
