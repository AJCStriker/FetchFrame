# FetchFrame

FetchFrame is an easy to use, resource based system for using Facebook's [DataLoader](https://github.com/facebook/dataloader) library which makes it easier to handle per request permissions
and caching in a more terse way.

```javascript
npm install --save fetchframe
```

## Example

```javascript
import { Frame, Schema } from "fetchframe"

// Create a Schema
let mySchema = new Schema({
    resources: {
      User: {
        dimensions: {
          id: {
            dimensionKey: (user_object) => user_object.id,
            retrieve: (query, context) => {

              if ( context.ip === "0.0.0.0") {
                return getAllUsersByIds(query)
              } else {
                return getSomeUsersByIds(query)
              }

            }
          }
        }
      }
    }
})

let firstFrame = new Frame(mySchema, {
  authenticationToken: "person1",
  ip: "192.168.1.1"
})

firstFrame.User.loadById(1)
  .then((user) => {
    // User is fetched and cached, with the correct permission
    // level from the datastore for the lifetime of the frame!
  })

```

The above is just a quick example of how the system works - read the [Getting Started](docs/getting_started.md) Guide to learn more!

## Documentation

[Getting Started](docs/getting_started.md)

[API Documentation](docs/API.md)

## Tests

Test are run on Codeship's Docker platform - all PRs must pass linting, unit tests and Node Security Project validations.

[Current Status Badge]()

## Contributing

Any contributions are welcome as long as they are within scope and maintain compatibility. You can open an issue to discuss a change if you are unsure - or just send the Pull Request and have the conversation.

**Please note all Pull Requests must pass the full test battery**

## Credit

Depends on and inspired by the excellent DataLoader library from Facebook.

Sponsored by [Doorpass](https://doorpass.io) - The simplest and safest way to manage your team's access to cloud services
