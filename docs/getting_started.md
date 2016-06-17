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
