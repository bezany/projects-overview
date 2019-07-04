# projects-overview

Show simple dashboard with git projects overview.

For each projects from parent folder (excludes this project) shows:

+ name (folder name)
+ git remotes urls
+ publish path from `deploy.reloaded` plugin for VSCode (very specific case)
+ documentations (copy from folder ['docs', 'doc', 'documentation'] if exists)
+ README.md

## Prerequisites

Need node version 10 for [fs Promises API](https://nodejs.org/dist/latest-v10.x/docs/api/fs.html#fs_fs_promises_api)

## Quick start

```bash
## in projects folder
git clone https://github.com/bezany/projects-overview.git
cd projects-overview
npm install
npm run dev_all
```

## Build Setup

``` bash
# install dependencies
npm install

# collect projects data
npm run overview

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## Collect data

For collect data about projects used sub-project `src_collector`.

You can filter project by git remotes urls. For this use argument `filter-git-remotes` (alias `f`).

### Example

```bash
cd src_collector
npm run run -- --f="github"
cd ..
npm run dev
```

## Built With

+ [vue](https://vuejs.org/) - The Progressive JavaScript Framework
+ [Vuetify.js](https://vuetifyjs.com) - Vue.js Material Component Framework
+ [git-js](https://github.com/steveukx/git-js) - Open-source JavaScript library for interactive maps
+ [vue-markdown](https://github.com/miaolz123/vue-markdown) - Markdown Parser for Vue
+ [vue-async-computed](https://github.com/foxbenjaminfox/vue-async-computed) - Async computed properties for Vue.js
