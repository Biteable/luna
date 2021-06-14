# Luna 🌘

A collection of utilities an helpers for doing stuff in the browser with JavaScript.

## Usage

Install using a specific commit hash; eg

```
npm install https://github.com/dominicwhittle/luna#commitsha
```

Both TypeScript and JavaScript are included, with the JavaScript versions in the `js` directory.

In your scripts:

`import { addClass } from "luna/dom/class"` or `import { addClass } from "luna/js/dom/class" for the TypeScript and Javascript versions respectively.

You will likely want to use a bundler like browserify, es-build, webpack etc to build your code for use in the browser.


## Development

You'll need to install:

- [Node](https://nodejs.org/)
- [NVM](https://github.com/nvm-sh/nvm#installing-and-updating)
- [Yarn](https://yarnpkg.com/getting-started/install) (I install this globally)

Build:

```
nvm use
yarn build
```

Watch:

```
nvm use
yarn watch
```

### Building demo code

`yarn demo-index` and `yarn demo-scroll` will bundle the respective code in the `demo` dir for the browser.

To view the demo html files:

```
yarn serve-demos
```

For specific browser targetting you might want to try:

```
npx esbuild demo/scroll.ts --bundle --minify --sourcemap --target=chrome58,firefox57,safari11,edge79 --outfile=demo/scroll.bundle.js
```
