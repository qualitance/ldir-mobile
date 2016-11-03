## Install steps

1. Install bower plugins :  `bower install`
2. Install npm dependencies :  `[sudo] npm install`
3. Compile SASS and move files: `gulp`
4. Restore Plugins with the command `ionic state restore`
5. Add platforms:  `ionic platform add ios|android`
6. Build project:  `ionic build [ios|android]`
7. IOS/Android setup: change variable isIos AppConfig.js depending on platform
8. Copy www folder to project, without building:  `ionic prepare [ios|android]`

## Running the app

To run the app in the browser : `ionic serve`


## License

[GPL-3.0 license](https://opensource.org/licenses/GPL-3.0)