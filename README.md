# MobileNode

MobileNode is a tiny node-like environment for native mobile apps.  Focus will initially be on iOS 7 using the JavaScriptCore framework, but it should be possible to get this thing can get rolling on Android some day.

## Current Status

Currently, this only works with my locally hacked environment and is not published to npm.  Targeting an initial npm release with docs and the companion iOS framework in mid-November.  To get a taste of what a JS module that calls native code might look like, periodically check out the little SpriteKit demo in the `test` directory.

## How It Works Right Now

You write a node.js program (with package.json and npm dependencies, etc.).  The `mobilenode` command line utility will use [browserify](https://github.com/substack/node-browserify) to package it up, and fire up a WebSocket server to ship your code (and any changes) in real time to a connected iOS device.

On the iOS side, the MobileNode framework will create a JavaScript execution environment, bootstrap it with hooks to call into and out of native code, and connect to our local WebSocket server.  It will grab the JS source from your app, and eval it using JavaScriptCore.  Your JS code may or may not be configured to call out to native code to do native stuff.  

A standard library of native modules will already be made available to JS, but additional native functionality must be implemented using the rudimentary MobileNode extension interface (basically defining blocks that can be called from JS, and a method that can fire a method call into JS).

The initial demo and reference implementation for a native module will be a module that exposes the SpriteKit 2D game engine to JavaScript.  This module will, like MobileNode, exist as both an npm module that defines a JS interface, and a companion native module that does the native magic under the hood.

## Usage

__UNDER CONSTRUCTION! - this is not going to work for you yet, but this will be the gist of it.  Compiling doc notes here in the meantime.__

Using mobilenode requires both a working [node.js](http://www.nodejs.org) environment, as well as an installation of the latest [Xcode](https://developer.apple.com/xcode/) (currently version 5).

Begin by installing the mobilenode command line utility:

        [sudo] npm install -g mobilenode

You'll need to use the MobileNode framework for iOS in order to run node.js programs in your mobile app.  The easiest way to do this is to create a new native app using a MobileNode Xcode project template (coming soon, think I have figured out how to do this).  MobileNode will also be made available as a CocoaPod, and this is likely to be the preferred installation and usage method going forward.

Alternately, you can drop `MobileNode.framework` into your existing Xcode project.  The MobileNode framework will require you to link against the following binaries/frameworks:

* Foundation.framework
* Security.framework
* CFNetwork.framework
* JavaScriptCore.framework
* libicucore.dylib

In your MobileNode iOS project, include the following in your `application:didFinishLaunchingWithOptions:` method in your app delegate (or whenever you want to start running your node.js program):

~~~
#import <MobileNode/MobileNode.h>
// ...

@implementation MNAppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
    [MobileNode go];
    return YES;
}
~~~

For development, you'll probably want to start the local mobilenode server to stream changes to your local program to the device.  To enable this, use the `mnode` or `mobilenode` utilities you installed earlier:

        mnode serve app.js

This will launch a WebScoket server (using ws) on port 8080.  Specify a custom port with the `-p` option.

Alternately, you can bundle up your app and dump its contents to a file:

        mnode bundle app.js > mnbundle.js

You can drop this file, named `mnbundle.js`, into your Xcode project.  This will be the fallback file the iOS side of MobileNode loads if it can't connect to a server.

Now, in Xcode, launch your native app.  As you make changes to your JS source, they will be streamed out without you having to launch the native app again.

## TODO

Lots. Here's what's top of mind right now on the node side of things:

* Use of browserify is basically a lame passthrough. Expose more options for output.
* Provide option to uglify code in the bundle command
* Shim core node libraries with native implementations.  Figure out how best to hack browserify to use our alternate native code-calling JavaScript shims.
* Implement a REPL that is aware of the browserified module environment and communicates over our socket connection to the running app
* Find a way to create meaningful automated tests in the mobile device execution environment
* Proper end user documentation with screenshots for the Xcode bits
* Extensively document native module publishing and integration process

