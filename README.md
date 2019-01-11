## dabterm - Docker Tab Term

The idea: a terminal that detects your running docker containers and creates a tab for each with an `exec bash`.

To do:

* Not all containers have `base`, or are configured with an `entry-point`, how to detect that?  Or just display the list of containers, and make it a user action to `exec`, or move to configuration?
* [node-docker-api](https://www.npmjs.com/package/node-docker-api) to find all the containers, and update the UI when containers stop / killed / start.
* Switch to a neater framework like react / angularjs.
* Make the UI more like an app:
  * http://photonkit.com/components/ or https://ant.design/
  * Menus that make sense
  * Resize the terminal window with app resize

![](ubuntu.png)

Note: `npm install ; npm start` only appears to be happy in node v8 carbon.  Other versions of node are getting:

```
The module '/Users/russell.sayers/Documents/TestingZone/dabterm/node_modules/node-pty-prebuilt/build/Release/pty.node'
was compiled against a different Node.js version using
NODE_MODULE_VERSION 64. This version of Node.js requires
NODE_MODULE_VERSION 57. Please try re-compiling or re-installing
```
