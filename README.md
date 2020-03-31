# Create Ocean App [![Styled with Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://prettier.io) [![Commitizen Friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-blue.svg)](https://github.com/facebook/create-react-app/blob/master/CONTRIBUTING.md)

Create Ocean-powered React apps with one command.

Create Ocean App works on macOS, Windows, and Linux.<br>
If something doesn’t work, please [file an issue](https://github.com/TomAFrench/create-ocean-app/issues/new).<br>
If you have questions or need help, please ask in our [Discord](https://discord.gg/) community.

## Quick Overview

```sh
yarn create ocean-app my-ocean-app
cd my-ocean-app
yarn react-app:start
```

If you've previously installed `create-ocean-app` globally via `yarn global add create-ocean-app`, we recommend you
uninstall the package using `yarn global remove create-ocean-app` and use the `yarn create ocean-app` shorthand to ensure that you use the last version.

Then open [http://localhost:3000/](http://localhost:3000/) to see your app.<br>
When you’re ready to deploy to production, create a minified bundle with `yarn run react-app:build`.

<p align="center">
<img src="./screencast.gif" width="600" alt="yarn react-app:start">
</p>

## Creating an App

**You’ll need to have Node 8.16.0 or Node 10.16.0 or later version on your local development machine** (but it’s not required on the server). You can use [nvm](https://github.com/creationix/nvm#installation) (macOS/Linux) or [nvm-windows](https://github.com/coreybutler/nvm-windows#node-version-manager-nvm-for-windows) to switch Node versions between different projects.

**You'll also need Yarn on your local development machine**. This is because Create Ocean App relies on Yarn
Workspaces, a feature not supported by Npm.

To create a new app, you may use the following method:

```sh
yarn create ocean-app my-ocean-app
```

_[`yarn create <starter-kit-package>`](https://yarnpkg.com/lang/en/docs/cli/create/) is available in Yarn 0.25+_

It will create a directory called `my-ocean-app` inside the current folder.<br>

Inside that directory, it will generate the initial project structure, assuming you did not provide a custom [template](https://github.com/TomAFrench/create-ocean-app#templates):

```
my-ocean-app
├── README.md
├── node_modules
├── package.json
├── .gitignore
└── packages
    ├── contracts
    │   ├── README.json
    │   ├── package.json
    │   └── src
    │       ├── abis
    │       │   └── erc20.json
    │       ├── addresses.js
    │       └── index.js
    └── react-app
        ├── README.md
        ├── package.json
        ├── node_modules
        ├── public
        │   ├── favicon.ico
        │   ├── index.html
        │   └── manifest.json
        └── src
            ├── App.css
            ├── App.js
            ├── App.test.js
            ├── ethereumLogo.svg
            ├── index.css
            ├── index.js
            ├── serviceWorker.js
            └── setupTests.js
```

Once the installation is done, you can open your project folder:

```sh
cd my-ocean-app
```

Inside the newly created project, you can run some built-in commands:

<!-- ### Templates

Create Ocean App comes with a host of decentralized finance templates with pre-filled contract ABIs and addresses. Peek into the [templates](/templates) folder to see what options are available and pass the name of the folder as the value for the `--template` argument.

As an example:

```sh
yarn create ocean-app my-ocean-app --with-template compound
``` -->

## Packages

### React App

To learn React, check out the [React documentation](https://reactjs.org/).

#### `yarn react-app:start`

Runs the React app in development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will automatically reload if you make changes to the code.<br>
You will see the build errors and lint warnings in the console.

#### `yarn react-app:test`

Runs the React test watcher in an interactive mode.<br>
By default, runs tests related to files changed since the last commit.

[Read more about testing React.](https://facebook.github.io/create-react-app/docs/running-tests)

#### `yarn react-app:build`

Builds the React app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>

Your React app is ready to be deployed.

## How to Update to New Versions?

If you're using the `yarn create ocean-app` shorthand (the recommended approach), Yarn will automatically update Create Eth
App for you.<br/>

Otherwise, you will receive a warning in the shell with the instructions for how to update:

```
A new version of `create-ocean-app` is available!
You can update by running: yarn global add create-ocean-app
```

## Philosophy

- **Minimalistic by design:** You are one command away from creating a new Ocean-powered React app. No intermediary installs, scripts or shims.

- **End-to-End**: Create Ocean App provides you everything that you need to build and maintain an Ocean-powered React app
  at scale, by bringing Yarn Workspaces, Create React App and Ocean Protocol under one roof

- **Not Reinventing The Wheel**: Under the hood, you use Create React App, one of the most popular and battle-tested frontend development
  environments.

## What’s Included?

Your environment will have everything you need to build a modern Ethereum-powered single-page React app:

- Smooth project management via [Yarn Workspaces](https://classic.yarnpkg.com/en/docs/workspaces/)
- Everything included with [Create React
  App](https://github.com/facebook/create-react-app/blob/master/README.md#whats-included): React, JSX, ES6, TypeScript
  and Flow syntax support
- Minimalist structure for managing the smart contract [ABIs](https://ethereum.stackexchange.com/questions/234/what-is-an-abi-and-why-is-it-needed-to-interact-with-contracts) and addresses
- Hassle-free updates for the above tools with a single dependency

## Credits

This project exists thanks to all the people who contributed:

- [@TomAFrench](https://github.com/tomafrench)

Along with the creators of create-eth-app

- [@PaulRBerg](https://github.com/paulrberg)
- [@KadenZipfel](https://github.com/kadenzipfel)

## Acknowledgements

We are grateful to the authors of existing related projects upon which create-ocean-app is based:

- [create-eth-app](https://github.com/paulrberg/create-eth-app)

## License

Create Ocean App is open source software [licensed as
MIT](https://github.com/TomAFrench/create-ocean-app/blob/develop/LICENSE).
