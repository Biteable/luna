# Koto

A collection of utilities an helpers for doing stuff in the browser with JavaScript.

## Usage

Until this hits version 1.*.* things are going to change so install using a specific commit hash.

```
npm install https://github.com/dominicwhittle/koto#e5e3737
```

Both TypeScript and JavaScript are included, with the JavaScript versions in the `dist` directory.

You will likely want to use a bundler like browserify, es-build, webpack etc.


## Development

You'll need to install:

- [Node](https://nodejs.org/)
- [NVM](https://github.com/nvm-sh/nvm#installing-and-updating)
- [Yarn](https://yarnpkg.com/getting-started/install) (I install this globally)

Build:

```
yarn build
```

Watch:

```
yarn watch
```


## Purpose

Part utility, part documentation, part explanation.

Not just `offset` helpers, but an explanation of when and why you would use the different available offset/position type of helpers. You don't have to use the utilities, just having them on hand with their explanation in the source is the goal. Along with recommendations about browser support.


## Vanilla

- `style` helps quickly assign an object of styles and returns the element for "chaining".
- `classList` adds missing methods and the toggle force argument and returns the element for chaining.
- `query`, `queryAll`, `find`, `findAll` save some boilerplate and always return a HTMLElement and arrays of elements (instead of a node list) in the *All functions.

### Some additions?

- Generic "do something, return element" fn?
- Dimensions like height, offset/position.
- Append/Prepend, before/after methods for insterting, moving elements.
- Maybe an attributes or similiar function for adding multiple attributes at once?
- keycodes

Many of these won't be immediately useful but will useful as a reference for how to use the DOM APIs directly.

Utils
- clamp
- isNumeric
- pipe
- xhr?


Tips
----

Dimensions

`Element.offsetWidth` vs `Element.getBoundingClientRect()`

`Element.offsetWidth` is easiest to use and the vast majority of the time it is the same value as `Element.getBoundingClientRect()`. The former returns the _layout_ dimensions, while the latter takes transforms into account, and correctly returns the rendered position after any transforms (translates and scales etc) have been applied.

> If you need to know the actual size of the content, regardless of how much of it is currently visible, you need to use the Element.scrollWidth and Element.scrollHeight properties. These return the width and height of the entire content of an element, even if only part of it is presently visible due to the use of scroll bars.
— https://developer.mozilla.org/en-US/docs/Web/API/CSS_Object_Model/Determining_the_dimensions_of_elements

I suspect that applies when you have a scrollable element that while perhaps is displaying at 100px might actually be 600px high of the overflow was turned off.


Polyfills
---------

@todo complete this. Add to each function.

`Object.assign` -> style required for all versions of Internet Explorer
