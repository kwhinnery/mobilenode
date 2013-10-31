# MobileNode

This repository contains the node command line tool which allows node.js programs (packaged with browserify) to be run in mobile apps. Check out the [companion iOS repo](https://github.com/kwhinnery/mobilenode-ios) here).  This tool can be used to create a pre-packaged node.js program to include in an iOS app bundle, or can start a WebSocket server to stream live updates to a running MobileNode app.

## Apologies

Until things settle down, I won't be writing a lot of documentation. I do pinky swear, however, to provide useful API docs and guides ASAHP.

## Usage (Short Version)

MobileNode requires that your native iOS project be using Cocoapods.  To create a Cocoapods enabled iOS app project with Xcode, [check out their documentation](http://cocoapods.org/).  The short version is this:

#### The native part:
* Terminal: `gem install cocoapods`
* Terminal: `pod setup`
* Create an iOS project through Xcode
* Navigate to the location of the `.xcodeproj` folder Xcode created in the Terminal
* Create a file called `Podfile` with the following:

~~~
platform :ios, '7.0'
pod 'MobileNode', :git => 'git://github.com/kwhinnery/mobilenode-ios'
~~~

* Run `pod install`
* Open the Cocoapods-enabled Xcode __Workspace__ (use this from now on): `open *xcworkspace` (You may need to quit Xcode first - Xcode is an a-hole sometimes)

#### The node part
* Install [node.js](http://nodejs.org/)
* Run `npm install -g mobilenode`
* create a file `app.js` with the following: `alert('hello mobile node!');`
* Run `mnode serve app.js`

#### The native part (again)
* In your Xcode Workspace, open your iOS app's app delegate (it will be `XXXAppDelegate.m`)
* At the top, add `#import "MobileNode.h"`
* In `application:didFinishLaunchingWithOptions:`, add the following: `[MobileNode developOnHost:@"localhost" port:8080];`
* Run your app in the iOS simulator
* High five your co-worker

Now, whenever you change your node.js code, changes will be streamed immediately to the simulator and run in a new JS context - a bit like hitting refresh in the browser.

## TODO

Lots. Here's what's top of mind right now on the node side of things:

* Use of browserify is basically a lame passthrough. Expose more options for output.
* Provide option to uglify code in the bundle command
* Shim core node libraries with native implementations.  Figure out how best to hack browserify to use our alternate native code-calling JavaScript shims.
* Implement a REPL that is aware of the browserified module environment and communicates over our socket connection to the running app
* Find a way to create meaningful automated tests in the mobile device execution environment
* Proper end user documentation with screenshots for the Xcode bits
* Extensively document native module publishing and integration process

