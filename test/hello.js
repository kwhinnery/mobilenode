// Require a pure JS module from npm...
var _ = require('underscore');

// User the natively defined alert function
exports.sayHello = function() {
    _.each(['hello', 'world'], function(str) {
        // this is a global defined by native code
        alert(str);
    });
};