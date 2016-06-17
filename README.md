# FetchFrame

FetchFrame is an easy to use, resource based system for using Facebook's dataloader library which makes it easier to handle per request permissions
and caching in a more terse way.

## Getting Started

The first step is installing FetchFrame via NPM

```sh
npm install --save fetchframe
```

As we have a dependancy on DataLoader you should also be aware that we require an implementation of the ES6 Map and ES6 Promise specification, which you should polyfill if necessary.

FetchFrame is centered around two fundamental concepts - a Frame and a Schema.

A Frame is a class that can be initialized for each request. Frames take a Schema and a Context as arguments which allows them to initialize a new set of interlinked DataLoader cache's for each request.

