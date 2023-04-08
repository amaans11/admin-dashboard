# Admin Dashboard


Release branch points to [staging][stage] environment and dev branch points to [dev][dev] environment. Feature branchs are used to test on localhost.

> Staging env will be updated on wekly basis
> Dev environment can be tested by dev hence can be updated daily

### Tech

We are using ant design framwork for UI react library and react as base. Create-react-app is the bilerplate for build and dev setup. For CSS, we are using Sass as pre-processor. You need following packages to run this project locally.

* [node.js] - As package mangaer
* [yarn] - fast node.js substitude package manager buid by facebook
And of course a text editor if need to check some changes.

### Installation

Install the dependencies and devDependencies and start the server.

```sh
$ cd admin-dashboard
$ npm install
```
For dev locally

```sh
$ npm start
```
For production build environments...

```sh
$ npm build
```

### Plugins

There are various plugins used by dashboard. You can find list for all of them in package.json. 
